import { Router } from "..";
Router.options( "/aws", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/aws", async (request, response) => {
    response.status( 200 ).send( {
        message: true
    } );
} );

export { Router };