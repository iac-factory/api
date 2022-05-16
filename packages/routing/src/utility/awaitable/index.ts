import { Router } from "..";
Router.options( "/utility/awaitable", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/utility/awaitable", async (request, response) => {
    const { Awaitable } = await import("@iac-factory/api-services");

    const { duration } = request.query;

    await Awaitable((duration ?? "1500") as string).then((time) => {
        response.status( 200 ).send( {
            duration: time
        } );
    });
} );

export { Router };