import pino, { Logger as PinoLogger } from 'pino';

export default class Logger {
    private logger: PinoLogger;

    constructor() {
        this.logger = pino();
    }

    public debug(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.debug(obj, msg, args);
    }

    public info(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.info(obj, msg, args);
    }

    public warn(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.warn(obj, msg, args);
    }

    public error(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.error(obj, msg, args);
    }

    public fatal(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.fatal(obj, msg, args);
    }

    public trace(obj: unknown, msg?: string, ...args: unknown[]) {
        return this.logger.trace(obj, msg, args);
    }
}
