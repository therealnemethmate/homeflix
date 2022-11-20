import { login, logout } from '@homeflix/ncore-fetcher';
import { Credential } from '../types';

/**
 * Logs in and gets session id, which should be used in further communications
 * @param {{ username: string, password: string}} credentials 
 * @returns `sessionId`
 */
export async function parseLogin(credentials: Credential) {
    if (!credentials) throw new Error('"credentials" is mandatory');
    if (!credentials?.username) {
        throw new Error('"username" is mandatory');
    }
    if (!credentials?.password) {
        throw new Error('"password" is mandatory');
    }
    return login(credentials.username, credentials.password);
}

/**
 * Logs out for the given sessionId
 * @param {string} sessionId 
 * @returns `ok` true if login was successful
 */
export async function parseLogout(sessionId: string) {
    if (!sessionId) throw new Error('"sessionId" is mandatory');
    return logout(sessionId);
}
