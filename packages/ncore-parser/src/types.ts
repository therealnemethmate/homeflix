export type Credential = { username: string, password: string };

export type LinkElement = { href: string, title: string } & Element;

export interface Torrent {
    id: string;
    title: string;
    peers: number;
    createdAt: Date;
}

export type TorrentQueryResult = {
    key: string;
    torrents: Torrent[];
}
