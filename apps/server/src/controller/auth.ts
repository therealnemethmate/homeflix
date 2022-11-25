import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { app } from '@/app';
import { models } from '@homeflix/database';

async function login(req: FastifyRequest, res: FastifyReply) {
    const auth = req.body as models.UserStub;
    const collection = app.db.getCollection<models.UserSchema>('users');
    const user = await collection.findOne({ username: auth.username });
    if (!user) res.send('Unauthorized').code(403);
    // @TODO: PASSWORD
    const token = app.server.jwt.sign({ uid: user._id }, { expiresIn: '12h' });
    res.header('Content-Type', 'application/json;').send({ token });
}

async function register(req: FastifyRequest, res: FastifyReply) {
    const user = req.body as models.UserSchema;
    const collection = app.db.getCollection<models.UserSchema>('users');
    const foundUser = await collection.findOne({ username: user.username });
    // @TODO: PASSWORD
    if (foundUser) res.send(new Error('User already exists')).code(422);

    await collection.insertOne(user);
}

export default async function userController(fastify: FastifyInstance) {
    fastify.get('/login', { onRequest: () => { return true; } }, login);
    fastify.post('/register', { onRequest: () => { return true; } }, register);
}
