import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';
import { models } from '@homeflix/database';

export class AuthController {
    constructor(private readonly app: AppInstance) {}

    async login(req: FastifyRequest, res: FastifyReply) {
        const auth = req.body as models.UserStub;
        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await collection.findOne({ username: auth.username });
        if (!user) res.send('Unauthorized').code(403);
        // @TODO: PASSWORD
        const token = this.app.server.jwt.sign(
            { uid: user._id, username: user.username },
            { expiresIn: '12h' },
        );
        res.header('Content-Type', 'application/json;').send({ token });
    }

    async signup(req: FastifyRequest, res: FastifyReply) {
        console.log('this', { dis: Object.keys(this) });
        const user = req.body as models.UserSchema;
        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const foundUser = await collection.findOne({ username: user.username });
        // @TODO: PASSWORD
        if (foundUser) res.send(new Error('User already exists')).code(422);
        await collection.insertOne(user);
        res.header('Content-Type', 'application/json;').send({ result: 'OK' });
    }
}
