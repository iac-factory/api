import CLI from "./cli";

const Main = async () => {
    void await ( async () => new Promise( async (resolve) => {
        process.stdout.write( "Importing Dependencies ..." + "\n" );

        const { Execute } = await import("./clone");
        const { Spawn } = await import("./clone");

        (CLI.evaluation === "spawn" ) ? await Spawn("https://github.com/iac-factory/git-clone.git")
            : await Execute("https://github.com/iac-factory/git-clone.git");

        resolve(true);
    } ) )();
};

void (async () => Main())();

export default Main;

export { Main };
