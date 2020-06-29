import { Router } from 'express';

interface Controller {
    readonly path: string;
    readonly router: Router;
}

export default Controller;
