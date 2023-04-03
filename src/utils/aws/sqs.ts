import {
    DeleteMessageBatchRequestEntry,
    ReceiveMessageCommand,
    SQSClient,
    DeleteMessageBatchCommand,
} from "@aws-sdk/client-sqs";

const sqs = new SQSClient({ region: "us-east-1" });

export async function pollQueue(queueUrl: string) {
    console.log("polling " + queueUrl);
    const messages = await sqs.send(
        new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 5,
            WaitTimeSeconds: 5,
        })
    );

    return messages.Messages;
}

export async function batchDeleteMessages(
    queueUrl: string,
    messages: DeleteMessageBatchRequestEntry[]
) {
    await sqs.send(
        new DeleteMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: messages,
        })
    );
}
