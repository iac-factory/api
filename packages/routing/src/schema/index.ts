import { Router } from "..";

Router.options( "/schema", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

export default Router.get( "/schema", async (request, response) => {
    const { Schema } = await import("@iac-factory/api-schema");

    const schemas = Object.entries( Schema ).map( (value, index) => {
        return {
            schema: value[ 0 ],
            details: {
                name: value[ 1 ].name,
                file: value[1].file,
                description: value[1].description
            }
        };
    } );

    response.status( 200 ).send( schemas );
} );

export { Router };