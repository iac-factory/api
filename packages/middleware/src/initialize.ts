import type { Application } from "express";

const Initialize = (server: Application) => {
    server.init();

    return server;
};

export { Initialize };

export default Initialize;
