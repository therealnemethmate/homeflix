import { headers } from '../common/constants';
import { TorrentsQueryParam, SearchTextTarget, Arrangement, DownloadTorrentParam, SearchType } from '../common/types';
import { baseUrl } from '../env';
import { clearParams } from '../utils';

export async function getTorrentsHtml(sessionId: string, params: TorrentsQueryParam = {}): Promise<string> {
    if (!sessionId) {
        throw new Error('Session id is required!');
    }

    const categories = [
        'xvid_hun',
        'xvid',
        'dvd_hun',
        'dvd',
        'dvd9_hun',
        'dvd9',
        'hd_hun',
        'hd',
        'xvidser_hun',
        'xvidser',
        'dvdser_hun',
        'dvdser',
        'hdser_hun',
        'hdser',
    ];

    const { sortBy, arrangement, page, searchText } = params;
    const ncoreQueryParams: Record<string, string | undefined> = {
        oldal: page?.toString(),
        miszerint: sortBy || 'seeders',
        hogyan: arrangement || Arrangement.DESC,
        tipus: SearchType.SelectedCategories,
        kivalasztott_tipus: categories?.join(','),
        mire: searchText,
        miben: searchText && SearchTextTarget.NAME,
    };

    const queryParams = `?${new URLSearchParams(clearParams(ncoreQueryParams))}`;
    const url = `${baseUrl}/torrents.php${queryParams}`;
    console.log('url', { url });

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

    if (!filename) {
        throw new Error('cannot get filename');
    }
    const blob = await res.blob();
    return { blob, filename };
}
