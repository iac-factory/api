import Path from "path";

import Mongoose from "mongoose";

export * from "./user";

export module Context {
    const state: {connection: null | any }  = { connection: null };

    export const Handler = async function() {
        const uri = process.env["DOCUMENTDB_URI"] as string;

        if (state.connection == null) {
            state.connection = Mongoose.connect(uri, {
                dbName: "Authentication",
                replicaSet: "rs0",
                directConnection: true,
                user: process.env["DOCUMENTDB_USERNAME"],
                pass: process.env["DOCUMENTDB_PASSWORD"],
                serverSelectionTimeoutMS: 5000,
                retryWrites: false,
                tlsAllowInvalidHostnames: true,
                tlsAllowInvalidCertificates: true,
                tls: true,
                tlsCAFile: Path.join(__dirname, "us-east-2-bundle.pem")
            }).then(() => Mongoose);

            // `await`ing connection after assigning to the `conn` variable
            // to avoid multiple function calls creating new connections
            await state.connection;
        }

        return state.connection;
    };

    void (async () => Handler());
}

enum Compression {
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

type Level = keyof typeof Compression;

export const Connection = async function (): Promise<void> {
    if ( !( Connection.lock ) ) {
        const validator = new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" );

        const options: import("mongodb").MongoClientOptions = {
            auth: {
                username: "...",
                password: "..."
            }, connectTimeoutMS: 5000,
            directConnection: true,
            replicaSet: "rs0",
            appName: "Nexus-API",
            authMechanism: "DEFAULT",
            tlsCAFile: Path.join(__dirname, "us-east-2-bundle.pem"),
            tls: true,
            tlsAllowInvalidHostnames: true,
            tlsAllowInvalidCertificates: true,
            retryWrites: false
        } as const;

        Connection.options = options;

        // validator.test( (URI) ? URI : "" ) || ( () => {
        //     console.log( "Error - Invalid URI" );
        //     process.exit( 1 );
        // } )();
    }

    async function Handler (): Promise<import("mongodb").MongoClient | undefined> {
        return new Promise( async (resolve) => {
            const Client = await import("mongodb").then((Module) => Module.MongoClient);
            Client.connect(process.env["MONGO_URI"]!, Connection.options!, (exception, connection) => {
                if (exception) throw exception;

                Connection.client = connection;

                resolve(connection);
            });
        } );
    }

    (Mongoose.connection) || await Handler();

    ( Connection?.client?.readyState !== 1 ) && Reflect.set( Connection, "lock", false );

    return ( Connection?.lock ) ? Connection?.client : Handler();
};

Connection.lock = false;
Connection.data = Object.create( {} );
Connection.options = Object.create( {} );
Connection.client = Object.create( {} );

export default Context.Handler();

