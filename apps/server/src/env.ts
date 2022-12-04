import dotenv from 'dotenv';

function loadEnv() {
    dotenv.config({ path: './.env', override: true });
}

export { loadEnv };
