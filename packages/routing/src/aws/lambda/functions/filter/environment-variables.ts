import { Router } from "..";

Router.options( "/aws/lambda/functions/filter/environment-variables/:variable", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/aws/lambda/functions/filter/environment-variables/:variable", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");
    const functions = await Lambda.Client.Functions();

    // @ts-ignore
    const test = functions?.filter(($) => $.Environment).filter(($) => $!.Environment!.Variables).map((functional) => {
        if (functional!.Environment!.Variables!["AUTH_AND_ENTITLEMENT_DB_USERNAME"]) {
            return functional
        }
    }).filter((functional) => functional);

    response.status( 200 ).send( {
        test
    } );
} );

export { Router };
