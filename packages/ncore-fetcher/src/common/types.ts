export enum Arrangement {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum SearchTextTarget {
    NAME = 'name',
}

export interface TorrentsQueryParam {
    sortBy?: string,
    page?: number,
    arrangement?: Arrangement,
    type?: string,
    selectedTypes?: string[],
    searchText?: SearchTextTarget,
}

export interface DownloadTorrentParam {
    torrentId: string,
    key: string,
}