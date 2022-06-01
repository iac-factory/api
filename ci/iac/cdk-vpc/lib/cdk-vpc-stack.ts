import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

import * as S3 from "aws-cdk-lib/aws-s3";
import * as EC2 from "aws-cdk-lib/aws-ec2";

export class VPC extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super( scope, id, props );

        const bucket = new S3.Bucket( this, "aws-ec2-vpc-s3-flow-log-bucket", {
            bucketName: "test-cdk-vpc-flow-log-bucket",
            encryption: S3.BucketEncryption.S3_MANAGED,
            versioned: true
        } );

        const vpc = new EC2.Vpc( this, "aws-ec2-vpc", {
            cidr: EC2.Vpc.DEFAULT_CIDR_RANGE,
            vpcName: "Test-CDK-VPC",
            /*** Indicates whether the instances launched in the VPC get public DNS hostnames. */
            enableDnsHostnames: false,
            /*** Indicates whether the DNS resolution is supported for the VPC. */
            enableDnsSupport: true,
            natGateways: 1,
            subnetConfiguration: [
                {
                    cidrMask: 24,
                    name: "Ingress",
                    subnetType: EC2.SubnetType.PUBLIC
                },
                {
                    cidrMask: 24,
                    name: "Application",
                    subnetType: EC2.SubnetType.PRIVATE_WITH_NAT
                },
                {
                    cidrMask: 28,
                    name: "RDS",
                    subnetType: EC2.SubnetType.PRIVATE_ISOLATED
                }
            ]

        } );

        const flow = vpc.addFlowLog( "vpc-flow-logs", {
            destination: EC2.FlowLogDestination.toS3( bucket, "VPC-Logs" )
        } );
    }
}

export default VPC;
