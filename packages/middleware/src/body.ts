import { json, urlencoded } from "body-parser";

import type { Application } from "express";

const Parsers = {
    "URL-Encoded": {
        Module: urlencoded,
        Parameters: {
            extended: true,
            parameterLimit: 1000
        }
    },
"JSON": {
        Module: json,
        Parameters: {
            strict: true
        }
    }
};

/*** Body Middleware Loader
 *
 * @param server {Application}
 *
 * @param parsers {Parsers}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

const Body = (server: Application, parsers = Parsers) => {
    console.debug("[Middleware] [Body-Parser] [Debug] Initializing Body Parser(s) ...");

    Object.keys(parsers).forEach((Parser) => {
        // @ts-ignore
        const Function = parsers[Parser].Module;

        // @ts-ignore
        const Parameters = parsers[Parser].Parameters;

        server.use(Function(Parameters));
    });

    console.debug("[Middleware] [Body-Parser] [Debug] Overwrote Application Request + Response Parser(s)");

    return server;
};


export { Body };

export default { Body };
