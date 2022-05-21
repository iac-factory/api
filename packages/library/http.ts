import HTTP from "http";

import { Router } from "./src";

/*** @ts-ignore */
const router = Router() as Router.prototype;

router.get( "/", async (request: any, response: any) => {
    response.setHeader("Content-Type", "Application/JSON");
    response.end(JSON.stringify({
        Key: "Value"
    }), "utf-8");
} );

const server = HTTP.createServer(function(request, response) {
    router(request, response);
});

server.listen(3000, "localhost", 8192, () => {
    console.debug("[Debug] Listening via http://localhost:3000");
});

export {};
