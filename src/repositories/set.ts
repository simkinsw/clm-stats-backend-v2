import { singleton } from "tsyringe";
import { TourneySet } from "../models/tourneySet";
import { DocumentClient } from "../utils/aws/dynamodb";

@singleton()
export class SetRepository {
    tableName: string;
    documentClient: DocumentClient;

    constructor(documentClient: DocumentClient) {
        this.tableName = process.env.SET_TABLE!
        this.documentClient = documentClient
    }

    async batchInsert(events: TourneySet[]) {
        try {
            await this.documentClient.batchInsert(events, this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}