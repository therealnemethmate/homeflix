import Fastify, { FastifyInstance, RouteShorthandOptions } from 'fastify';

const server: FastifyInstance = Fastify({});

const opts: RouteShorthandOptions = {
    schema: {
        response: {
            200: {
                type: 'object',
                properties: {
                    pong: {
                        type: 'string',
                    },
                },
            },
        },
    },
};

server.get('/ping', opts, async () => {
    console.log('dasdasd');
    return { pong: 'it worked!' };
});

const start = async () => {
    try {
        await server.listen({ port: 3001 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
