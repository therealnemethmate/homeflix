import { Torrent } from '../../common/interfaces';

export async function fetchTorrents(token: string, searchText: string) {
    const url
        = `${import.meta.env.VITE_HOMEFLIX_SERVER_HOST}:${import.meta.env.VITE_HOMEFLIX_SERVER_PORT}/torrents?searchText=${searchText}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const result = await fetch(url, {
        method: 'GET',
        headers,
    });
    const { torrents }: { torrents: Torrent[] } = await result.json();
    return torrents;
}

export async function downloadTorrent(token: string, id: string) {
    const url
        = `${import.meta.env.VITE_HOMEFLIX_SERVER_HOST}:${import.meta.env.VITE_HOMEFLIX_SERVER_PORT}/download/${id}`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${token}`);
    const res = await fetch(url, {
        method: 'GET',
        headers,
    });
    const { result }: { result: string } = await res.json();
    return result;
}
