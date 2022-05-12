describe( "File System Move Command(s)", function () {
    describe( "Import", () => {
        it( "Move", async () => {
            const Package = await import(".");

            const { Move } = Package;

            expect(Move).toBeTruthy();
        } );
    } );

    describe( "Move Relative File", () => {
        it.todo("Moves Relative File into Relative Folder");
    } );

    describe( "Move Arbitrary File", () => {
        it.todo("Moves Arbitrarily Located File into Relative Folder");
    } );

    describe( "Move Arbitrary File into Nested Folder", () => {
        it.todo("Moves Arbitrarily Located File into Nested Folder");
    } );
} );

void (() => jest.setTimeout(10 * 1000))();
