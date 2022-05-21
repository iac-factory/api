import { Controller } from "@iac-factory/api-services";
import * as Specification from "@iac-factory/api-schema";
import { Router } from "..";
import Utility from "util";

export const Schema: Specification.OpenAPIV3.PathsObject = {
    "/test": {
        servers: [
            {
                url: [ "http://localhost:3000" ].join( "" ),
                description: "Local Server"
            },
            {
                url: [ "https://development.api.location.io" ].join( "" ),
                description: "Development Server"
            },
            {
                url: [ "https://staging.api.location.io" ].join( "" ),
                description: "Staging Server"
            },
            {
                url: [ "https://api.location.io" ].join( "" ),
                description: "Production Server"
            }
        ],
        get: {
            summary: "Returns all pets from the system that the user has access to",
            operationId: "IaC.Factory.API.Test",
            description: "Similar to a summary; however, can be more descriptive, and above all else, ***it supports markdown***",
            responses: {
                "200": {
                    description: "Successful Query",
                    headers: {
                        "Content-Type": {
                            schema: {
                                type: "string",
                                default: "Application/JSON",
                                example: [
                                    { "Content-Type": "Application/PDF" },
                                    { "Content-Type": "Video/MP4" },
                                    { "Content-Type": "Text/HTML" }
                                ]
                            },
                            style: "simple",
                            allowEmptyValue: false,
                            required: true,
                            deprecated: false
                        }
                    },
                    content: {
                        "*/*": {},
                        "application/json": {},
                        "application/xml": {}
                    }
                },
                "405": {
                    "description": "Method Not Allowed",
                    "content": {
                        "application/json": {},
                        "application/xml": {}
                    }
                }
            },
            parameters: [
                {
                    /***
                     * (Required) - The name of the parameter
                     * - Parameter names are case sensitive.
                     *
                     * - If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object.
                     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
                     *
                     * <br/>
                     *
                     * For all other cases, the name corresponds to the parameter name used by the in property.
                     */
                    name: "id",
                    in: "path",
                    description: "A unique identifier of the Test that's getting queried",
                    deprecated: false,
                    /***
                     * Determines whether this parameter is mandatory.
                     *
                     * If the parameter location is "path", this property is REQUIRED and its value MUST be true.
                     *
                     * Otherwise, the property MAY be included and its default value is false.
                     */
                    required: true,
                    schema: {
                        type: "string"
                    },
                    /*** Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
                    style: "simple"
                }
            ]
        },
        options: {
            summary: "Returns all pets from the system that the user has access to",
            operationId: "IaC.Factory.API.Test",
            description: "Similar to a summary; however, can be more descriptive, and above all else, ***it supports markdown***",
            responses: {
                "200": {
                    description: "Successful Query",
                    headers: {
                        "Content-Type": {
                            schema: {
                                type: "string",
                                default: "Application/JSON",
                                example: [
                                    { "Content-Type": "Application/PDF" },
                                    { "Content-Type": "Video/MP4" },
                                    { "Content-Type": "Text/HTML" }
                                ]
                            },
                            style: "simple",
                            allowEmptyValue: false,
                            required: true,
                            deprecated: false
                        }
                    },
                    content: {
                        "*/*": {},
                        "application/json": {},
                        "application/xml": {}
                    }
                },
                "405": {
                    "description": "Method Not Allowed",
                    "content": {
                        "application/json": {},
                        "application/xml": {}
                    }
                }
            },
            parameters: [
                {
                    /***
                     * (Required) - The name of the parameter
                     * - Parameter names are case sensitive.
                     *
                     * - If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object.
                     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
                     *
                     * <br/>
                     *
                     * For all other cases, the name corresponds to the parameter name used by the in property.
                     */
                    name: "id",
                    in: "path",
                    description: "A unique identifier of the Test that's getting queried",
                    deprecated: false,
                    /***
                     * Determines whether this parameter is mandatory.
                     *
                     * If the parameter location is "path", this property is REQUIRED and its value MUST be true.
                     *
                     * Otherwise, the property MAY be included and its default value is false.
                     */
                    required: true,
                    schema: {
                        type: "string"
                    },
                    /*** Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
                    style: "simple"
                }
            ]
        }
    },
    "/test/123": {
        get: {
            summary: "Returns all pets from the system that the user has access to",
            operationId: "IaC.Factory.API.Test.Delete",
            description: "Similar to a summary; however, can be more descriptive, and above all else, ***it supports markdown***",
            responses: {
                "200": {
                    description: "Successful Query",
                    headers: {
                        "Content-Type": {
                            schema: {
                                type: "string",
                                default: "Application/JSON",
                                example: [
                                    { "Content-Type": "Application/PDF" },
                                    { "Content-Type": "Video/MP4" },
                                    { "Content-Type": "Text/HTML" }
                                ]
                            },
                            style: "simple",
                            allowEmptyValue: false,
                            required: true,
                            deprecated: false
                        }
                    },
                    content: {
                        "*/*": {},
                        "application/json": {},
                        "application/xml": {}
                    }
                },
                "405": {
                    "description": "Method Not Allowed",
                    "content": {
                        "application/json": {},
                        "application/xml": {}
                    }
                }
            },
            parameters: [
                {
                    /***
                     * (Required) - The name of the parameter
                     * - Parameter names are case sensitive.
                     *
                     * - If in is "path", the name field MUST correspond to a template expression occurring within the path field in the Paths Object.
                     * - If in is "header" and the name field is "Accept", "Content-Type" or "Authorization", the parameter definition SHALL be ignored.
                     *
                     * <br/>
                     *
                     * For all other cases, the name corresponds to the parameter name used by the in property.
                     */
                    name: "id",
                    in: "path",
                    description: "A unique identifier of the Test that's getting queried",
                    deprecated: false,
                    /***
                     * Determines whether this parameter is mandatory.
                     *
                     * If the parameter location is "path", this property is REQUIRED and its value MUST be true.
                     *
                     * Otherwise, the property MAY be included and its default value is false.
                     */
                    required: true,
                    schema: {
                        type: "string"
                    },
                    /*** Describes how the parameter value will be serialized depending on the type of the parameter value. Default values (based on value of in): for query - form; for path - simple; for header - simple; for cookie - form. */
                    style: "simple"
                }
            ]
        }
    }
};

