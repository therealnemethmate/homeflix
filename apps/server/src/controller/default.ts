import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function getIndex(_request: FastifyRequest, reply: FastifyReply) {
    reply.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

export default async function indexController(fastify: FastifyInstance) {
    fastify.get("/", getIndex);
}
