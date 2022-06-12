/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import ORM, { Model, Schema, model } from "mongoose";

export interface Type {
    date?: Date;
    expiration?: Date;

    origin?: string;
    token?: string;
}

export type Methods = {
    /*** Compares `password` against Hash */
    compare(password: string): Promise<[boolean, string]>

    /*** Overwrites Plain-Text Password */
    hash(): Promise<boolean>;

    /*** Updates Document's `login` Field */
    authorize(): Promise<Schema>;
};

export const schema = new Schema<Type, {}, Methods>( {
    date: { // Password Usage (Date)
        name: "login",
        alias: "Login",
        default: null,

        type: ORM.Schema.Types.Date
    },

    expiration: {
        name: "expiration",
        alias: "Expiration",
        default: null,

        type: ORM.Schema.Types.Date
    },

    origin: {
        name: "origin",
        alias: "Origin",
        default: null,

        type: ORM.Schema.Types.String
    },

    token: {
        name: "token",
        alias: "Token",
        default: null,

        type: ORM.Schema.Types.String
    }
});

export const Login = model<Type, Model<Type, {}, Methods>, Methods>( "Login", schema, "Login" );
export type Login = typeof Login;
export default Login;