const Route = Controller();

const evaluate = (index: number, methods: string[]) => {
    const layer = Route.stack[ index ];

    ( "_all" in layer.route.methods )
        ? delete layer.route.methods[ "_all" ]
        : void 0;

    methods.forEach( (method) => {
        const valid = ( layer && layer.route && layer.route.methods );

        ( valid ) && Object.assign( layer.route.methods, {
            ... { [ method ]: true }, ... layer.route.methods
        } );
    } );
};

// const resolve = () => {
//     Object.entries( Schema ).forEach( (element, index, array) => {
//         const instance = element;
//
//         const path = instance[ 0 ];
//
//         const methods = Object.keys( Enumeration ).map( (evaluation) => {
//             return ( instance[ 1 ] ) && Object.keys( instance[ 1 ] ).filter( (predicate) => predicate === evaluation );
//         } ).flat();
//
//         methods.forEach( (method) => {
//             ( method ) ? Route.all( path, (request: HTTP.Request, response: HTTP.Response, next: HTTP.Next) => {
//                 console.log( element[ 0 ] );
//                 response.status( 200 ).send( {
//                     message: index
//                 } );
//             } ) : void 0;
//
//             const layer = Route.stack[ index ];
//             const route = layer.route;
//             const handler = route.stack[ 0 ];
//
//             handler.method = method;
//         } );
//
//         evaluate( index, methods as string[] );
//     } );
// };
//
// resolve();

Route.use( "/:route", async (request, response, next) => next() );
Route.param( "route", (request, response, next) => {
    Object.assign( response.locals, {
        ... {
            "open-api": ( Schema[ request.url ] ) ? {
                ... Reflect.get( Schema[ request.url ]!, request.method.toLowerCase() )
            } : { Warning: "Open-API Path" + " " + "(" + request.url + ")" + " " + "Not Found" }
        },
        ... response.locals
    } );

    console.log( Utility.inspect(response.locals[ "open-api" ], { colors: true, depth: 1 } ) );

    next();
} );

Route.options( "/test", async (request, response) => {
    const { Directory } = await import("@iac-factory/api-services");

    const directories = Directory( __filename );

    response.status( 200 ).send( directories );
} );

Route.get( "/test", async (request, response) => {
    response.status( 200 ).send( {
        message: true
    } );
} );

Route.get( "/test/schema", async (request, response) => {
    response.status( 200 ).send( {
        ... Schema
    } );
} );

Route.get( "/test/123", async (request, response) => {
    response.status( 200 ).send( {
        ... { test: true }
    } );
} );

Router.use( Route );

export { Router };

export type Type = keyof typeof Schema;
export type Path = Extract<Type, Type>;

/***
 * Open-API Schema - Route Component
 * ---
 *
 * |  Field Name |       Type       | Description                                                                                                                                                                                                                                                                                                                                                                                                                            |
 * |:-----------:|:----------------:|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
 * |     $ref    |      string      | Allows for an external definition of this path item. The referenced structure MUST be in the format of a Path Item Object. In case a Path Item Object field appears both in the defined object and the referenced object, the behavior is undefined.                                                                                                                                                                                   |
 * |   summary   |      string      | An optional, string summary, intended to apply to all operations in this path.                                                                                                                                                                                                                                                                                                                                                         |
 * | description |      string      | An optional, string description, intended to apply to all operations in this path. CommonMark syntax MAY be used for rich text representation.                                                                                                                                                                                                                                                                                         |
 * |     get     | Operation Object | A definition of a GET operation on this path.                                                                                                                                                                                                                                                                                                                                                                                          |
 * |     put     | Operation Object | A definition of a PUT operation on this path.                                                                                                                                                                                                                                                                                                                                                                                          |
 * |     post    | Operation Object | A definition of a POST operation on this path.                                                                                                                                                                                                                                                                                                                                                                                         |
 * |    delete   | Operation Object | A definition of a DELETE operation on this path.                                                                                                                                                                                                                                                                                                                                                                                       |
 * |   options   | Operation Object | A definition of a OPTIONS operation on this path.                                                                                                                                                                                                                                                                                                                                                                                      |
 * |     head    | Operation Object | A definition of a HEAD operation on this path.                                                                                                                                                                                                                                                                                                                                                                                         |
 * |    patch    | Operation Object | A definition of a PATCH operation on this path.                                                                                                                                                                                                                                                                                                                                                                                        |
 * |    trace    | Operation Object | A definition of a TRACE operation on this path.                                                                                                                                                                                                                                                                                                                                                                                        |
 * |   servers   |  [Server Object] | An alternative server array to service all operations in this path.                                                                                                                                                                                                                                                                                                                                                                    |
 * |  parameters | Parameter Object | A list of parameters that are applicable for all the operations described under this path. These parameters can be overridden at the operation level, but cannot be removed there. The list MUST NOT include duplicated parameters. A unique parameter is defined by a combination of a name and location. The list can use the Reference Object to link to parameters that are defined at the OpenAPI Object's components/parameters. |
 *
 */
