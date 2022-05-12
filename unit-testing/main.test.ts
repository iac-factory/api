describe( "Import", () => {
    it( "Main", async () => {
        const Main = await import(".");

        expect(Main).toBeTruthy();
    } );
} );

void (() => jest.setTimeout(10 * 1000))();
