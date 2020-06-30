import * as express from 'express';
import { RepositoryController } from '../../../src/controllers/RepositoryController';

describe('test the UserController', () => {

    let routeSpy: jest.SpyInstance;
    beforeEach(() => {
        // @ts-ignore
        routeSpy = jest.spyOn(express.Router, 'route');
    });
    afterEach(() => {
        routeSpy.mockClear();
    });

    it('should configure the routes paths /users and /users/:id', () => {
        new RepositoryController();
        expect(routeSpy).toHaveBeenNthCalledWith(1, '/repos');
    });
});
