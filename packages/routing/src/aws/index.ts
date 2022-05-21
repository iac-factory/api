import { Router } from "..";

export default Router.get( "/aws", async (request, response) => {
    response.status( 200 ).send( {
        message: true
    } );
} );

export { Router };
