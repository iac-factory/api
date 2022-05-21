import { Router } from "..";

export default Router.get( "/test", async (request, response) => {
    response.status( 200 );

    return response.json( {
        message: true
    } );
} );

export { Router };