import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Routing", "magenta" ],
    module: [ "Routing", "red" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

import { Router } from ".";

/*** Route Imports via Importable Side-Effects */
export default void ( async () => {
    const Routing = [
        import("./schema").then( (route) => {
            Logger.debug(route.default.registry, "Schema" );
            Router.use( route.default );
        } ),
        import("./schema/typescript").then( (route) => {
            Logger.debug(route.default.registry, "Schema (Typescript)" );
            Router.use( route.default );
        } ),
        import("./utility").then( (route) => {
            Logger.debug(route.default.registry, "Utility" );
            Router.use( route.default );
        } ),
        import("./utility/health").then( (route) => {
            Logger.debug(route.default.registry, "Utility (Schema)" );
            Router.use( route.default );
        } ),
        import("./utility/awaitable").then( (route) => {
            Logger.debug(route.default.registry, "Utility (Awaitable)" );
            Router.use( route.default );
        } ),
        import("./aws").then( (route) => {
            Logger.debug(route.default.registry, "AWS" );
            Router.use( route.default );
        } ),
        import("./aws/lambda").then( (route) => {
            Logger.debug(route.default.registry, "AWS (Lambda)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions").then( (route) => {
            Logger.debug(route.default.registry, "AWS (Lambda) (Functions)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter").then( (route) => {
            Logger.debug(route.default.registry, "AWS (Lambda) (Functions) (Filter)" );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter/environment-variables").then( (route) => {
            Logger.debug(route.default.registry, "AWS (Lambda) (Functions) (Variables)" );
            Router.use( route.default );
        } )
    ];

    return Promise.allSettled( Routing );

} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.