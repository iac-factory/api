import Input from "../auto.tfvars.json";

const TF = { ... Input, token: undefined };

export * as CDKTF from "cdktf";

export default TF;

export { App as Application } from "cdktf";
export { LocalBackend as Backend } from "cdktf";
export { TerraformStack as Stack } from "cdktf";
export { TerraformVariable as Variable } from "cdktf";
export { VariableType as Type } from "cdktf";
export { TerraformOutput as Output } from "cdktf";
