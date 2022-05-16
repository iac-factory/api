export * as Lambda from "./lambda";

void ( async () => {
    const debug = (process.argv.includes("--debug") && process.argv.includes("--aws-lambda"));

    const test = async () => {
        const { Lambda } = await import(".");

        const endpoints = await Lambda.Composition.Endpoints();

        console.log(Lambda.Inspect(endpoints));
    };

    (debug) && await test();
} )();
