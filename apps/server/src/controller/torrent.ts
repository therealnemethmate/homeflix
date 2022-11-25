import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

async function getTorrents(req: FastifyRequest, res: FastifyReply) {
    const id = req.params;
    res.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

async function downloadTorrent(req: FastifyRequest, res: FastifyReply) {
    const id = req.params;
    res.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

async function login(req: FastifyRequest, res: FastifyReply) {
    const id = req.params;
    res.header('Content-Type', 'application/json;').send({ foo: 'bar' });
}

export default async function torrentController(fastify: FastifyInstance) {
    fastify.get('/', getTorrents);
    fastify.get('/download/:id', downloadTorrent);
    fastify.post('/login', login);
}
