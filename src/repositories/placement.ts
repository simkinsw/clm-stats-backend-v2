import { singleton } from "tsyringe";
import { Placement } from "../models/placement";
import { DocumentClient } from "../utils/aws/dynamodb";

@singleton()
export class PlacementRepository {
    tableName: string;
    documentClient: DocumentClient;

    constructor(documentClient: DocumentClient) {
        this.tableName = process.env.PLACEMENT_TABLE!
        this.documentClient = documentClient
    }

    async batchInsert(events: Placement[]) {
        try {
            await this.documentClient.batchInsert(events, this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}