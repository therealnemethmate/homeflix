import { Database } from '@homeflix/database';
import { Cache } from '@homeflix/cache';

import fastify, { FastifyInstance } from 'fastify';
import fastifyJWT from '@fastify/jwt';

import router from './router';
import Logger from '@homeflix/logger';

interface AppInstance {
    init(): Promise<void>;
    cache: Cache;
    db: Database;
    server: FastifyInstance;
}

class App implements AppInstance {
    private _db: Database;
    private _cache: Cache;
    private _server: FastifyInstance;

    constructor(private logger: Logger) {}
    
    private async initServer(): Promise<void> {
        this._server = fastify({
            logger: !!(process.env.NODE_ENV !== 'development'),
        });
        this._server.register(fastifyJWT, {
            secret: process.env.SECRET,
        });
        this._server.addHook('onRequest', async (req, res) => {
            try {
                await req.jwtVerify();
            } catch (err) {
                res.send(err);
            }
        });
        this._server.register(() => router(this));
    }

    public async init() {
        if (!this._db) {
            this._db = new Database(this.logger);
            await this._db.setup(process.env.DATABASE_URL, process.env.DATABASE_NAME);
        }
        if (!this._cache) {
            this._cache = new Cache(this.logger);
            await this._cache.setup(process.env.CACHE_URL);
        }
        if (!this._server) {
            await this.initServer();
        }
    }

    public get cache() { return this._cache; }
    public get server() { return this._server; }
    public get db() { return this._db; }
}

export {
    App,
    AppInstance,
};
