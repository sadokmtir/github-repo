import 'reflect-metadata';
import Server from './Server';
import logger from './infrastructure/logging/Logger';
import { RepositoryController } from './controllers/RepositoryController';

process.on('unhandledRejection', (reason: Error) => {
    logger.error('Unhandled promise', reason);
});

const main = () => {
    const app = new Server([
        new RepositoryController(),
    ]);
    app.listen();
};

main();