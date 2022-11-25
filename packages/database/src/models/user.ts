import { DocumentSchema } from '.';

export type Credential = {
    name: string;
    username: string;
    password: string;
}

export interface UserStub {
    displayName: string;
    username: string;
    password: string;
    credentials: Credential[];
}

export interface UserSchema extends DocumentSchema, UserStub {}
