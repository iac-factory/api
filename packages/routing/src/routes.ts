import { Debugger } from "@iac-factory/api-core";

/*** Route Imports via Importable Side-Effects */

const Logger = Debugger.hydrate( {
    namespace: ["Routing", "magenta"],
    module: ["Routing", "magenta"],
    level: ["Debug", "cyan"],
    depth: [ 1, true ]
});

export default void ( async () => {
    const Routing = [
        import("./schema").then( (route) => {
            Logger.debug( route.default );
        } )
        // import("./schema/typescript").then((route) => console.log(route.Router)),
        // import("./utility").then((route) => console.log(route.Router)),
        // import("./utility/health").then((route) => console.log(route.Router)),
        // import("./utility/awaitable").then((route) => console.log(route.Router)),
        // import("./aws/lambda").then((route) => console.log(route.Router)),
        // import("./aws/lambda/functions").then((route) => console.log(route.Router)),
        // import("./aws/lambda/functions/filter").then((route) => console.log(route.Router)),
        // import("./aws/lambda/functions/filter/environment-variables").then((route) => console.log(route.Router))
    ];

    return Promise.allSettled( Routing );

} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.