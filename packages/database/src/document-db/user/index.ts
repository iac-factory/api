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

import ORM, { Model, Schema } from "mongoose";

import { Hash } from "./../middleware";

import Name, { schema as name } from "./name";

interface Type {
    email?: string;
    username?: string;
    password?: string;
    login?: Date;
    role?: string;

    creation: Date;
    modification: Date;

    name?: Name
}

interface Methods {
    check(): boolean;

    hash(): Promise<void>;
}

export type Representation = Model<Type, {}, Methods>;

export const schema = new Schema<Type, Representation, Methods>( {
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

    login: { // Password Usage (Date)
        name: "login",
        alias: "Login",
        default: null,

        type: ORM.Schema.Types.Date
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

        /*** type: name */
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

export const User = ORM.model<Type, Representation, Methods>( "User", schema, "User" );

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

            await Record.save().catch( (error) => {
                console.warn("[Warning]", "Failure Creating Record");
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
