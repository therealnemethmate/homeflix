/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_HOMEFLIX_SERVER_HOST: string;
    readonly VITE_HOMEFLIX_SERVER_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
