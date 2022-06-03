import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Utility.Health" );
Router.get( "/utility/health", async (request, response) => {
    const { Health } = await import("@iac-factory/api-services");

    response.status( 200 ).send( {
        status: "Online",
        services: Health()
    } );
} );

export default Router;
