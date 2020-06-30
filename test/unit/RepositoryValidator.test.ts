import 'reflect-metadata';
import * as express from 'express';
import moment from 'moment';
import RepositoryValidator from '../../src/validators/RepositoryValidator';
import HttpException from '../../src/infrastructure/middleware/exceptions/HttpException';
import { ISO_DATE_ERROR_MESSAGE, LANGUAGE_ERROR_MESSAGE, TOP_ERROR_MESSAGE } from "../../src/dto/QueryParamsDto";


describe('test the Repository validator', () => {
    let mockNext: jest.Mock;
    let mockResponse: express.Response;
    // beforeAll(() => {
    // });
    beforeEach(() => {
        mockResponse = {} as express.Response;
        mockNext = jest.fn();
    });
    afterEach(() => {
        // routeSpy.mockClear();
    });

    it('should validates the request and pass it through', async () => {
        const repositoryValidator = new RepositoryValidator();

        const mockRequests = [
            {
                query: {
                    top: 50
                }
            },
            {
                query: {
                    top: 30,
                    language: 'php'
                }
            },
            {
                query: {
                    top: 10,
                    since: moment().toISOString()
                }
            }];

        for (const mockRequest of mockRequests) {
            await repositoryValidator.validateGetReposParams(mockRequest as express.Request, mockResponse, mockNext);
            expect(mockNext).toHaveBeenCalled();
        }
    });

    it('should validate the request and reject it', async () => {
        const repositoryValidator = new RepositoryValidator();

        const testCases = [
            {
                request: {
                    query: {
                        top: 30,
                        language: '_sdas'
                    }
                },
                message: `${TOP_ERROR_MESSAGE}, ${LANGUAGE_ERROR_MESSAGE}`
            },
            {
                request: {
                    query: {
                        top: 10,
                        since: 'date'
                    }
                },
                message: ISO_DATE_ERROR_MESSAGE
            }];

        for (const testCase of testCases) {
            mockNext = jest.fn();
            await repositoryValidator.validateGetReposParams(
                testCase.request as express.Request,
                mockResponse, mockNext
            );
            const httpException = new HttpException(400, testCase.message);
            expect(mockNext).toHaveBeenCalledWith(httpException);
        }
    });
});
