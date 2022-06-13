import Process from "process";
import winston, { Logger } from "winston";

const $ = await import("winston");

const { format } = winston;
const { combine, label, json } = format;

enum Categories {
    IaC = "IaC", "Front-End" = "Front-End"
}

const Container = new $.Container();

const Add = ( id: keyof typeof Categories, options?: winston.LoggerOptions ) => {
    const Logger = Container.add( id, options );

    Reflect.set(Logger, "identifier", id);
};

const get = ( id: keyof typeof Categories, options?: winston.LoggerOptions ) => {
    return Container.get( id, options );
};

//
// Configure the logger for `category1`
//
Add( Categories.IaC, {
    format: combine( label( { label: "category one" } ), json() ), transports: [ new winston.transports.Console( { level: "silly" } ), new winston.transports.File( { filename: "somefile.log" } ) ]
} );

//
// Configure the logger for `category2`
//

if (process.env.NODE_ENV !== 'production') {
    Container.add("default", new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

Add( "Front-End", {
    format: combine( label( { label: "category two" } ), json() ), transports: [ new winston.transports.Http( { host: "localhost", port: 8080 } ) ]
} );

get( "Front-End" ).debug( "Hello wolrd" );

const IaC: Logger = get( "IaC" );
const FE: Logger = get( "Front-End" );

IaC.info( "Hello World" );

Process.on("beforeExit", () => {
    Container.loggers.forEach(($) => {
        $.end(() => {
            console.log("Successfully Closed Log-Stream" + ":", Reflect.get($, "identifier"));
        });
    });
})

Process.on( "exit", () => {
    console.log("Exiting ...");
} );

