import { Router } from "..";

export default Router.get( "/utility/health", async (request, response) => {
    const { Health } = await import("@iac-factory/api-services");

    response.status( 200 ).send( {
        status: "Online",
        services: Health()
    } );
} );

export { Router };