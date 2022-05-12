describe( "File System Deletion Command(s)", function () {
    describe( "Import", () => {
        it( "Remove", async () => {
            const Package = await import(".");

            const { Remove } = Package;

            expect(Remove).toBeTruthy();
        } );
    } );

    describe( "Remove Relative File", () => {
        it.todo( "Removes Relative File from Relative Folder" );
    } );

    describe( "Remove Arbitrary File", () => {
        it.todo( "Removes Arbitrarily Located File from Relative Folder" );
    } );

    describe( "Remove Arbitrary File from Nested Folder", () => {
        it.todo( "Removes Arbitrarily Located File from Nested Folder" );
    } );

    describe( "Remove Relative Folder", () => {
        it.todo( "Removes Relative Folder from Relative Path" );
    } );

    describe( "Remove Arbitrary Folder", () => {
        it.todo( "Removes Arbitrarily Located Folder from Relative Path" );
    } );

    describe( "Remove Arbitrary Folder from Nested Folder", () => {
        it.todo( "Removes Arbitrarily Located Folder from Nested Folder" );
    } );

    describe( "Remove Recursive Folder", () => {
        it.todo( "Removes Arbitrarily Nested Folder(s)" );
    } );
} );

void (() => jest.setTimeout(10 * 1000))();
