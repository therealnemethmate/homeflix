export enum Arrangement {
    ASC = 'ASC',
    DESC = 'DESC',
}

export enum SearchTextTarget {
    NAME = 'name',
}

export enum SearchType {
    SelectedCategories = 'kivalasztottak_kozott',
}

export interface TorrentsQueryParam {
    sortBy?: string,
    page?: number,
    arrangement?: Arrangement,
    selectedTypes?: string[],
    searchText?: string,
}

export interface DownloadTorrentParam {
    torrentId: string,
    key: string,
}
