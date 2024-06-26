import { Database } from '@homeflix/database';
import { Cache } from '@homeflix/cache';
import dotenv from 'dotenv';

import fastify, { FastifyInstance } from 'fastify';
import Logger from '@homeflix/logger';

dotenv.config({ override: true });

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

    constructor(private _logger: Logger) {
        this._logger.debug('Hello there');
    }
    
    private async initServer(): Promise<void> {
        this._server = fastify({
            logger: !!(process.env.NODE_ENV !== 'development'),
        });
        return;
    }

    public async init() {
        if (!this._db) {
            this._db = new Database(this.logger);
            this._logger.debug(`Connecting to mongodb with url ${process.env.HOMEFLIX_DATABASE_URL}`);
            await this._db.setup(process.env.HOMEFLIX_DATABASE_URL, process.env.HOMEFLIX_DATABASE_NAME);
        }
        if (!this._cache) {
            this._cache = new Cache(this.logger);
            await this._cache.setup(process.env.HOMEFLIX_CACHE_URL);
        }
        if (!this._server) {
            await this.initServer();
        }
    }

    public get cache() { return this._cache; }
    public get server() { return this._server; }
    public get db() { return this._db; }
    public get logger() { return this._logger; }
}

export {
    App,
    AppInstance,
};
