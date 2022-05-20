import { Router } from "..";

import { Lambda } from "IaC.API.Schema.AWS";
import { Runtime } from "inspector";

export module Index {
    export const Local = (local: Locality) => {

        const keys = Properties(local);

        console.debug("[Debug] Local Property Key(s)" + ":", keys);
    };

    function Properties<Generic>($: Generic): Array<keyof Generic> {
        return Object.keys($) as Array<keyof typeof $>;
    }
}

/***
 * Types of available filter(s):
 *
 *  1. `"name"`
 *  2. `"arn"`
 *  3. `"role"`
 *  4. `"environment-variables"`
 *
 *  Implementation is handled via the router in simple cases; increasingly complex
 *  solutions should be moved to the @iac-factory/api-services package.
 */
Router.get( "/aws/lambda/functions/:filter", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");

    Index.Local(response.locals);

    const filter = request.params.filter;
    const error: { throw: boolean } = { throw: false };
    const data: ( string | undefined | { Variables?: object; Function?: string; ARN?: string } )[] = [];

    switch ( filter ) {
        case "name": {
            const functions = await Lambda.Client.Functions();

            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.FunctionName )
                );
            break;
        }

        case "arn": {
            const functions = await Lambda.Client.Functions();

            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.FunctionArn )
                );
            break;
        }

        case "role": {
            const functions = await Lambda.Client.Functions();

            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.Role )
                );
            break;
        }

        case "environment-variables": {
            const functions = await Lambda.Client.Functions();

            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( {
                        Variables: configuration.Environment?.Variables,
                        Function: configuration.FunctionName,
                        ARN: configuration.FunctionArn
                    } )
                );
            break;
        }

        default: {
            error.throw = true;
            break;
        }
    }

    (error.throw) && response.status(406).send({
        code: 406,
        status: "Not Acceptable",
        error: "Invalid-Filter-Exception",
        message: "Filter Must be := 'name' | 'arn' | 'role' | 'environment-variables'"
    });

    (error.throw) || response.status( 200 ).send( {
        functions: data
    } );
} );

export { Router };
export type Locality = Record<string, {}>;