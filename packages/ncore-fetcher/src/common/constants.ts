import { host, baseUrl } from '../env';

const headers: Record<string, string> = {
    'Host': `${host}`,
    'Upgrade-Insecure-Requests': '1',
    'Origin': `${baseUrl}`,
    'Accept': 'application/json,text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Dest': 'document',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'hu-HU,hu;q=0.8,en-US;q=0.5,en;q=0.3',
};

export { headers };
