interface IObjectKeys {
    [key: string]: unknown;
}
    
export interface Torrent extends IObjectKeys {
    id: string;
    title: string;
    peers: number;
    createdAt: Date;
}
