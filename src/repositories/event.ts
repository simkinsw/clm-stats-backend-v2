import { singleton } from "tsyringe";
import { Event } from "../models/event";
import { MongoDBClient } from "../utils/aws/mongodb";

@singleton()
export class EventRepository {
    tableName: string;
    mongoDBClient: MongoDBClient;

    constructor(mongoDBClient: MongoDBClient) {
        this.tableName = process.env.EVENT_TABLE!
        this.mongoDBClient = mongoDBClient
    }

    async batchUpsert(events: Event[]) {
        try {
            await this.mongoDBClient.batchUpsert(events.map(event => event.toDB()), this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}