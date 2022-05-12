describe("File System Copy Command(s)", () => {
    describe( "Import", () => {
        it( "Copy", async () => {
            const Package = await import(".");

            const { Clone } = Package;

            expect(Clone).toBeTruthy();
        } );
    } );

    describe( "Copy Relative File", () => {
        it.todo("Copies Relative File into Relative Folder");
    } );

    describe( "Copy Arbitrary File", () => {
        it.todo("Copies Arbitrarily Located File into Relative Folder");
    } );

    describe( "Copy Arbitrary File into Nested Folder", () => {
        it.todo("Copies Arbitrarily Located File into Nested Folder");
    } );
});

void (() => jest.setTimeout(10 * 1000))();
