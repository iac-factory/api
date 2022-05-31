import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Utility.Health.PostgreSQL" );
Router.get( "/utility/health/pg", async (request, response) => {
    const { PG } = await import("@iac-factory/api-database");

    const health: Response = (await PG.Health())
        ? "Online" : "Offline";

    response.status( 200 ).send( {
        status: health
    } );
} );

export type Response = "Online" | "Offline";

export default Router;
