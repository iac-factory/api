declare module "IaC.API.Schema.AWS" {
    import type * as AWS from "@aws-sdk/types";
    import type * as Lambda from "@aws-sdk/client-lambda";

    export type AWS = { [$ in keyof typeof AWS]: {$: typeof AWS[$]} };
    export type Lambda = { [property in keyof typeof Lambda]: typeof Lambda[property] };

    export interface SDK {
        AWS: typeof import("@aws-sdk/types");
        Lambda: typeof import("@aws-sdk/client-lambda");
    }
}