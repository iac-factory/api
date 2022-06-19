import * as CDK from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { VPC } from "../lib/cdk-vpc-stack";

test( "CDK Stack Template", () => {
    const application = new CDK.App();
    /// ---> When ...
    const stack = new VPC( application, "Test-VPC-Stack" );
    /// ---> Then ...
    const template = Template.fromStack( stack );

    /// template.hasResourceProperties( "AWS::SQS::Queue", {
    ///     VisibilityTimeout: 300
    /// } );
} );
