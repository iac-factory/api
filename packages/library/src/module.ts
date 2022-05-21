/*** Router Prototype Reflection */
export default void ( async () => {
    const Reflections = [
        import("./handle"),
        import("./parameter"),
        import("./process"),
        import("./use")
    ];

    return Promise.allSettled(Reflections);
} )();