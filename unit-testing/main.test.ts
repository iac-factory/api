/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

describe( "Import", () => {
    it( "Services", async () => {
        const Main = await import("@iac-factory/api-services");

        expect( Main ).toBeTruthy();
    } );
} );

describe( "Import", () => {
    it( "Middleware", async () => {
        const Main = await import("@iac-factory/api-middleware");

        expect( Main ).toBeTruthy();
    } );
} );

describe( "Import", () => {
    it( "Middleware", async () => {
        const Main = await import("@iac-factory/api-database");

        expect( Main ).toBeTruthy();
    } );
} );

describe( "Import", () => {
    it( "Schema", async () => {
        const Main = await import("@iac-factory/api-schema");

        expect( Main ).toBeTruthy();
    } );
} );

void ( () => jest.setTimeout( 10 * 1000 ) )();
