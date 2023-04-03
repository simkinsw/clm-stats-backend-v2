import { singleton } from "tsyringe";
import { AttributeValue, BatchGetItemCommand, BatchWriteItemCommand, DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

@singleton()
export class DocumentClient {

    documentClient = new DynamoDBClient({
        region: "us-east-1"
    });

    MARSHALL_OPTIONS = {
        convertEmptyValues: true,
        removeUndefinedValues: true,
        convertClassInstanceToMap: true
    }

    /*
    async batchGet<T>(keys: Record<string, any>[], tableName: string) {
        const batchesNumber = Math.ceil(keys.length / 100);
        await Promise.all(
            Array.from({ length: batchesNumber }, (_, i) => i).map(
                async (batchIndex) => {
                    const batchKeys = keys.slice(
                        100 * batchIndex,
                        100 * (batchIndex + 1)
                    ).map(key => marshall(key, this.MARSHALL_OPTIONS));

                    await this.documentClient
                        .send(new BatchGetItemCommand({
                            RequestItems: {
                                [tableName]: batchKeys.map((Item) => ({
                                    PutRequest: {
                                        Item
                                    },
                                })),
                            }
                        }))
                }
            )
        );
    }
    */

    async batchInsert<T>(items: T[], tableName: string) {
        const itemsBatchesNumber = Math.ceil(items.length / 25);
        await Promise.all(
            Array.from({ length: itemsBatchesNumber }, (_, i) => i).map(
                async (batchIndex) => {
                    const batchItems = items.slice(
                        25 * batchIndex,
                        25 * (batchIndex + 1)
                    ).map(item => marshall(item, this.MARSHALL_OPTIONS));

                    await this.documentClient
                        .send(new BatchWriteItemCommand({
                            RequestItems: {
                                [tableName]: batchItems.map((Item) => ({
                                    PutRequest: {
                                        Item
                                    },
                                })),
                            }
                        }))
                }
            )
        );
    }

    async transact(items: any[]) {
        const itemsBatchesNumber = Math.ceil(items.length / 100);
        await Promise.all(
            Array.from({ length: itemsBatchesNumber }, (_, i) => i).map(
                async (batchIndex) => {
                    const batchItems = items.slice(
                        100 * batchIndex,
                        100 * (batchIndex + 1)
                    );

                    await this.documentClient
                        .send(new TransactWriteItemsCommand({
                            TransactItems: batchItems
                        }))
                }
            )
        );
    }
}

