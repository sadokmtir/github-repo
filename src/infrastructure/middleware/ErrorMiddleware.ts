import {Request, Response, NextFunction, Application} from 'express';
import logger from '../logging/Logger';
import {HTTPClientError} from './exceptions/HttpClientError';
import HttpException from './exceptions/HttpException';

export const handle404Error = (router: Application) => {
    router.use((req: Request, res: Response) => {
        throw new HttpException(404, 'Method not found.');
    });
};

export const handleClientError = (router: Application) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        if (err instanceof HTTPClientError) {
            logger.warn(err);
            res.status(err.status).json({ error: err.message });
        } else {
            next(err);
        }
    });
};

export const handleServerError = (router: Application) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err);
        if (process.env.NODE_ENV === 'production') {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(500).send(err.stack);
        }
    });
};
