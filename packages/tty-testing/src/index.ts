const Main = async () => {
    const repository = "https://github.com/iac-factory/tty-testing.git";

    void await ( async () => new Promise( async (resolve, reject) => {
        console.clear();

        const { Interactive } = await import("./clone");
        const { Wrapper } = await import("./clone");
        const { Execute } = await import("./clone");
        const { Spawn } = await import("./clone");
        const { Shell } = await import("./clone");

        const { Remove } = await import("./remove");

        const state = { error: false, exception: {}, results: { spawn: false, exec: false, shell: false, execFile: false, interactive: false } };

        try {
            await Spawn(repository, "test");
            state.results.spawn = true;

            await Execute(repository, "test");
            state.results.execFile = true;

            await Wrapper(repository, "test");
            state.results.exec = true;

            await Shell(repository, "test");
            state.results.shell = true;

            await Interactive(repository, "test");
            state.results.interactive = true;
        } catch (error) {
            state.error = true;

            Reflect.set(state, "exception", error);
        } finally {
            console.debug("[Debug] Cleaning Testing Directory ...");

            await Remove("test");
        }

        console.log(state.results);

        (state.error) && reject(state.exception);
        (state.error) || resolve(true);
    } ) )();
};

void (async () => Main())();

export default Main;

export { Main };