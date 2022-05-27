import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Routing", "red" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

import { Router } from ".";

/*** Route Imports via Importable Side-Effects */
export default void ( async () => {
    const Routing = [
        import("./schema").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./schema/typescript").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./utility").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./utility/health").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./utility/health/postgresql").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./utility/health/document-db").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./utility/awaitable").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./login").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./aws").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./aws/lambda").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } ),
        import("./aws/lambda/functions/filter/environment-variables").then( (route) => {
            Logger.debug( route.default.registry );
            Router.use( route.default );
        } )
    ];

    return Promise.allSettled( Routing );

} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.
