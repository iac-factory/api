/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS from "fs";
import Path from "path";

import Mongoose from "mongoose";

export * from "./user";

import Certificate from "./us-east-2-bundle.json";

FS.writeFileSync(Path.join( __dirname, "us-east-2-bundle.pem" ), Certificate.Chain);

export module Context {
    const state: { connection: null | any } = { connection: null };
    const settings: {
        lock: boolean,
        data: object,
        options: object,
        client?: import("mongodb").MongoClient
    } = {
        lock: false,
        data: Object.create( {} ),
        options: Object.create( {} )
    };

    export enum Compression {
        "$0" = 0,
        "$1" = 1,
        "$2" = 2,
        "$3" = 3,
        "$4" = 4,
        "$5" = 5,
        "$6" = 6,
        "$7" = 7,
        "$8" = 8,
        "$9" = 9,
    }

    export type Level = keyof typeof Compression;
    export const Handler = async function () {
        const uri = process.env[ "DOCUMENTDB_URI" ] as string;

        if ( state.connection == null ) {
            state.connection = Mongoose.connect( uri, {
                dbName: "Authentication",
                replicaSet: "rs0",
                directConnection: true,
                user: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_USERNAME" ] : undefined,
                pass: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_PASSWORD" ] : undefined,
                serverSelectionTimeoutMS: 5000,
                retryWrites: false,
                tlsAllowInvalidHostnames: true,
                tlsAllowInvalidCertificates: true,
                tls: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ),
                tlsCAFile: Path.join( __dirname, "us-east-2-bundle.pem" )
            } ).then( () => Mongoose );

            // `await`ing connection after assigning to the `conn` variable
            // to avoid multiple function calls creating new connections
            await state.connection;
        }

        return state.connection;
    };

    export const Connection = async function (): Promise<void> {
        if ( !( settings.lock ) ) {
            const validator = new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" );

            const options: import("mongodb").MongoClientOptions = {
                auth: {
                    username: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_USERNAME" ] : undefined,
                    password: ( process.env[ "DOCUMENTDB_ENABLE_AUTH" ] === "true" ) ? process.env[ "DOCUMENTDB_PASSWORD" ] : undefined
                },
                connectTimeoutMS: 5000,
                directConnection: true,
                replicaSet: "rs0",
                appName: "Nexus-API",
                authMechanism: "DEFAULT",
                tlsCAFile: Path.join( __dirname, "us-east-2-bundle.pem" ),
                tls: ( process.env[ "DOCUMENTDB_ENABLE_TLS" ] === "true" ),
                tlsAllowInvalidHostnames: true,
                tlsAllowInvalidCertificates: true,
                retryWrites: false
            } as const;

            settings.options = options;

            // validator.test( (URI) ? URI : "" ) || ( () => {
            //     console.log( "Error - Invalid URI" );
            //     process.exit( 1 );
            // } )();
        }

        async function Handler(): Promise<import("mongodb").MongoClient | null> {
            const client: import("mongodb").MongoClient | null = await new Promise( async (resolve) => {
                const Client = await import("mongodb").then( (Module) => Module.MongoClient );
                Client.connect( process.env[ "MONGO_URI" ]!, settings.options!, (exception, connection) => {
                    if ( exception ) throw exception;

                    settings.client = connection;

                    resolve( connection ?? null );
                } );

                return Client;
            } );

            ( client ) && Reflect.set( settings, "lock", true );

            return client;
        }

        ( Mongoose.connection ) || await Handler();

        void ( settings?.lock ) ? settings?.client : await Handler();
    };

    void ( async () => Handler() );
}

export default Context.Handler();

