import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';

import { getTorrents, downloadTorrent, parseLogin } from '@homeflix/ncore-parser';
import { models } from '@homeflix/database';

type DownloadTorrentQuery = { torrentId: string, key: string };

const SESSION_COOKIE_KEY = 'ncore_session_cookie';
export class TorrentController {
    constructor(private app: AppInstance) {
        this.app.server.get('/torrents', this.getTorrents);
        this.app.server.get('/download/:id', this.downloadTorrent);
        this.app.server.post('/login', this.login);
    }

    private async login(req: FastifyRequest, res: FastifyReply) {
        const auth = req.body as models.UserStub;
        const usersCollection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await usersCollection.findOne({ username: auth.username });
        const { username, password } = user.credentials.find((credential) => credential.name === process.env.CLIENT_NAME);
        const sessionId = await parseLogin({ username, password });
        this.app.cache.client.set(SESSION_COOKIE_KEY, sessionId);
        res.header('Content-Type', 'application/json;').send({ result: 'OK' }).code(200);
    }

    private async downloadTorrent(req: FastifyRequest, res: FastifyReply) {
        const torrentsQuery = req.query as DownloadTorrentQuery;
        const sessionId = await this.app.cache.client.get(SESSION_COOKIE_KEY);
        await downloadTorrent(sessionId, torrentsQuery, process.env.DOWNLOAD_PATH);
        res.header('Content-Type', 'application/json;').send({ result: 'OK' }).code(200);
    }

    private async getTorrents(req: FastifyRequest, res: FastifyReply) {
        const torrentsQuery = req.query;
        const sessionId = req.headers.cookie;
        const torrents = await getTorrents(sessionId, torrentsQuery);
        res.header('Content-Type', 'application/json;').send({ torrents }).code(200);
    }
}
