import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda" );
Router.get( "/aws/lambda", async (request, response) => {
    response.status( 200 ).send( {
        message: true
    } );
} );

export default Router;
