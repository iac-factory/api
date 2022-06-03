/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API" );

Router.use( "/:route", async (request, response, next) => next() );
Router.param( "route", (request, response, next) => {
    response.set( "X-Open-API", "True" );

    next();
} );

Router.get( "/", async (request, response) => {
    response.status( 200 ).send( {
        message: true
    } );
} );

export default Router;

void import("./routes");

export interface Dictionary {
    [ key: string ]: string;
}

export type Parameters = Dictionary;

export interface Handler<Parameter = Dictionary,
    Locals extends Record<string, any> = Record<string, any>> {
    (callable: { dictionary: Dictionary, locals: Locals }): void;
}
