import axios, { AxiosInstance, AxiosResponse, CancelTokenSource } from 'axios';
import * as express from 'express';
import moment from 'moment';
import { Readable } from 'stream';
import Nconf from '../Nconf';
import StreamTransformer from '../stream/StreamTransformer';
import QueryBuilder from '../QueryBuilder';
import logger from '../logging/Logger';

const PARAM_TRIM = /[\s'"]/g;
const URL_TRIM = /[<>\s'"]/g;
const CancelToken = axios.CancelToken;

export default class GithubClient {
    private instance: AxiosInstance;

    constructor() {
        this.instance = axios.create({
            baseURL: `${Nconf.get('remoteServer:url')}search/`,
            timeout: 5000,
        });
    }

    public fetchRepositories = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const { top, since, language } = request.query;
        const staringDate = since ? moment(since).toISOString() : moment().subtract(7, 'days').toISOString();

        const queryBuilder = new QueryBuilder();
        queryBuilder.since(staringDate).withLanguageFilter(language).sort();

        if (top) {
            const searchQuery = queryBuilder.maxPerPage(+top).getQuery();
            try {
                const res = await this.instance.get(`repositories?${searchQuery}`);
                return response.status(200).json(res?.data?.items ?? []);
            } catch (e) {
                if (e?.response?.statusText === 'rate limit exceeded') {
                    await this.waitForRateLimit(e.response);
                    await this.fetchRepositories(request, response, next);
                    return;
                }

                return next(e);
            }

        }
        this.fetchReposStream(response, queryBuilder);
    };

    // fetch repos since last week sorted by number of stars, uses streams for speed and less memory footprint
    private fetchReposStream(response: express.Response, queryBuilder: QueryBuilder) {
        const JsonStream = new StreamTransformer();
        const searchQuery = queryBuilder.maxPerPage(50).getQuery();


        const source = CancelToken.source();
        const readable = Readable.from(this.getReposPerPageAndDate(1, searchQuery, source));

        readable.pipe(JsonStream).pipe(response.type('json')).on('close', () => {
            readable.unpipe();
            source.cancel('client closed stream');
        });
    }

    //@Note: I choose to use streams here because of the big size of the data, but I could also use pagination
    //using top was without stream as it does not involve much time and date to serve back
    private async* getReposPerPageAndDate(page: number, searchQuery: string, source: CancelTokenSource): any {
        logger.debug('fetching page number %d at %s', page, moment().format());
        try {
            const res = await this.instance.get(`repositories?${searchQuery}&page=${page}`, {
                cancelToken: source.token
            });

            yield res.data.items;

            const rateLimitingRemaining = res.headers['x-ratelimit-remaining'];
            const nextPageUrl = this.getNexPageUrl(res.headers.link);
            if (!nextPageUrl) {
                return;
            }

            if (rateLimitingRemaining < 2) {
                await this.waitForRateLimit(res);
            }

            const result = nextPageUrl.match(/&page=(\d{1,3})/);
            const pageNumber = +result[1] ?? 0;
            if (pageNumber > page) {
                yield* this.getReposPerPageAndDate(pageNumber, searchQuery, source);
            }

        } catch (error) {
            if (axios.isCancel(error)) {
                logger.info('Stream cancelled, reason: %s', error.message);
                return;
            }
            logger.error(error, { body: error?.response?.data, headers: error?.response?.headers });
            //@Note: due to limitation from github I get the rate limit exceeded error
            // although I do wait up like in the x-ratelimit-reset header
            //@Note: I could use redis to better cache the results and make less requests to github and gain more speed
            if (error?.response?.statusText === 'rate limit exceeded') {
                await this.waitForRateLimit(error.response);
                yield* this.getReposPerPageAndDate(page, searchQuery, source);
            }
        }
    }

    private async waitForRateLimit(res: AxiosResponse) {
        const retryDate = moment.unix(res.headers['x-ratelimit-reset']);
        const now = moment();
        const waitTime = retryDate.diff(now) + 1000;
        logger.debug('sleeping %d ms', waitTime);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    private getNexPageUrl(linkHeader: string) {
        if (linkHeader) {
            const linkHeaders = linkHeader.split(',');
            for (const linkValue of linkHeaders) {
                const linkParts = linkValue.split(';');
                const url = linkParts[0].replace(URL_TRIM, '');

                const paramParts = linkParts[1].split('=');
                const key = paramParts[0].replace(PARAM_TRIM, '');
                const value = paramParts[1].replace(PARAM_TRIM, '');
                if (key == 'rel' && value === 'next') {
                    return url;
                }
            }
        }

        return null;
    }
}