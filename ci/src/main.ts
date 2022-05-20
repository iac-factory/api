import * as Provider from "@cdktf/provider-github";

import { Construct } from "constructs";

import { Application, Output } from "./cdk";
import { Variable } from "./cdk";
import { Backend } from "./cdk";
import { Stack } from "./cdk";

import Input from "./cdk";

class Instance extends Stack {
    constructor(scope: Construct, name: string = "cli-utilities") {
        super( scope, name );

        new Backend( this, { path: "terraform.state.json" } );

        /*** {@link https://cdk.tf/variables CDKTF-Variables} */
        const owner = new Variable( this, "owner", {
            default: Input.owner,
            type: "string"
        } );

        const license = new Variable( this, "license", {
            default: Input.license,
            type: "string"
        } );

        const archive = new Variable( this, "archive", {
            default: Input.archive,
            type: "bool"
        } );

        const template = new Variable( this, "template", {
            default: Input.template,
            type: "any"
        } );

        const topics = new Variable( this, "topics", {
            default: Input.topics,
            type: "list(string)"
        } );

        const username = new Variable( this, "username", {
            default: Input.username,
            type: "string"
        } );

        /// Snapshot Tracking !== const token = new Variable( this, "token", { sensitive: true, type: "string", default: Input.token } );

        new Provider.GithubProvider( this, "github", {
            owner: owner.value,
            token: /*** token.value */ Input.token
        } );

        const user = new Provider.DataGithubUser( this, "creator", {
            username: username.value
        } );

        const resource = new Provider.Repository( this, "repository", {
            allowAutoMerge: false,
            allowMergeCommit: false,
            allowRebaseMerge: false,
            allowSquashMerge: true,
            archiveOnDestroy: archive.value,
            archived: false,
            autoInit: true,
            deleteBranchOnMerge: true,
            template: ( template.value.length > 0 ) ? new class {
                owner: string;
                repository: string;

                constructor() {
                    this.owner = owner.value;
                    this.repository = template.value;
                }
            } : undefined,
            gitignoreTemplate: "Node",
            hasDownloads: false,
            hasIssues: true,
            hasProjects: false,
            hasWiki: true,
            homepageUrl: [ "https:/", Input.hostname, owner.value, name ].join( "/" ),
            ignoreVulnerabilityAlertsDuringRead: true,
            isTemplate: false,
            licenseTemplate: license.value,
            name: name,
            topics: topics.value,
            visibility: "public",
            vulnerabilityAlerts: true
        } );

        const branch = new Provider.BranchDefault( this, "branch", {
            branch: Input.branch,
            repository: resource.name
        } );

        const protections = new Provider.BranchProtection( this, "protection", {
            allowsDeletions: true,
            enforceAdmins: false,
            pattern: branch.branch,
            pushRestrictions: [ user.nodeId ],
            requiredLinearHistory: false,
            allowsForcePushes: true,
            requireConversationResolution: false,
            requireSignedCommits: false,
            repositoryId: resource.nodeId,
            requiredPullRequestReviews: [
                {
                    dismissStaleReviews: true,
                    dismissalRestrictions: [],
                    restrictDismissals: true
                }
            ],
            requiredStatusChecks: [
                {
                    strict: false,
                    contexts: []
                }
            ]
        } );

        new Output( this, "input-organization-variable", {
            value: owner.toString(),
            description: owner.description,
            sensitive: owner.sensitive
        } );

        new Output( this, "input-license-variable", {
            value: license.toString(),
            description: license.description,
            sensitive: license.sensitive
        } );

        new Output( this, "input-archive-variable", {
            value: archive.toString(),
            description: archive.description,
            sensitive: archive.sensitive
        } );

        new Output( this, "input-template-variable", {
            value: template.toString(),
            description: template.description,
            sensitive: template.sensitive
        } );

        new Output( this, "input-topics-variable", {
            value: topics.toString(),
            description: topics.description,
            sensitive: topics.sensitive
        } );

        new Output( this, "input-username-variable", {
            value: username.toString(),
            description: username.description,
            sensitive: username.sensitive
        } );

        new Output( this, "data-user", {
            value: user.toString()
        } );

        new Output( this, "resource-repository-output", {
            value: resource.toString()
        } );

        new Output( this, "resource-branch-output", {
            value: branch.toString()
        } );

        new Output( this, "resource-branch-protections-output", {
            value: protections.toString()
        } );
    }
}

const compile = () => {
    const application = new Application( {
        stackTraces: true,
        outdir: "output"
    } );

    new Instance( application );

    application.synth();
};

export { Input };
export { Provider };
export { Instance };
export { Application };

void compile();
