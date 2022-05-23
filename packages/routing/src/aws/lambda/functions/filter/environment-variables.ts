import { Controller } from "@iac-factory/api-services";

export const Router = Controller("IaC.Factory.API.AWS.Lambda.Functions.Filter.Variables");

Router.get( "/aws/lambda/functions/filter/environment-variables", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");

    // Filter based on query ("variable") parameter
    const filter = request.query["variable"];

    const functions = (filter) ? await Lambda.Client.Functions() : null;

    /// Filtered Lambda Configurations
    const configurations = (filter) ? (functions)?.map((configuration) => {
        const variables = configuration.Environment?.Variables;
        const keys = (variables) ? Object.keys(variables) : [];

        /// Return Lambda configuration if environment-variable is found
        if (keys.includes(filter as string)) {
            return configuration
        } return null;
    }).filter((predicate) => predicate) : [{
        warning: "A Query Parameter ('variable') Wasn't Found"
    }];

    response.status( 200 ).send( {
        configurations
    } );
} );

Router.get( "/aws/lambda/functions/filter/environment-variables/:variable", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");

    // Filter based on path-name
    const filter = request.params.variable;

    const functions = (filter) ? await Lambda.Client.Functions() : [{}];

    /// Filtered Lambda Configurations
    const configurations = (functions)?.map((configuration) => {
        const variables = configuration.Environment?.Variables;
        const keys = (variables) ? Object.keys(variables) : [];

        /// Return Lambda configuration if environment-variable is found
        if (keys.includes(filter)) {
            return configuration
        } return null;
    }).filter((predicate) => predicate);

    response.status( 200 ).send( {
        configurations
    } );
} );

export default Router;
