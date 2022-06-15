/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

const Global = Object.create( {
    initialize: ( process.env[ "INITIALIZE" ] === "true" )
} );

import ORM, { Schema, model } from "mongoose";

import * as Mongoose from "mongoose";

import * as Middleware from "./../middleware";

const { Hash } = Middleware.User;
const { Compare } = Middleware.User;
const { Authorize } = Middleware.User;

import Name, { schema as name } from "./name";

export interface Type {
    email?: string;
    username?: string;
    password?: string;
    login?: {
        date: Date,
        expiration: Date,
        origin: string
    };
    role?: string;

    creation: Date;
    modification: Date;

    name?: Name;
}

export type Methods = {
    /*** Compares `password` against Hash */
    compare(password: string): Promise<[ boolean, string ]>

    /*** Overwrites Plain-Text Password */
    hash(): Promise<boolean>;

    /*** Updates Document's `login` Field */
    authorize(session: { token: string, date: Date, expiration: Date, origin: string }): Promise<Schema>;
};

export type Model = ORM.Model<Type, {}, Methods>;

export const schema = new Schema<Type, Model, Methods>( {
    email: {
        name: "email",
        alias: "Email",
        type: String,
        required: true,
        index: true,
        unique: true,
        default: null,
        lowercase: true,
        trim: true
    },

    username: {
        name: "username",
        alias: "Username",
        type: String,
        required: true,
        index: true,
        unique: true,
        default: null,
        lowercase: true,
        trim: true
    },

    password: {
        name: "password",
        alias: "Password",
        type: String,
        required: true,
        default: null,
        trim: true
    },

    login: {
        name: "login",
        alias: "Login",
        default: null,
        required: false,

        type: {
            date: {
                name: "login",
                alias: "Login",
                default: null,
                required: false,
                type: ORM.Schema.Types.Date
            },

            expiration: {
                name: "expiration",
                alias: "Expiration",
                default: null,
                required: false,
                type: ORM.Schema.Types.Date
            },

            origin: {
                name: "origin",
                alias: "Origin",
                default: null,
                required: false,
                type: ORM.Schema.Types.String
            }
        }
    },

    name: {
        name: "name",
        alias: "Name",
        required: false,
        default: null,
        type: {
            first: {
                name: "first",
                required: true,
                type: String,
                alias: "First",
                trim: true
            },
            middle: {
                name: "middle",
                required: false,
                type: String,
                default: null,
                alias: "Middle",
                trim: true
            },
            last: {
                name: "last",
                required: true,
                type: String,
                default: null,
                alias: "Last",
                trim: true
            },
            preferred: {
                name: "preferred",
                required: false,
                type: String,
                default: null,
                alias: "Preferred",
                trim: true
            }
        }
    }
}, {
    versionKey: "version",
    timestamps: {
        createdAt: "creation",
        updatedAt: "modification"
    },
    autoCreate: true
} );

schema.methods.hash = Hash;
schema.methods.authorize = Authorize;
schema.methods.compare = Compare;

export const User = model<Type, Model>( "User", schema );

async function Initialize() {
    await import("..");

    const empty = ( await User.collection.stats() ).count === 0;

    const Record = new User( {
        email: "administrator@internal.io",
        username: "Administrator",
        password: "Kn0wledge!",
        name: {
            first: "Jacob",
            middle: "Brian",
            last: "Sanders"
        }
    } );

    ( Global.initialize && empty ) && Record.save( async (error: any) => {
        if ( error ) {
            Record.delete( { _id: Record.id } );

            await Record.save().catch( (error: any) => {
                console.warn( "[Warning]", "Failure Creating Record" );
            } );

            throw error;
        }

        await Record.hash();
        await Record.updateOne();
        await Record.save();
    } );
}

void ( async () => Initialize() )();

export default User;
