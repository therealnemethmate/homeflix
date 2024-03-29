import fastifyJWT from '@fastify/jwt';
import Logger from '@homeflix/logger';
import cors from '@fastify/cors';
import dotenv from 'dotenv';

import fp from 'fastify-plugin';
import { App, AppInstance } from './app';
import router from './router';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'bson';

dotenv.config({ override: true });

interface SessionToken { uid: string }

function registerRoutes(app: AppInstance) {
    const authPlugin = fp(async (fastify: FastifyInstance) => {
        fastify.register(fastifyJWT, {
            secret: process.env.SECRET,
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
            const hostname = new URL(origin).hostname;            
            if (hostname.match(/localhost/g)) {
                cb(null, true);
                return;
            }
            cb(new Error('Not allowed'), false);
        },          
    });
    app.server.register(authPlugin);
    app.server.register((fastify, options, next) => { 
        router(app);
        next();
    });

    const port = Number(process.env.PORT) || 3001;
    app.server.listen({ port });
    app.server.log.debug(`Listening on port ${port}`);
}

const app = new App(new Logger());
app.init().then(() => registerRoutes(app));
