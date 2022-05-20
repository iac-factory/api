import { Router } from "..";

Router.options( "/schema/typescript", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/schema/typescript", async (request, response) => {
    const { Schema } = await import("@iac-factory/api-schema");

    const TS = await Schema.TS.resolve();

    response.status( 200 ).send( TS );
} );

export { Router };