export const Await = typeof setImmediate === "function"
    ? setImmediate
    : (callable: any, error: any) => {
        process.nextTick(
            callable.bind.apply(
                callable, callable.arguments
            )
        );
    };


export default Await;