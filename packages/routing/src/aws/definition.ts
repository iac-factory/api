/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS" );
const Schema = Router.update( {
    "/aws": {
        summary: "AWS API Route(s)",
        description: "AWS-related API Endpoints relating to Various Utilities, Security, and Development Data",
        get: {
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: {
                        "Application/JSON": {
                            schema: { type: "object" },
                            example: { Routes: [ "lambda" ] }
                        }
                    }
                }
            },
            tags: [ Router.registry.symbol.toString() ]
        }
    }
}, true );

export default Schema;
