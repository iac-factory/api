import Mongoose from "mongoose";

export * from "./user";
import type { HTTP } from "@iac-factory/api-schema";

// export const Connection = async () => {
//     console.debug("[Database]", "[Debug]", "Attempting to Establish Database Connection ...");
//
//     try {
//         await Library.ORM.connect(URI, {
//             user: process.env["MONGO_USERNAME"],
//             pass: process.env["MONGO_PASSWORD"],
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             /// dbName: "Authorization",
//             /// maxPoolSize: 10,
//             keepAlive: true,
//             autoIndex: true,
//             /// appName: process.env["Server"] || "Nexus-API",
//             forceServerObjectId: false,
//             loggerLevel: (
//                 (process.env["NODE_ENV"] !== "production")
//                 && (process.env["Environment"] !== "production")
//             ) ? "DEBUG" : "WARN"
//         });
//
//         console.debug("[Database]", "[Debug]", "A Database Connection has been Established");
//     } catch ( error ) {
//
//         console.trace("[Database]", "[Error]", "Fatal Error While Establishing Connection to Database", "\n", error);
//         console.error("[Database]", "[Error]", "Exiting ...");
//
//         /*** {@link https://github.com/cloud-hybrid/delta/tree/Development/packages/api#error-codes Error-Code(s)} */
//
//         process.exit(172);
//     }
// };

export module Context {
    const state: {connection: null | any }  = { connection: null };

    export const Handler = async function() {
        const uri = process.env["MONGO_URI"] as string;

        if (state.connection == null) {
            state.connection = Mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000
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

// export const Connection = async function (client?: HTTP.Request): Promise<Mongoose.Connection> {
//     const Utility = await import("util");
//
//     /// IP
//     (client) && console.log( Utility.inspect( ( await client ).ip, { colors: true } ) );
//     /// IP(s)
//     (client) && console.log( Utility.inspect( ( await client ).ips, { colors: true } ) );
//     /// URL
//     (client) && console.log( Utility.inspect( ( await client ).url, { colors: true } ) );
//
//     /// Application
//     (client) && console.log( Utility.inspect( ( await client ).app, { colors: true } ) );
//
//     // client.on( "close", () => {
//     //     console.log( client.response );
//     // } );
//
//     if ( !( Connection.lock ) ) {
//         const validator = new RegExp( "^(mongodb:(?:\\/{2})?)((\\w+?):(\\w+?)@|:?@?)(\\S+?):(\\d+)(\\/(\\S+?))?(\\?replicaSet=(\\S+?))?$", "gm" );
//
//         const URI = Constructor();
//
//         Connection.options = {
//             keepAliveInitialDelay: 0, // Default := 120000
//             keepAlive: true, /// Default := true
//             directConnection: false, /// Default := false Specifies whether to force dispatch all operations to the host specified in the connection URI.
//             /// dbName: Mongo.Contexts.Authentication,
//             autoCreate: true,
//             monitorCommands: true,
//             // auth: {
//             //     username: Username,
//             //     password: Password
//             // },
//             autoIndex: true,
//             promoteValues: true,
//             promoteBuffers: true,
//             serverSelectionTimeoutMS: 5000, /// Default := 30000
//             noDelay: true,
//             maxPoolSize: 15, /// Default := 100
//             maxIdleTimeMS: 5000, /// Default := Infinity,
//             minPoolSize: 0, /// Default := 0
//             compressors: "zlib",
//             zlibCompressionLevel: Compression.$9,
//             useNewUrlParser: ( process.env[ "MONGO_URLPARSER" ] === "true" ),
//             useUnifiedTopology: ( process.env[ "MONGO_UNIFIED_TOPOLOGY" ] === "true" ),
//             appName: "Testing",
//             journal: true,
//             serializeFunctions: true,
//             checkKeys: true,
//             ignoreUndefined: false, /// Default := false
//             waitQueueTimeoutMS: 5000, /// Default := 0
//             socketTimeoutMS: 5000, /// Default := 360000
//             connectTimeoutMS: 5000
//         };
//
//         validator.test( (URI) ? URI : "" ) || ( () => {
//             console.log( "Error - Invalid URI" );
//             process.exit( 1 );
//         } )();
//     }
//
//     async function Handler (): Promise<Mongoose.Connection> {
//         return new Promise( async (resolve) => {
//             console.log( "Connection" );
//             Mongoose.connect( "mongodb://127.0.0.1:27017", Connection.options, async (error) => {
//                 if ( error || Mongoose.connection.readyState !== 1 ) {
//                     Connection.lock = false;
//                     const connection = await Connection( client );
//                     resolve( connection );
//                 }
//
//                 Connection.lock = true;
//                 resolve( Mongoose.connection );
//             } );
//         } );
//     }
//
//     (Mongoose.connection) || await Handler();
//
//     ( Mongoose.connection?.readyState !== 1 ) && Reflect.set( Connection, "lock", false );
//
//     return ( Connection.lock ) ? Mongoose.connection : Handler();
// };
//
// Connection.lock = false;
// Connection.data = Object.create( {} );
// Connection.options = Object.create( {} );

export default Context.Handler();

