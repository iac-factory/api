/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Login" );

const Schema = Router.update( {
    "/login": {
        summary: "... Summary",
        description: "... Description",
        get: {
            responses: {
                "200": {
                    description: "... Description",
                    headers: {},
                    content: { "Application/JWT": { schema: { type: "string" }, example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkFwcGxpY2F0aW9uL0pXVCJ9.eyJpZCI6IjYyYTJiMTQ2MjNlMmNlM2M2MzY1OWM3OSIsInVpZCI6IjVhMjlkZDRiLWQzYTItNGE4NS1iMjczLWM0NzMyM2Y0YzMxZSIsImlhdCI6MTY1NDg0MjUzNiwiZXhwIjoxNjU0OTI4OTM2LCJhdWQiOlsiaHR0cDovL2xvY2FsaG9zdCIsIkludGVybmFsIiwiQWNjZXNzIl0sImlzcyI6IklhQy1BUEkiLCJzdWIiOiJBZG1pbmlzdHJhdG9yIn0.L1Q4om-PjyIXSbbNk4bUrISDzT0Pet-vbE-yX1EeiZY" } }
                },
                "401": {
                    description: "... Description",
                    headers: { "WWW-Authentication": { schema: { enum: [ "Token-Exchange" ] } } }
                }
            },
            tags: [ Router.registry.symbol.toString() ]
        }
    }
} );

export default Schema;
