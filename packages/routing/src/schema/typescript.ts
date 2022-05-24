import { Controller } from "@iac-factory/api-services";

export const Router = Controller("IaC.Factory.API.Schema.Typescript");
Router.get( "/schema/typescript", async (request, response) => {
    const { Schema } = await import("@iac-factory/api-schema");

    const TS = await Schema.TS.resolve();

    response.status( 200 ).send( TS );
} );

export default Router;
