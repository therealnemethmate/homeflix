import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';

import { downloadTorrent, getTorrents, parseLogin } from '@homeflix/ncore-parser';
import { models } from '@homeflix/database';

interface DownloadTorrentParams { id: string }

interface GetTorrentsQuery { searchText: string, page: number }

interface UserFromToken { uid: string, username: string }

const SESSION_COOKIE_KEY = 'ncore_session_cookie';
const DOWNLOAD_KEY = 'ncore_download_key';

export class TorrentController {
    constructor(private app: AppInstance) {}

    private async login(username: string): Promise<string> {
        let sessionId = await this.app.cache.client.get(`${SESSION_COOKIE_KEY}_${username}`);
        if (sessionId) return sessionId;

        const usersCollection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await usersCollection.findOne({ username });
        const {
            username: credentialUserName,
            password: credentialPassword,
        } = user.credentials.find((credential) => credential.name === process.env.CLIENT_NAME || 'ncore');

        sessionId = await parseLogin({ username: credentialUserName, password: credentialPassword });
        await this.app.cache.client.set(`${SESSION_COOKIE_KEY}_${username}`, sessionId, { EX: 60 * 60 * 12 });
        return sessionId;
    }

    async downloadTorrent(req: FastifyRequest, res: FastifyReply) {
        const user = req.user as UserFromToken;
        const torrentParams = req.params as DownloadTorrentParams;

        //@TODO remove haha once you find out why the dotenv is failing to work...
        const sessionId = await this.login(user?.username || 'haha');
        const key = await this.app.cache.client.get(DOWNLOAD_KEY);
        await downloadTorrent(sessionId, { torrentId: torrentParams.id, key }, process.env.DOWNLOAD_PATH || '../../qbittorrent/monitored');
        res.header('Content-Type', 'application/json;').send({ result: 'OK' }).code(200);
    }

    async getTorrents(req: FastifyRequest, res: FastifyReply) {
        const user = req.user as UserFromToken;
        const torrentsQuery = req.query as GetTorrentsQuery;

        //@TODO remove haha once you find out why the dotenv is failing to work...
        const sessionId = await this.login(user?.username || 'haha');
        const result = await getTorrents(sessionId, torrentsQuery);
        console.log('result', { result });
        await this.app.cache.client.set(DOWNLOAD_KEY, result.key);
        res.header('Content-Type', 'application/json;').send({ torrents: result.torrents }).code(200);
    }
}
