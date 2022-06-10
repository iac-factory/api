/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Octokit } from "@octokit/rest";

export type Headers = import("@octokit/types").RequestHeaders

const factory = process.env["GITHUB_ORGANIZATION_TOKEN"];

const Organization = new Octokit( {
    auth: factory,
    userAgent: process.env["GITHUB_ORGANIZATION_USER_AGENT"],
    baseUrl: process.env["GITHUB_ORGANIZATION_BASE_URL"]
} );

/*** Metadata, URL(s) regarding GitHub API Available Route(s) */

export module GH {
    export const Metadata = ( async () => {
        const response = await Organization.request( "/" );
        const {
            status,
            data
        } = response;

        return data;
    } )();

    export const Company = ( async () => {
        const response = await Organization.request( {
            method: "GET",
            url: "/orgs/{org}",
            org: process.env["GITHUB_ORGANIZATION_NAME"]
        } );

        const {
            status,
            data: {
                company,
                login,
                location,
                description,
                name,
                repos_url,
                url
            }
        } = response;

        const organization: Company | null = ( login ) ? {
            Name: name,
            Company: company,
            Login: login,
            Location: location,
            Description: description,
            Repositories: repos_url,
            Homepage: url
        } as const : null;

        return organization;
    } )();

    export const Creator = ( async () => {
        const response = await Organization.rest.orgs.getMembershipForUser( {
            org: process.env["GITHUB_ORGANIZATION_NAME"] as string,
            username: process.env["GITHUB_USERNAME"] as string
        } );

        const {
            status,
            data: {
                organization: { login: organization },
                role,
                state,
                user
            }
        } = response;

        const data: User | null = ( user ) ? {
            [ user.login ]: {
                Username: user.login,
                Organization: organization,
                Role: role,
                Status: state,
                URLs: {
                    Profile: user.html_url,
                    Gists: user.gists_url,
                    Organizations: user.organizations_url
                }
            }
        } as const : null;

        return data;
    } )();

    export const Members = ( async () => {
        const response = await Organization.rest.orgs.listMembers( {
            org: "iac-factory"
        } );

        const {
            status,
            data
        } = response;

        const users = data.map( (user) => {
            return {
                Username: user.login,
                URLs: {
                    Profile: user.html_url,
                    Gists: user.gists_url,
                    Organizations: user.organizations_url
                } as URLs
            };
        } );

        return users;
    } )();
}

export interface User {
    [ $: string ]: {
        readonly Username: string,
        readonly Organization: string,
        readonly Role: "admin" | "member" | "billing_manager",
        readonly Status: "active" | "pending",
        readonly URLs: { readonly Profile: string, readonly Gists: string, readonly Organizations: string }
    };
}

export type URLs = {
    readonly Profile: URL | string,
    readonly Gists: URL | string,
    readonly Organizations: URL | string
}

export type Company = { readonly Name?: string, readonly Company?: string, readonly Login?: string, readonly Location?: string, readonly Description?: string, readonly Repositories?: string, readonly Homepage?: string } | null

export default GH;

/*** Module Testing */
void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--github" ) );

    const test = async () => {
        const { GH } = await import(".");

        const creator = await GH.Creator;
        const company = await GH.Company;
        const members = await GH.Members;
        const metadata = await GH.Metadata;

        const data = { creator, company, members, metadata };

        console.log( data );
    };

    (debug) && await test();
} )();
