import { headers } from '../common/constants';
import { baseUrl } from '../env';

async function getSessionId() {
    const res = await fetch(`${baseUrl}/`, {
        redirect: 'manual',
        method: 'GET',
        headers: {
            ...headers,
            Connection: 'keep-alive',
        },
    });

    try {
        return res.headers.get('set-cookie')?.match(/=(.*?);/)?.[1];
    } catch (error) {
        throw new Error(`Failed to get session id! ${res.statusText}`);
    }
}

export async function login(username: string, password: string) {
    const phpSessionId = await getSessionId();
    const res = await fetch(`${baseUrl}/login.php`, {
        method: 'POST',
        headers: {
            ...headers,
            Cookie: `PHPSESSID=${phpSessionId}`,
        },
        body: new URLSearchParams({
            set_lang: 'hu',
            submitted: '1',
            nev: username,
            pass: password,
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to log in with sessionId ${phpSessionId}! ${res.statusText}`);
    }
    return phpSessionId;
}

export async function logout(sessionId: string) {
    const res = await fetch(`${baseUrl}/exit.php?q=${sessionId}`, {
        method: 'POST',
        headers: {
            ...headers,
            Cookie: `PHPSESSID=${sessionId}`,
        },
    });

    if (!res.ok) {
        throw new Error(`Unable to log out with sessionId ${sessionId}! ${res.statusText}`);
    }
    return res.ok;
}
