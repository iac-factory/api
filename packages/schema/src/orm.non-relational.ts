declare module "IaC.API.Schema.ORM.Document-DB" {
    import type * as ORM from "mongoose";

    import type { Model } from "mongoose";

    export module Schema {
        export type schema = ORM.Schema;
        export type options = ORM.SchemaOptions;
    }

    export type { Model };
}
