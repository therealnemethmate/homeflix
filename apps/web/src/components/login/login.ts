export async function login(username: string, password: string) {
    const url = `${import.meta.env.VITE_HOMEFLIX_SERVER_HOST}:${import.meta.env.VITE_HOMEFLIX_SERVER_PORT}/login`;
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
