import * as FS      from "fs";
import * as Path    from "path";
import * as Utility from "util";

function Remap(location?: string, file?: ( FS.Stats | FS.Dirent ) & { name?: string }, destination?: string): Descriptor {
    const canonical = ( location || file ) ? Path.resolve( location!, file!.name! ) : Path.resolve( location! );

    return {
        name: Path.basename( canonical ),
        path: canonical,
        destination: destination ?? null,
        properties: {
            file: file?.isFile() ?? false,
            directory: file?.isDirectory() ?? false,
            socket: file?.isSocket() ?? false,
            symbolic: file?.isSymbolicLink() ?? false
        }
    };
}

export const Read = (source: string, collection: Descriptor[], debug = false) => {
    const descriptors = FS.readdirSync( source, { withFileTypes: true });

    for (const descriptor of descriptors) {
        const Directory = descriptor?.isDirectory() || false;

        const Link = descriptor?.isSymbolicLink() || false;
        const Socket = descriptor?.isSocket() || false;
        const File = descriptor?.isFile() || false;

        ( Directory ) && console.log( "[Debug] [Read] Directory", descriptor.name );
        ( Directory ) && collection.push( Remap( source, descriptor ) );
        ( Directory ) && Read( Path.join( source, descriptor.name ), collection, debug );

        ( Socket ) && console.log( "[Debug] [Read] Socket", descriptor.name );
        ( Socket ) && collection.push( Remap( source, descriptor ) );

        ( Link ) && console.log( "[Debug] [Read] Symbolic Link", descriptor.name );
        ( Link ) && collection.push( Remap( source, descriptor ) );

        ( File ) && console.log( "[Debug] [Read] File", descriptor.name );
        ( File ) && collection.push( Remap( source, descriptor ) );
    }
};

export const Statistics = async (descriptor: string) => {
    return new Promise<( FS.Stats | FS.Dirent )>( (resolve) => {
        FS.stat( descriptor, (exception, statistics) => {
            if ( exception ) throw exception;
            resolve( statistics );
        } );
    } );
};

export const Copy = async (source: string, target: string, singleton: boolean = false, debug = false) => {
    const clone = Utility.promisify( FS.copyFile );
    const mkdir = Utility.promisify( FS.mkdir );

    try {
        ( singleton ) || await mkdir( target, { recursive: true } );
    } catch ( exception ) {}

    ( singleton ) && FS.copyFileSync( source, target );

    ( singleton ) || FS.readdir( source, { withFileTypes: true }, (exception, files) => {
        if ( exception ) throw exception;
        for ( const element of files ) {
            const Directory = element?.isDirectory() || false;
            const File = element?.isFile() || false;

            ( Directory ) && console.log( "[Debug] [Copy] Directory", element.name );
            ( Directory ) && Copy( Path.join( source, element.name ), Path.join( target, element.name ), singleton, debug );

            ( File ) && console.log( "[Debug] [Copy] File", element.name );
            try {
                ( File ) && FS.copyFileSync( Path.join( source, element.name ), Path.join( target, element.name ) );
            } catch ( exception ) {
                // ...
            }
        }
    } );
};

export type Property = {
    readonly file: boolean,
    readonly directory: boolean,
    readonly socket: boolean,
    readonly symbolic: boolean
};

export type Descriptor = {
    readonly name: string,
    readonly path: string,
    readonly properties: Property,
    readonly destination: string | null
};

const read = () => {
    const descriptors: any[] = [];

    Read( "build", descriptors, true );

    FS.writeFileSync("file-descriptors.json", JSON.stringify(descriptors, null, 4));

    return 0;
};

(async () => read())();

