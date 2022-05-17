import { Router } from "..";
Router.options( "/utility", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/test", async (request, response) => {
    response.status( 200 );

    return response.json( {
        message: true
    } );
} );

export { Router };