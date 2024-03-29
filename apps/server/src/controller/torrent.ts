import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';

import { downloadTorrent, getTorrents, parseLogin } from '@homeflix/ncore-parser';
import { models } from '@homeflix/database';

interface DownloadTorrentParams { id: string }

interface GetTorrentsQuery { searchText: string, page: number }

const SESSION_COOKIE_CACHE_KEY = 'ncore_session_cookie';
const DOWNLOAD_CACHE_KEY = 'ncore_download_key';

export class TorrentController {
    constructor(private app: AppInstance) {}

    private async login(username: string): Promise<string> {
        let sessionId = await this.app.cache.client.get(`${SESSION_COOKIE_CACHE_KEY}_${username}`);
        if (sessionId) return sessionId;

        const usersCollection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await usersCollection.findOne({ username });
        if (!user) throw new Error(`User ${username} not found!`);

        const clientCredentials = user.credentials.find((credential) => credential.name === process.env.HOMEFLIX_CLIENT_NAME);
        if (!clientCredentials) throw new Error('Client credentials not found!');
        const {
            username: credentialUserName,
            password: credentialPassword,
        } = clientCredentials;

        sessionId = await parseLogin({ username: credentialUserName, password: credentialPassword });
        await this.app.cache.client.set(`${SESSION_COOKIE_CACHE_KEY}_${username}`, sessionId, { EX: 60 * 60 });
        return sessionId;
    }

    async downloadTorrent(req: FastifyRequest, res: FastifyReply) {
        const user = req.user as models.UserSchema;
        const torrentParams = req.params as DownloadTorrentParams;

        const sessionId = await this.login(user?.username);
        const key = await this.app.cache.client.get(DOWNLOAD_CACHE_KEY);
        await downloadTorrent(sessionId, { torrentId: torrentParams.id, key }, process.env.HOMEFLIX_DOWNLOAD_PATH);
        res.header('Content-Type', 'application/json;').send({ result: 'OK' }).code(200);
    }

    async getTorrents(req: FastifyRequest, res: FastifyReply) {
        const user = req.user as models.UserSchema;
        const torrentsQuery = req.query as GetTorrentsQuery;
        const sessionId = await this.login(user?.username);
        const result = await getTorrents(sessionId, torrentsQuery);
        await this.app.cache.client.set(DOWNLOAD_CACHE_KEY, result.key);
        res.header('Content-Type', 'application/json;').send({ torrents: result.torrents }).code(200);
    }
}
