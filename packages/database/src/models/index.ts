import { ObjectId } from 'mongodb';
import { UserSchema, Credential, UserStub } from './user';

interface DocumentSchema {
    _id: ObjectId;
}

export {
    DocumentSchema,
    UserSchema,
    Credential,
    UserStub,
};
