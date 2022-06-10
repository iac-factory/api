/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda.Filter" );
const Schema = Router.update( {
    "/aws/lambda/functions/:filter": {
        // summary: "AWS API Lambda Route(s)",
        // description: "AWS-related Lambda API Endpoints",
        parameters: [
            {
                name: "name",
                description: "Retrieve All AWS Lambda Function via Name; Data is Guaranteed to be Unique",
                in: "path",
                example: "/aws/lambda/functions/name"
            },
            {
                name: "arn",
                description: "Retrieve All AWS Lambda Function ARNs; Data is Guaranteed to be Unique",
                in: "path",
                example: "/aws/lambda/functions/arn"
            },
            {
                name: "role",
                description: "Retrieve All AWS IAM Role(s) Consumed by Lambda; Data is Guaranteed to be Unique",
                in: "path",
                example: "/aws/lambda/functions/role"
            },
            {
                name: "environment-variables",
                description: "Retrieve All AWS Lambda Function(s) Environment Variable(s); Includes Lambda Function Name + ARN",
                in: "path",
                example: "/aws/lambda/functions/environment-variables"
            }
        ],
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
