import { FastifyRequest, FastifyReply } from 'fastify';
import { AppInstance } from '@/app';
import { models } from '@homeflix/database';

export class AuthController {
    constructor(private app: AppInstance) {
        this.app.server.get('/login', { onRequest: () => { return true; } }, this.login);
        this.app.server.post('/signup', { onRequest: () => { return true; } }, this.signup);
    }

    private async login(req: FastifyRequest, res: FastifyReply) {
        const auth = req.body as models.UserStub;
        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const user = await collection.findOne({ username: auth.username });
        if (!user) res.send('Unauthorized').code(403);
        // @TODO: PASSWORD
        const token = this.app.server.jwt.sign({ uid: user._id }, { expiresIn: '12h' });
        res.header('Content-Type', 'application/json;').send({ token });
    }

    private async signup(req: FastifyRequest, res: FastifyReply) {
        const user = req.body as models.UserSchema;
        const collection = this.app.db.getCollection<models.UserSchema>('users');
        const foundUser = await collection.findOne({ username: user.username });
        // @TODO: PASSWORD
        if (foundUser) res.send(new Error('User already exists')).code(422);
    
        await collection.insertOne(user);
    }
}
