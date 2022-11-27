import Logger from '@homeflix/logger';
import fastifyJWT from '@fastify/jwt';
import fp from 'fastify-plugin';
import { App, AppInstance } from './app';
import { loadEnv } from './env';
import router from './router';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const authPlugin = fp(async (fastify: FastifyInstance) => {
    fastify.register(fastifyJWT, {
        secret: process.env.SECRET || 'not_very_secure',
    });
    fastify.decorate('authenticate', async function(req: FastifyRequest, res: FastifyReply) {
        try {
            await req.jwtVerify();
        } catch (err) {
            res.send(err);
        }
    });    
});

function registerRoutes(app: AppInstance) {
    app.server.register(authPlugin);
    app.server.register((fastify, options, next) => { 
        router(app);
        next();
    });
    const port = Number(process.env.PORT) || 3001;
    app.server.listen({ port });
    app.server.log.debug(`Listening on port ${port}`);
}

loadEnv();
const app = new App(new Logger());
app.init().then(() => registerRoutes(app));
