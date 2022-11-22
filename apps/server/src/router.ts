import { FastifyInstance } from 'fastify';
import indexController from './controller/default';

export default async function router(fastify: FastifyInstance) {
    fastify.register(indexController, { prefix: '/' });
}
