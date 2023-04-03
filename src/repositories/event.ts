import { singleton } from "tsyringe";
import { Event } from "../models/event";
import { DocumentClient } from "../utils/aws/dynamodb";

@singleton()
export class EventRepository {
    tableName: string;
    documentClient: DocumentClient;

    constructor(documentClient: DocumentClient) {
        this.tableName = process.env.EVENT_TABLE!
        this.documentClient = documentClient
    }

    async batchInsert(events: Event[]) {
        try {
            await this.documentClient.batchInsert(events, this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}