import { headers } from '../common/constants';
import { TorrentsQueryParam, SearchTextTarget, DownloadTorrentParam } from '../common/types';
import { baseUrl } from '../env';
import { clearParams } from '../utils';

export async function getTorrentsHtml(sessionId: string, params: TorrentsQueryParam = {}): Promise<string> {
    if (!sessionId) {
        throw new Error('Session id is required!');
    }

    const { sortBy, arrangement, type, selectedTypes, page, searchText } = params;
    const ncoreQueryParams: Record<string, string | undefined> = {
        oldal: page?.toString(),
        miszerint: sortBy,
        hogyan: arrangement,
        tipus: type,
        kivalasztottak_kozott: selectedTypes?.join(', '),
        mire: searchText,
        miben: searchText && SearchTextTarget.NAME,
    };

    const queryParams = `?${new URLSearchParams(clearParams(ncoreQueryParams))}`;
    const url = `${baseUrl}/torrents.php${queryParams}`;
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            ...headers,
            Cookie: `PHPSESSID=${sessionId}`,
        },
    });
    return res.text();
}

export async function downloadTorrentById(sessionId: string, params: DownloadTorrentParam) {
    const { torrentId, key } = params;
    if (!torrentId) throw new Error('Missing "torrentId"');
    if (!key) throw new Error('Missing "key" for download');

    const queryParams = new URLSearchParams({ id: torrentId, key });
    const url = `${baseUrl}/torrents.php?action=download&${queryParams}`;

    const res = await fetch(url, {
        method: 'GET',
        headers: {
            ...headers,
            Cookie: `PHPSESSID=${sessionId}`,
        },
    });
    const filename = res.headers.get('content-disposition')?.match(/"(.*?)"/)?.[1];

    if(!filename) {
        throw new Error('cannot get filename');
    }
    const blob = await res.blob();
    return { blob, filename };
}
