import { Lambda } from "@aws-sdk/client-lambda";
import { InvokeCommand } from "@aws-sdk/client-lambda";

export function invokeLambdaAsync(functionName: string, payload: string) {    
    const lambda = new Lambda({ region: "us-east-1" });

    lambda.send(new InvokeCommand({
        FunctionName: functionName,
        Payload: Buffer.from(payload),
        InvocationType: "Event"
    }));
}