import Package, { Remove } from ".";

describe("Git VCS Clone Command(s)", () => {
    describe( "Import", () => {
        it( "Clone", async () => {
            const Package = await import(".").then((Package) => Package.default);

            const { Clone } = Package;

            expect(Clone).toBeTruthy();
        } );
    } );

    describe( "Clone", () => {
        it( "Clones Repository (HTTPs)", async () => {
            const $ = await Package.Clone(String("https://github.com/standard-things/esm"), "testing/http");

            await Remove("testing/http");

            expect($).toBeTruthy();
        } );
    } );

    describe( "Clone", () => {
        it( "Clones Repository (SSH)", async () => {
            const $ = await Package.Clone(String("git@github.com:standard-things/esm.git"), "testing/ssh");

            await Remove("testing/ssh");

            expect($).toBeTruthy();
        } );
    } );
})

void (() => jest.setTimeout(10 * 1000))();
