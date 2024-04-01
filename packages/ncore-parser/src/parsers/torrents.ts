import { appendFile, mkdir } from 'fs/promises';
import * as path from 'path';

import { getIdFromUrl, getDate } from '../utils';
import { getDocument } from '../dom';
import {
    getTorrentsHtml,
    downloadTorrentById,
    TorrentsQueryParam,
    DownloadTorrentParam,
} from '@homeflix/ncore-fetcher';
import { LinkElement, TorrentQueryResult } from '../types';

export async function getTorrents(sessionId: string, params?: TorrentsQueryParam): Promise<TorrentQueryResult> {
    const torrentsHtml = await getTorrentsHtml(sessionId, params);
    const document = getDocument(torrentsHtml);
    const element = document.querySelector<LinkElement>('link[rel=alternate]');
    const key = element?.href.split('=')[1];
    const torrentBoxes = [
        document.querySelectorAll('.box_torrent'),
        document.querySelectorAll('.box_torrent2'),
    ];
    const torrents = torrentBoxes.reduce((prev, torrentBox) => {
        torrentBox.forEach((box) => {
            const torrentDiv = box.querySelector('.torrent_txt') || box.querySelector('.torrent_txt2');
            const createdAtBox = box.querySelector('.box_feltoltve') || box.querySelector('.box_feltoltve2');
            const seedBox = box.querySelector('.box_s') || box.querySelector('.box_s2');

            const torrentAnchor = torrentDiv?.querySelector<LinkElement>('a');
            const peers = Number(seedBox?.querySelector<LinkElement>('a')?.textContent);

            prev.push({
                title: `${torrentAnchor?.title}`,
                id: getIdFromUrl(torrentAnchor?.href),
                createdAt: getDate(createdAtBox?.textContent),
                peers,
            });
        });
        return prev;
    }, []);

    return { key, torrents };
}

export async function downloadTorrent(sessionId: string, params: DownloadTorrentParam, downloadPath: string): Promise<void> {
    const { blob, filename } = await downloadTorrentById(sessionId, params);
    const fullPath = path.join(downloadPath, filename);
    const buffer = Buffer.from(await blob.arrayBuffer());
    await mkdir(downloadPath, { recursive: true });
    await appendFile(fullPath, buffer);
}
