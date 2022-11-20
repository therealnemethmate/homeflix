import { login, logout } from './services/auth';
import { getTorrentsHtml, downloadTorrentById }from './services/torrent';
import { TorrentsQueryParam, DownloadTorrentParam } from './common/types';

export {
    login,
    logout,
    downloadTorrentById,
    getTorrentsHtml,
    TorrentsQueryParam,
    DownloadTorrentParam,
}
