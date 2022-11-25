import { createClient, RedisClientType } from 'redis';
import Logger from '@homeflix/logger';

export class Cache {
    private _client: RedisClientType;

    constructor(private logger: Logger) {}

    public async setup(url?: string): Promise<RedisClientType> {
        if (this.client) return this.client;
        
        this._client = createClient({ url: url || 'redis://redis' }); 
        this._client.on('error', (err) => this.logger.error('Redis Client Error', err));
        await this._client.connect();
        this.logger.info(`Successfully connected to cache: ${url}`);
    }

    public get client(): RedisClientType {
        return this._client;
    }
}
