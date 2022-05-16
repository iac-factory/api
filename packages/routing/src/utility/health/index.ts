import { Router } from "..";
Router.options( "/utility/health", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/utility/health", async (request, response) => {
    const { Health } = await import("@iac-factory/api-services");

    response.status( 200 ).send( {
        status: "Online",
        services: Health()
    } );
} );

export { Router };