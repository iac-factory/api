import { Controller } from "@iac-factory/api-services";

export const Router = Controller("IaC.Factory.API.AWS.Lambda.Functions");
Router.get( "/aws/lambda/functions", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");
    const functions = await Lambda.Client.Functions();
    response.status( 200 ).send( {
        functions
    } );
} );

export default Router;
