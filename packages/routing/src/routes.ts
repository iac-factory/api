/*** Route Imports via Importable Side-Effects */

export default void ( async () => {
    await import("./test");
    await import("./utility");
    await import("./utility/health");
    await import("./utility/awaitable");
    await import("./aws/lambda");
    await import("./aws/lambda/functions");
    await import("./aws/lambda/functions/filter");
} )();

/// If the route is imported, the side-effect is mutation to the router prototype
/// which adds the route to the router itself.