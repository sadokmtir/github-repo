import * as express from 'express';
import Controller from './Controller.interface';
import GithubClient from '../infrastructure/github/GithubClient';
import RepositoryValidator from '../validators/RepositoryValidator';

export class RepositoryController implements Controller {
    readonly path: string;
    router: express.Router;
    private repoValidator: RepositoryValidator;
    private githubClient: GithubClient;

    constructor() {
        this.path = '/repos';
        this.repoValidator = new RepositoryValidator();
        this.router = express.Router();
        this.githubClient = new GithubClient();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.route(this.path)
            .get(this.repoValidator.validateGetReposParams, this.githubClient.fetchRepositories);
    }
}