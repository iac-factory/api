/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import * as AWS from "@aws-sdk/client-lambda";
import { Debugger } from "@iac-factory/api-core";

import { Handler as Throttle } from "@iac-factory/api-utilities";

export module Client {
    import Invoker = Client.Policy.Invoker;

    export const Functions = async function () {
        /*** Essentially namespaced "static" properties */

        const max: number = 1;
        const region: string = "us-east-2";

        /***
         * The `Functions` "prototype" constructor
         * ---
         *
         * @type {{client: Client.Functions.Client, command: Client.Functions.Command, handler: Client.Functions.Paginator, wait(duration: number): Promise<void>, instance: () => AWS.LambdaClient, arguments: (input?: Client.Functions.Input) => AWS.ListFunctionsCommand, paginator: () => any, paginate(state: {page: number, errors: Array<Error | string>}): Promise<void>, interface(): Promise<this>}}
         */
        const constructor = new (
            class {
                private client: Functions.Client;
                private command: Functions.Command;
                handler: Functions.Paginator;

                constructor() {
                    this.client = this.instance();
                    this.command = this.arguments();
                    this.handler = this.paginator();
                }

                private instance = () => new AWS.LambdaClient( { region } );
                private arguments = (input?: Functions.Input) => new AWS.ListFunctionsCommand( { ... input, ... { MaxItems: max } } );
                private paginator = () => Object.create( {
                    data: [],
                    token: undefined,
                    response: undefined
                } );

                /***
                 * [...] - @todo (Update Description)
                 *
                 * @param {{page: number, errors: Array<Error | string>}} state
                 * @returns {Promise<void>}
                 * @private
                 */
                private async paginate(state: { page: number; errors: Array<Error | string> }): Promise<void> {
                    /*** @experimental */
                    const Logger = Debugger.hydrate( {
                        module: [ "Functions", "yellow" ],
                        level: [ "Debug", "cyan" ],
                        depth: [ 1, true ]
                    } );

                    const location = async (input: Function.Input): Promise<AWS.FunctionCodeLocation | null> => {
                        const command = new AWS.GetFunctionCommand(input);
                        const response = await this.client.send(command);
                        return (response.Code) ? response.Code : null;
                    }

                    const lambda = async () => {
                        Logger.debug( "Paginator" + " " + "(" + state.page + ")" );

                        const command = this.arguments( { Marker: this.handler.token } );
                        const response = await this.client.send( command );
                        const functions = (response.Functions) ? Array.from( response.Functions ) : null;

                        const data: Output[] = [];

                        if (functions) {
                            const iterator = { index: 0 };
                            for await (const lambda of functions) {
                                const name = lambda.FunctionName;
                                const code = await location({ FunctionName: name });

                                (code) && data.push({
                                    Location: code,
                                    ... functions[iterator.index]
                                });

                                iterator.index++;
                            }
                        }

                        this.handler.data.push( ... data );

                        state.page = ( data ) ? state.page + 1 : state.page;

                        const { NextMarker: token } = response;

                        this.handler.response = ( response ) ? response : this.handler.response;

                        this.handler.token = ( token ) ? token : undefined;
                    };

                    do { await Throttle.evaluate(lambda, state); } while ( this.handler.token );
                }

                /***
                 * The only public interface that otherwise instantiates the "Functions"
                 * Anonymous class.
                 *
                 * <br/>
                 *
                 * It was elected to use an anonymous class to keep the design pattern
                 * around using Typescript Modules simple and straight forward. A little
                 * complexity here eliminates a lot of complexity on the client-related
                 * usage.
                 *
                 * <br/>
                 *
                 * Having classes available in client-packages can result in odd & abused
                 * usage patterns. Given the purpose of the following class is to simply
                 * iterate an AWS account's Lambda Function(s), returning potentially specific
                 * or filtered subset(s), it's of interest to avoid potential inheritance.
                 *
                 * <br/>
                 *
                 * Classes were used only to facilitate the temporary state-related pattern
                 * behind the pagination logic (and to keep methods/functions namespaced without
                 * created an entirely separate module/directory).
                 *
                 * @returns {Promise<this>}
                 *
                 */
                public async interface(): Promise<this> {
                    const state = {
                        page: 0,
                        errors: new Array( 0 )
                    };

                    const command = this.arguments( { Marker: this.handler.token } );
                    const response = await this.client.send( command );

                    const data = Array.from( response.Functions! );

                    this.handler.data.push( ... data );

                    state.page = ( data ) ? state.page + 1 : state.page;

                    const { NextMarker: token } = response;

                    this.handler.response = ( response ) ? response : this.handler.response;

                    this.handler.token = ( token ) ? token : undefined;

                    await this.paginate( state );

                    return this;
                }
            } )();

        const { handler } = await constructor.interface();

        return ( handler && handler.data )
            ? handler.data.flat()
            : null;
    };

