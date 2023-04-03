import { SSM } from "@aws-sdk/client-ssm";

export async function getSSMSecret(secretName: string) {
    const ssm = new SSM({ region: "us-east-1" });
    const secureString = await ssm.getParameter({
        Name: secretName,
        WithDecryption: true
    });
    return secureString.Parameter?.Value;
}