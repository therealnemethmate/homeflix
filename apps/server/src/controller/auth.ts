import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';
import { models } from '@homeflix/database';
import { UserStub } from '@homeflix/database/src/models';

import * as crypto from 'crypto';

const salt = process.env.HOMEFLIX_SALT;

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function pbkdf2(password: string, salt: string) {
    return new Promise<string>((resolve, reject) => {
        crypto.pbkdf2(password, salt, 1000, 64, 'sha512', (err, derivedKey) => {
            if (err) reject(err);
            resolve(derivedKey.toString('hex'));
        });
    });
}

const unauthorizedError = new Error('Unauthorized');

export class AuthController {
    constructor(private readonly app: AppInstance) {}

    async login(req: FastifyRequest, res: FastifyReply) {
        const auth: UserStub = (isString(req.body) ? JSON.parse(req.body) : req.body);
        if (!auth) return res.send(unauthorizedError).code(403);

        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await collection.findOne({ username: auth.username });
        if (!user) return res.send(unauthorizedError).code(403);

        const password = await pbkdf2(auth.password, salt);
        if (password !== user.password) return res.send(unauthorizedError).code(403);

        const token = this.app.server.jwt.sign(
            { uid: user._id },
            { expiresIn: '12h' },
        );

        return res.header('Content-Type', 'application/json;').send({ token });
    }

    async signup(req: FastifyRequest, res: FastifyReply) {
        const user = req.body as models.UserSchema;
        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const foundUser = await collection.findOne({ username: user.username });
        if (foundUser) res.send(new Error('User already exists')).code(422);
        user.password = await pbkdf2(user.password, salt);

        await collection.insertOne(user);
        res.header('Content-Type', 'application/json;').send({ result: 'OK' });
    }
}
