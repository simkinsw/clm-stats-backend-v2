import { singleton } from "tsyringe";
import { AnyBulkWriteOperation, MongoClient, ServerApiVersion } from "mongodb";

interface ObjectWithID {
    id: string;
    [x: string | number | symbol]: unknown;
}

@singleton()
export class MongoDBClient {

    static URI = "mongodb+srv://wsimkins2013:<password>@clmstatscluster.a2xcns9.mongodb.net/?retryWrites=true&w=majority"; //TODO: put this someplace else?
    client: MongoClient;

    constructor() {
        this.client = new MongoClient(MongoDBClient.URI, {
            serverApi: {
              version: ServerApiVersion.v1,
              strict: true,
              deprecationErrors: true,
            }
        });
    }

    
    async batchUpsert(items: ObjectWithID[], tableName: string) {
        const database = this.client.db("ClmStatsCluster");
        const table = database.collection<ObjectWithID>(tableName);

        const upserts = items.map(item => {
            return {
                updateOne: {
                    filter: { id: item.id },
                    update: item,
                    upsert: true
                }
            }
        });

        return await table.bulkWrite(upserts);
    }

    async bulkUpdate(operations: AnyBulkWriteOperation[], tableName: string) {
        const database = this.client.db("ClmStatsCluster");
        const table = database.collection(tableName);

        return await table.bulkWrite(operations);
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

    /*
    async transact(items: any[]) {
       
    }
    */
}

