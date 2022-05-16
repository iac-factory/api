import { ARN, Identifier, Lambda, Hook } from ".";

export module Composition {
    export type Invoker = Lambda.Policy.Invoker;
    export type Functions = FlatArray<Lambda.Functions.Configuration[], 1>[] | null;

    export interface Lambda {
        valid: boolean;
        service: string;
        region: string;
        account: string;
        type: string;
        name: string;
        api?: Trigger;
    }

    export interface Trigger {
        id: string;
        region: string | null;
        account: string | null;
        service: string | null;
        resource: string | null;
        path: string | null;
        method: string | null;
    }

    export const Endpoints = async (): Promise<Composition.Lambda[]> => {
        const resources: Functions = await Lambda.Functions();

        const configurations = ( resources ) ? resources : [];

        const invokers: Invoker[] | null = [];

        for await ( const resource of configurations ) {
            const { FunctionName: name } = resource;

            const target = Lambda.Invokers( name );

            // @ts-ignore
            invokers.push( target );
        }

        const data = await Promise.all( invokers )
            .then( ( container ) => {
                return container.filter( ( instance ) => instance )
                    .flat() as any as Invoker[];
            } );

        const partials = data.map( ( awaitable ) => {
            const { resource, invoker: endpoint } = awaitable;

            const Resource = Reflect.construct( String, [ resource ] );
            Resource.valid = ARN.validate( resource );

            Object.assign( Resource, {
                ...ARN.normalize( Reflect.construct( String, [ resource ] ) ),
...{
                    trigger: Identifier( endpoint! )
                }
            } );

            return { lambda: Resource };
        } );

        // @ts-ignore
        const Mapping: Lambda[] = partials.map( ( $ ) => {
            return {
                valid: $.lambda.valid,
                service: $.lambda.service,
                region: $.lambda.region,
                account: $.lambda.account,
                type: $.lambda.resource.includes( "function" ) ? "function" : null,
                name: $.lambda.resource.replace( "function" + ":", "" ),
                api: {
                    id: $.lambda.trigger.id,
                    region: $.lambda.trigger.region,
                    account: $.lambda.trigger.account,
                    service: $.lambda.trigger.service,
                    resource: $.lambda.trigger.resource,
                    path: $.lambda.trigger.path,
                    method: $.lambda.trigger.method
                }
            };
        } );

        const mapping = Array.from((Mapping));

        Hook.table( mapping.map(($) => {
            const item = $;
            const api = $.api;

            /// delete item.api;

            return {
                ...item, ...api
            };
        }), "table.endpoints.log" );

        return mapping;
    };
}

export default Composition;
