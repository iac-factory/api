import { Router } from "..";

export default Router.get( "/aws/lambda/functions", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");
    const functions = await Lambda.Client.Functions();
    response.status( 200 ).send( {
        functions
    } );
} );

export { Router };
