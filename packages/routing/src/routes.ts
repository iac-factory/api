import { Debugger } from "@iac-factory/api-core";

const Logger = Debugger.hydrate( {
    namespace: [ "Routing", "magenta" ],
    module: [ "Routing", "red" ],
    level: [ "Warning", "cyan" ],
    depth: [ 1, true ]
} );

import { Router } from ".";

/*** Route Imports via Importable Side-Effects */
export default void ( async () => {
    const Routing = [
        import("./schema").then( (route) => {
            Logger.debug( route.default, "Schema" );
            Router.use( route.default );
        } ),
        import("./schema/typescript").then( (route) => {
            Logger.debug( route.default, "Schema (Typescript)" );
            Router.use( route.default );
        } ),
        import("./utility").then( (route) => {
            Logger.debug( route.default, "Utility" );
            Router.use( route.default );
        } ),
        import("./utility/health").then( (route) => {
            Logger.debug( route.default, "Utility (Schema)" );
            Router.use( route.default );
        } ),
        import("./utility/awaitable").then( (route) => {
            Logger.debug( route.default, "Schema" );
            Router.use( route.default );
        } ),
        import("./aws").then( (route) => {
            Logger.debug( route.default, "AWS " );
            Router.use( route.default );
        } ),
        import("./aws/lambda").then( (route) => {
            Logger.debug( route.default, "AWS (Lambda)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions").then( (route) => {
            Logger.debug( route.default, "AWS (Lambda) (Functions)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter").then( (route) => {
            Logger.debug( route.default, "AWS (Lambda) (Functions) (() => Filter)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter/environment-variables").then( (route) => {
            Logger.debug( route.default, "AWS (Lambda) (Functions) (() => Environment-Variables)" );
            Router.use( route.default );
        } )
    ];

    return Promise.allSettled( Routing );

} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.