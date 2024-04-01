const baseURL = `${import.meta.env.VITE_HOMEFLIX_SERVER_HOST ?? 'http://localhost'}:${import.meta.env.VITE_HOMEFLIX_SERVER_PORT ?? '8080'}`;

export async function login(username: string, password: string) {
    const url = `${baseURL}/login`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    const result = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
        headers,
        body: JSON.stringify({
            username,
            password,
        }),
    });
    const { token }: { token: string } = await result.json();
    return token;
}
