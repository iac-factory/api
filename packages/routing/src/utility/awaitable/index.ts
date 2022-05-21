import { Router } from "..";

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