    /***
     * [...] - @todo (Update Description)
     *
     * @private
     *
     * @param {string} name
     * @returns {Promise<Client.Policy.Permission | null>}
     * @constructor
     */
    const Policy = async (name?: string) => {
        const client = new AWS.LambdaClient( { region: "us-east-2" } );
        const command = ( name ) ? new AWS.GetPolicyCommand( { FunctionName: name } ) : null;

        const response = ( command ) ? await client.send( command ).catch( (error) => null )
            : null;

        const policy = ( response ) ? response[ "Policy" ] : null;

        const serial: Policy.Permission = ( response && policy ) ? JSON.parse( policy ) : null;

        return ( serial ) ? serial : null;
    };

    /***
     * [...] - @todo (Update Description)
     *
     * @private
     *
     * @param {string} name
     * @returns {Promise<Client.Policy.Statement[] | null>}
     * @constructor
     */
    const Statements = async (name?: string) => {
        const policy = await Policy( name );

        const statements = ( policy ) ? policy[ "Statement" ] : null;

        return ( statements ) ? statements : null;
    };

    /***
     * Exposed Interface for Gathering Lambda Function "Invokers"
     * ---
     *
     * "Invokers" is a personally identified construct that represents
     * both *Lambda Function Configurations* (Functions), as well as any
     * "Trigger"-related resources -- e.g. **API-Gateway Endpoint(s)**.
     *
     * <br/>
     *
     * @public
     *
     * @param {string} name
     * @returns {Promise<Client.Policy.Invoker[] | null>}
     * @constructor
     */
    export const Invokers = async (name?: string): Promise<Invoker[] | null> => {
        const statements = await Statements( name );

        const invokers = ( statements ) ? statements.map( (statement) => {
            const resource = statement[ "Resource" ];
            const service = statement[ "Principal" ][ "Service" ] as string;
            const condition = statement[ "Condition" ];

            const arn = ( condition && condition[ "ArnLike" ] ) ? condition[ "ArnLike" ] : null;
            const source = ( arn ) ? arn[ "AWS:SourceArn" ] : null;

            return {
                resource,
                service,
                invoker: source
            };
        } ) : null;

        return ( invokers ) ? invokers : null;
    };

    export module Policy {
        export type Permission = {
            Version: string;
            Id: string;
            Statement?: Statement[];
        }

        export interface Statement {
            Sid: string;
            Effect: "Allow" | "Deny";
            Principal: {
                Service: /*** Service | */ string | "apigateway.amazonaws.com";
            };
            Action: "lambda:InvokeFunction" & string;
            /*** Resource ARN */
            Resource: string;
            Condition: {
                ArnLike?: {
                    "AWS:SourceArn": string;
                };
            };
        }

        export interface Invoker {
            resource: string;
            service: string;
            invoker: string | null;
        }

        export type Configuration = {
            name: AWS.FunctionConfiguration["FunctionName"];
            configuration: Function.Configuration;
        }

        export type Client = AWS.LambdaClient;
        export type Command = AWS.GetPolicyCommand;
        export type Input = AWS.GetPolicyCommandInput;
        export type Output = AWS.GetPolicyCommandOutput;
    }

    export module Functions {
        export type Client = AWS.LambdaClient;
        export type Command = AWS.ListFunctionsCommand;
        export type Input = AWS.ListFunctionsCommandInput;
        export type Output = AWS.ListFunctionsCommandOutput;

        export type Configuration = AWS.FunctionConfiguration;

        export type Paginator = Handler;
    }

    export module Function {
        export type Client = AWS.LambdaClient;
        export type Command = AWS.GetFunctionCommand;
        export type Input = AWS.GetFunctionCommandInput;
        export type Output = AWS.GetFunctionCommandOutput;

        export type Configuration = AWS.FunctionConfiguration;

        export type Functions = typeof Client.Functions;
    }

    export abstract class Handler {
        abstract data: Output[];
        abstract token?: string;
        abstract response?: AWS.ListFunctionsCommandOutput;
    }
}

type Output = AWS.FunctionConfiguration & {Location?: AWS.FunctionCodeLocation };

export default Client;
