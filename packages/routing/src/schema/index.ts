import { Controller } from "@iac-factory/api-services";

export const Router = Controller("IaC.Factory.API.Schema");
Router.get( "/schema", async (request, response) => {
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

export default Router;