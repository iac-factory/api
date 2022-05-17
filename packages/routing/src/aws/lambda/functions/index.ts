import { Router } from "..";

Router.options( "/aws/lambda/functions", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/aws/lambda/functions", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");
    const functions = await Lambda.Client.Functions();
    response.status( 200 ).send( {
        functions
    } );
} );

export { Router };
