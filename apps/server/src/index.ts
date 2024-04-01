import fastifyJWT, { JWT } from '@fastify/jwt';
import Logger from '@homeflix/logger';
import cors from '@fastify/cors';

import fp from 'fastify-plugin';
import { App, AppInstance } from './app';
import router from './router';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from '@homeflix/database';

interface SessionToken { uid: string }

// adding jwt property to req
// authenticate property to FastifyInstance
declare module 'fastify' {
    interface FastifyRequest {
      jwt: JWT
    }
    export interface FastifyInstance {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      authenticate: any
    }
}

function registerRoutes(app: AppInstance) {
    const authPlugin = fp(async (fastify: FastifyInstance) => {
        fastify.register(fastifyJWT, {
            secret: process.env.HOMEFLIX_SECRET,
        });
    
        fastify.decorate('authenticate', async function(req: FastifyRequest, res: FastifyReply) {
            try {
                const decoded = await req.jwtVerify<SessionToken>();
                const usersCollection = app.db.getCollection('users');
                const id = new ObjectId(decoded.uid);
                const user = await usersCollection.findOne({ _id: id });
                if (!user) throw new Error('User not found!');
                req.user = user;
            } catch (err) {
                res.send(err);
            }
        });    
    });
    
    app.server.register(cors, {
        origin: (origin, cb) => {
            cb(null, true);
            return;
        },          
    });
    app.server.register(authPlugin);
    app.server.register((fastify, options, next) => { 
        router(app);
        next();
    });

    const port = Number(process.env.HOMEFLIX_SERVER_PORT) ?? 8080;
    app.server.listen({ host: '0.0.0.0', port });
    app.server.log.debug(`Listening on port ${port}`);
}

const app = new App(new Logger());
app.init().then(() => registerRoutes(app));
