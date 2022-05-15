import { Controller } from "@iac-factory/api-services";

const Router = Controller();

Router.get( "/", async (request, response, callback) => {
    try {
        response.status( 200 ).send( { message: true } );
    } catch ( error ) {
        response.status( 500 ).send( {
            error: error || "Server Error"
        } );
    } finally {
        callback();
    }
} );

export { Router };
export default Router;