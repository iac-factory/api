import { Controller } from "@iac-factory/api-services";

export const Router = Controller("IaC.Factory.API.Utility");
Router.get( "/utility", async (request, response) => {
    response.status( 200 );

    return response.json( {
        message: true
    } );
} );

export default Router;