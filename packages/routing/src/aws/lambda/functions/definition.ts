/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda.Functions" );
const Schema = Router.update( {
    "/aws/lambda/functions": {
        summary: "AWS API Lambda Route(s)",
        description: "AWS-related Lambda API Endpoints",
        get: {
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                            example: { Status: "Online" }
                        }
                    }
                }
            },
            tags: [ Router.registry.symbol.toString() ]
        }
    }
}, true );

export default Schema;
