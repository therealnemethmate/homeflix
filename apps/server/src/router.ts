import { TorrentController } from './controller/torrent';
import { AuthController } from './controller/auth';

import { AppInstance } from './app';
import { JWT } from '@fastify/jwt';

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

export default function router(app: AppInstance) {
    app.server.register(
        (fastify, options, next) => {
            const controller = new AuthController(app);
            app.server.post('/login', (req, res) => controller.login(req, res));
            app.server.post('/signup', (req, res) => controller.signup(req, res));
            next();
        },
        { prefix: '/auth' },
    );

    app.server.register(
        (fastify, options, next) => {
            const controller = new TorrentController(app);
            app.server.get('/torrents', { onRequest: [fastify.authenticate] }, (req, rest) => controller.getTorrents(req, rest));
            app.server.get('/download/:id', { onRequest: [fastify.authenticate] }, (req, rest) => controller.downloadTorrent(req, rest));
            next();
        },
        { prefix: '/torrent' },
    );
}
