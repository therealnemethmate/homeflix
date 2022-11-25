import { FastifyInstance } from 'fastify';
import torrentController from './controller/torrent';
import authController from './controller/auth';

export default async function router(fastify: FastifyInstance) {
    fastify.register(authController, { prefix: '/auth' });
    fastify.register(torrentController, { prefix: '/torrent' });
}
