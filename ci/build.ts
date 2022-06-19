#!/usr/bin/ts-node

import * as Subprocess from "child_process";
import * as Utilities  from "./utilities";
import * as FS         from "fs";
import * as Path       from "path";

const System = Object.create( { target: ".", package: {}, build: {} } );

const configuration = async () => {
    const walker = async (target: string) => {
        for await ( const descriptor of await Utilities.Directory.Reader( target ) ?? [] ) {
            if ( descriptor.file.isFile() && descriptor.file.name === "package.json" ) {
                const directory = Path.dirname( String( descriptor ) );
                const file = Path.join( directory, "package.json" );

                System.package = file;

                const definition = FS.readFileSync( file, "utf-8" );
                const serial = JSON.parse( definition );

                System.target = directory;
                System.package = serial;

                break;
            }
        }

        if ( !( System.package?.config ) || !( System.package?.config?.cdktf ) ) {
            await walker( System.target );
        } else {
            const valid = true;
            const target = System.target;
            const configuration = System.package.config;
            const distribution = Path.join( System.target, System?.package?.config?.ci ) ?? null;

            const dotenv = await Utilities.File.Exists( Path.join( System.target, ".env" ) );

            System.build = { valid, target, configuration, distribution, dotenv };
        }
    };

    await walker( System.target );

    return System;
};

const copy = async () => {
    const settings = await configuration();

    const { distribution } = settings[ "build" ];

    Subprocess.execSync( "npm install", {
        cwd: Path.dirname( distribution ),
        encoding: "utf-8",
        stdio: "inherit"
    } );

    Subprocess.execSync( "tsc --build tsconfig.json", {
        cwd: Path.dirname( distribution ),
        encoding: "utf-8",
        stdio: "inherit"
    } );

    await Utilities.Copy( distribution, Path.join( process.cwd(), "build" ), false, true );
    await Utilities.Copy( Path.join( Path.dirname( distribution ), ".env" ), Path.join( process.cwd(), "build", ".env" ), true, true );

    return 0;
};

( async () => copy() )();
