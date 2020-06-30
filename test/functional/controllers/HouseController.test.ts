import request from 'supertest';
import 'reflect-metadata';
import moment from 'moment';
import Server from '../../../src/Server';
import { RepositoryController } from '../../../src/controllers/RepositoryController';

describe('test HouseController routes', () => {
    const server = new Server([
        new RepositoryController(),
    ]);
    const app = server.app;

    describe('GET repos with different filters', () => {
        it('should responds with top 10 repos', async () => {
            const response = await request(app).get('/repos?top=10');
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBe(10);
        });

        it('should responds with top 50 js repos ', async () => {
            const response = await request(app).get('/repos?top=50&language=js');
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBe(50);
        });

        it('should responds top 100 repos since last two weeks', async () => {
            const startDate = moment().subtract(2, 'weeks').toISOString();
            const response = await request(app).get(
                `/repos?top=100&since=${startDate}`
            );
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBe(100);
        });

        it('should responds top 50 repos since 2 days with language ts', async () => {
            const startDate = moment().subtract(2, 'days').toISOString();
            const response = await request(app).get(
                `/repos?top=50&language=ts&since=${startDate}`
            );
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
            expect(response.body.length).toBe(50);
        });
    });

    describe('GET repos with custom stream', () => {
        it('should get all repos crated the last minute', async () => {
            const startDate = moment().subtract(1, 'minute').toISOString();
            const response = await request(app).get(`/repos?since=${startDate}`);
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
        }, 20000); //increased timeout to wait until the stream is done


        it('should get all repos since last 5 minutes with language ts', async () => {
            const startDate = moment().subtract(1, 'minute').toISOString();
            const response = await request(app).get(
                `/repos?since=${startDate}&language=ts`
            );
            expect(response.status).toEqual(200);
            expect(response.body).toBeDefined();
        }, 20000); //increased timeout to wait until the stream is done
    });


    describe('Checking invalid requests', () => {
        it('should responds with 400 when date is not ISO8601 format', async () => {
            const response = await request(app).get('/repos?top=50&language=ts&since=date');
            expect(response.status).toEqual(400);
        });

        it('should responds with 400 when language is not alphanumeric', async () => {
            const startDate = moment().subtract(2, 'days').toISOString();

            const response = await request(app).get(`/repos?top=50&language=ts_sd&since=${startDate}`);
            expect(response.status).toEqual(400);
        });

        it('should return 404 on invalid post request', async () => {
            const response = await request(app).post('/repos?top=50&language=ts&since=date');
            expect(response.status).toEqual(404);
        });

        it('should return 404 on invalid roure', async () => {
            const response = await request(app).post('/blabla');
            expect(response.status).toEqual(404);
        });
    });


});
