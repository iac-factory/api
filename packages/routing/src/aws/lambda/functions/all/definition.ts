/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda.Code-Locations" );
const Schema = Router.update( {
    "/aws/lambda/functions/all": {
        summary: "AWS API Lambda Functions",
        description: "All AWS Lambda Function(s) for a Given AWS Account",
        get: {
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" }
                        }
                    }
                }
            },
            tags: [ Router.registry.symbol.toString() ]
        }
    }
}, true );

export default Schema;
