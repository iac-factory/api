import Event from "events";

export const Main: () => Promise<void> = async () => {
    const Server = Application;

    await Middleware( Server );

    Server.get( "/", async (request, response) => {
        const { params } = request;
        console.log( params );

        response.status( 200 ).json( {
            Message: "Test" // await Markdown("./README.md")
        } );
    } );

    // const myEE = new Event();
    // myEE.once( "initialization", () => console.log( "a" ) );
    // myEE.prependOnceListener( "initialization", () => console.log( "b" ) );

    // Server.once("initialization", myEE.emit);

    void new Promise((resolve) => Server.listen( 3000, "0.0.0.0", 8192, () => resolve));
};

import { Application } from "@iac-factory/api-controller";
import { Middleware } from "@iac-factory/api-middleware";

export default Main;
