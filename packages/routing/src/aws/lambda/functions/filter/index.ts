/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda.Functions.Filter" );

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

    const filter = request.params.filter;
    const error: { throw: boolean } = { throw: false };
    const data: ( string | undefined | { Variables?: object; Function?: string; ARN?: string } )[] = [];

    const { Functions } = Lambda.Client;

    const functions = await Functions();

    switch ( filter ) {
        case "name": {
            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.FunctionName )
                );
            break;
        }

        case "arn": {
            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.FunctionArn )
                );
            break;
        }

        case "role": {
            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( configuration.Role )
                );
            break;
        }

        case "environment-variables": {
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

    ( error.throw ) && response.status( 406 ).send( {
        code: 406,
        status: "Not Acceptable",
        error: "Invalid-Filter-Exception",
        message: "Filter Must be := 'name' | 'arn' | 'role' | 'environment-variables'"
    } );

    ( error.throw ) || response.status( 200 ).send( {
        functions: data
    } );
} );

export default Router;
