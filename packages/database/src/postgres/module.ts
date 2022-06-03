/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

/***
 * node-postgres uses the same environment variables as libpq to connect to a PostgreSQL server.
 * Both individual clients & pools will use these environment variables. Here's a tiny program
 * connecting node.js to the PostgreSQL server:
 *
 * PGHOST behaves the same as the host connection parameter.
 * PGHOSTADDR behaves the same as the hostaddr connection parameter. This can be set instead of or in addition to PGHOST to avoid DNS lookup overhead.
 * PGPORT behaves the same as the port connection parameter.
 * PGDATABASE behaves the same as the dbname connection parameter.
 * PGUSER behaves the same as the user connection parameter.
 * PGPASSWORD behaves the same as the password connection parameter. Use of this environment variable is not recommended for security reasons, as some operating systems allow non-root users to see process environment variables via ps; instead consider using the ~/.pgpass file (see Section 31.14).
 * PGPASSFILE specifies the name of the password file to use for lookups. If not set, it defaults to ~/.pgpass (see Section 31.14).
 * PGSERVICE behaves the same as the service connection parameter.
 * PGSERVICEFILE specifies the name of the per-user connection service file. If not set, it defaults to ~/.pg_service.conf (see Section 31.15).
 * PGREALM sets the Kerberos realm to use with PostgreSQL, if it is different from the local realm. If PGREALM is set, libpq applications will attempt authentication with servers for this realm and use separate ticket files to avoid conflicts with local ticket files. This environment variable is only used if Kerberos authentication is selected by the server.
 * PGOPTIONS behaves the same as the options connection parameter.
 * PGAPPNAME behaves the same as the application_name connection parameter.
 * PGSSLMODE behaves the same as the sslmode connection parameter.
 * PGREQUIRESSL behaves the same as the requiressl connection parameter.
 * PGSSLCERT behaves the same as the sslcert connection parameter.
 * PGSSLKEY behaves the same as the sslkey connection parameter.
 * PGSSLROOTCERT behaves the same as the sslrootcert connection parameter.
 * PGSSLCRL behaves the same as the sslcrl connection parameter.
 * PGREQUIREPEER behaves the same as the requirepeer connection parameter.
 * PGKRBSRVNAME behaves the same as the krbsrvname connection parameter.
 * PGGSSLIB behaves the same as the gsslib connection parameter.
 * PGCONNECT_TIMEOUT behaves the same as the connect_timeout connection parameter.
 * PGCLIENTENCODING behaves the same as the client_encoding connection parameter.
 * The following environment variables can be used to specify default behavior for each PostgreSQL session. (See also the ALTER ROLE and ALTER DATABASE commands for ways to set default behavior on a per-user or per-database basis.)
 * PGDATESTYLE sets the default style of date/time representation. (Equivalent to SET datestyle TO ....)
 * PGTZ sets the default time zone. (Equivalent to SET timezone TO ....)
 * PGGEQO sets the default mode for the genetic query optimizer. (Equivalent to SET geqo TO ....)
 *
 */

import type { QueryResult, PoolClient } from "pg";
import { Pool, QueryResultRow } from "pg";

import { Debugger } from "@iac-factory/api-core";

export module PG {
    const Connection = new Pool( {
        password: process.env[ "POSTGRES_PASSWORD" ],
        user: process.env[ "POSTGRES_USER" ],
        database: process.env[ "POSTGRES_DB" ],
        application_name: process.env[ "SERVER" ],
        keepAlive: process.env[ "POSTGRES_CONNECTION_KEEPALIVE" ] === "true"
    } );

    export const Query = async function (input: string, parameters?: any) {
        const logger = Debugger.hydrate( {
            module: [ "PostgreSQL", "blue" ],
            level: [ "Debug", "cyan" ],
            depth: [ 1, true ]
        } );

        const initial = new Date().getTime();

        const response = await Connection.query( input, parameters );

        const delta = ( new Date().getTime() - initial ) / 1000;

        logger.debug( "Query Duration" + ":" + " " + delta + " " + "Second(s)" );

        return response;
    };

    export const Interface = async function () {
        const logger = Debugger.hydrate( {
            module: [ "PostgreSQL", "blue" ],
            level: [ "Debug", "cyan" ],
            depth: [ 1, true ]
        } );

        const client = await Connection.connect() as PoolClient & { lastQuery: any, query: any };
        const query: typeof client.query = client.query;
        const release: typeof client.release = client.release;

        // Establish a timeout of 5 seconds, after which the client's last query is logged
        const timeout = setTimeout( () => {
            logger.error( "Client Query Timeout ( Greater than 5 Second(s) )" );
            logger.error( "The last executed query was" + " " + client.lastQuery );
        }, 5000 );

        // Monkey patch the query method to keep track of the last query executed
        client.query = (... args: [ queryText: string, values: any[], callback: (err: Error, result: QueryResult<QueryResultRow>) => void ]) => {
            client.lastQuery = args;
            return query.apply( client, args );
        };

        client.release = () => {
            clearTimeout( timeout );

            // set the methods back to their old un-monkey-patched version
            client.query = query;
            client.release = release;
            return release.apply( client );
        };

        return client;
    };

    export const Version = async function () {
        return await Query( "SELECT version();" )
            .then( (output) => {
                return output.rows[ 0 ];
            } );
    };

    export const Health = async function () {
        return !!( await Version() );
    };
}

export interface Configuration {
    /*** Name of host to connect to. If this begins with a slash, it specifies Unix-domain communication rather than TCP/IP communication; the value is the name of the directory in which the socket file is stored. The default behavior when host is not specified is to connect to a Unix-domain socket in /tmp (or whatever socket directory was specified when PostgreSQL was built). On machines without Unix-domain sockets, the default is to connect to localhost. */
    host: string;

    /*** Numeric IP address of host to connect to. This should be in the standard IPv4 address format, e.g., 172.28.40.9. If your machine supports IPv6, you can also use those addresses. TCP/IP communication is always used when a nonempty string is specified for this parameter. */
    hostaddr: string;

    /*** Port number to connect to at the server host, or socket file name extension for Unix-domain connections. */
    port: number;

    /*** PostgreSQL user name to connect as. Defaults to be the same as the operating system name of the user running the application. */
    user: string;

    /*** Password to be used if the server demands password authentication. */
    password: string;

    /*** Maximum wait for connection, in seconds (write as a decimal integer string). Zero or not specified means wait indefinitely. It is not recommended to use a timeout of less than 2 seconds. */
    connect_timeout: number;

    /*** Specifies a value for the {@link https://www.postgresql.org/docs/9.1/runtime-config-logging.html#GUC-APPLICATION-NAME application_name} configuration parameter. */
    application_name?: string;
}

export default PG;
