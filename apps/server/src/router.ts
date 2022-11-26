import { TorrentController } from './controller/torrent';
import { AuthController } from './controller/auth';

import { AppInstance } from './app';

export default async function router(app: AppInstance) {
    app.server.register(
        () => new AuthController(app),
        { prefix: '/auth' },
    );

    app.server.register(
        () => new TorrentController(app),
        { prefix: '/torrent' },
    );
}
