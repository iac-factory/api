/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Schema, { Router } from "./definition";

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
Router.get( Schema.path, async (request: { params: { filter?: string } }, response) => {
    const { Lambda } = await import("@iac-factory/api-services");

    const filter = request.params.filter;
    const error: { throw: boolean } = { throw: false };

    const { Functions } = Lambda.Client;

    switch ( filter ) {
        case "name": {
            const functions = await Functions();
            const data = ( functions ) ? [...new Set(functions.filter( (lambda) => lambda )
                .map( (configuration) => {
                    return configuration.FunctionName;
                } )
            )] : null;

            ( error.throw ) || response.status( 200 ).send( {
                Functions: data
            } );

            break;
        }

        case "arn": {
            const functions = await Functions();
            const data = ( functions ) ? [...new Set(functions.filter( (lambda) => lambda )
                .map( (configuration) => {
                    return configuration.FunctionArn;
                } )
            )] : null;

            ( error.throw ) || response.status( 200 ).send( {
                Functions: data
            } );

            break;
        }

        case "role": {
            const functions = await Functions();
            const data = ( functions ) ? [...new Set(functions.filter( (lambda) => lambda )
                .map( (configuration) => {
                    return configuration.Role;
                } )
            )] : null;

            ( error.throw ) || response.status( 200 ).send( {
                Functions: data
            } );

            break;
        }

        case "environment-variables": {
            const data: ( string | undefined | { Variables?: object; Function?: string; ARN?: string } )[] = [];
            const functions = await Functions();
            ( functions ) && functions.filter( (lambda) => lambda )
                .forEach( (configuration) => data
                    .push( {
                        Variables: configuration.Environment?.Variables,
                        Function: configuration.FunctionName,
                        ARN: configuration.FunctionArn
                    } )
                );

            ( error.throw ) || response.status( 200 ).send( {
                Functions: data
            } );

            break;
        }

        default: {
            error.throw = true;
            break;
        }
    }

    ( error.throw ) && response.status( 406 ).send( {
        Code: 406,
        Status: "Not Acceptable",
        Error: "Invalid-Filter-Exception",
        Message: "Filter Must be := 'name' | 'arn' | 'role' | 'environment-variables'"
    } );
} );

export default Router;
