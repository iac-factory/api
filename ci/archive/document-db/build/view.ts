import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";

import Context from "./context";

const Controller: typeof Router.prototype = Router();
Controller.post( "/", async ( _request: Request, response: Response ) => {
    const connection = await Context();

    console.log("DB Connection", connection);

    response.send({}).status(200);
} );

export { Controller as Awaitable };

export default Controller;
