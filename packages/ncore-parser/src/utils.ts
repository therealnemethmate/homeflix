export function getDate(dateString?: string | null) {
    try {
        const regexPattern = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
        const match = dateString?.match(regexPattern);
        return new Date(
            Number(match?.[1]),
            Number(match?.[2]),
            Number(match?.[3]),
            Number(match?.[4]),
            Number(match?.[5]),
            Number(match?.[6]),
        );
    } catch (e) {
        //TODO error logging
        return new Date();
    }
}

export function getIdFromUrl(url?: string) {
    try {
        return url?.match(/[0-9]+$/)?.[0];
    } catch (e) {
        //TODO error logging
        return null;
    }
}
