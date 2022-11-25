import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { app } from '@/app';

async function getMe(req: FastifyRequest, res: FastifyReply) {
    const id = req.params;
    res.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

async function changePassword(req: FastifyRequest, res: FastifyReply) {
    const id = req.params;
    res.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

export default async function userController(fastify: FastifyInstance) {
    fastify.get('/me', getMe);
    fastify.put('/change-password', changePassword);
}
