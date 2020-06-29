import * as express from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import QueryParamsDto from '../dto/QueryParamsDto';
import HttpException from '../infrastructure/middleware/exceptions/HttpException';

export default class RepositoryValidator {

    public validateGetReposParams = (req: express.Request, res: express.Response, next: express.NextFunction) => {

        req.query.top = req.query?.top ? +req.query.top : null;
        validate(plainToClass(QueryParamsDto,
            req.query,
            { enableImplicitConversion: true }),
            { skipMissingProperties: true, whitelist: true, forbidNonWhitelisted: true })
            .then((errors: ValidationError[]) => {
                if (errors.length > 0) {
                    const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                    next(new HttpException(400, message));
                } else {
                    next();
                }
            });
    };
}