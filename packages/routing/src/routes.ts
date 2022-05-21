/*** Route Imports via Importable Side-Effects */

export default void ( async () => {
    const Routing = [
        import("./test").then((route) => console.log(route)),
        import("./schema").then((route) => console.log(route)),
        import("./schema/typescript").then((route) => console.log(route)),
        import("./utility").then((route) => console.log(route)),
        import("./utility/health").then((route) => console.log(route)),
        import("./utility/awaitable").then((route) => console.log(route)),
        import("./aws/lambda").then((route) => console.log(route)),
        import("./aws/lambda/functions").then((route) => console.log(route)),
        import("./aws/lambda/functions/filter").then((route) => console.log(route)),
        import("./aws/lambda/functions/filter/environment-variables").then((route) => console.log(route))
    ];

    return Promise.allSettled(Routing);

} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.