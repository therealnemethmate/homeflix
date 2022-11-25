import { Db, MongoClient } from 'mongodb';
import * as models from './models';
import Logger from '@homeflix/logger';

export class Database {
    private client: MongoClient;
    private db: Db;

    constructor(private logger: Logger) {}

    private async setUniqueFields<TSchema>(collection: string, fields: string[]) {
        if (!this.db) throw new Error('Call database setup first!');
        return fields.every((field) => {
            return this.db.collection<TSchema>(collection).createIndex({ [field]: 1 }, { unique: true });
        });
    }

    public async setup(url?: string, dbName?: string) {
        if (!this.client) {
            this.client = new MongoClient(url || 'mongodb://mongodb');
            await this.client.connect();
            this.logger.info('Successfully connected to mongodb');
        }
        if (!this.db) {
            this.db = this.client.db(dbName || 'homeflix');
            this.logger.info(`Successfully connected to database: ${this.db.databaseName}`);
            await this.setUniqueFields('users', ['username']);
        }
    }

    public getCollection<TSchema extends models.DocumentSchema>(collectionName: string) {
        if (!this.db) throw new Error('Call database setup first!');
        return this.db.collection<TSchema>(collectionName);
    }
}

export { models };
