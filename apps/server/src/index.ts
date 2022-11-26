import Logger from '@homeflix/logger';
import { App } from './app';

const start = () => {
    const app = new App(new Logger());
    app.init();    
};

start();
