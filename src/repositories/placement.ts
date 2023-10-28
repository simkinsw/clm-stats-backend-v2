import { singleton } from "tsyringe";
import { Placement } from "../models/placement";
import { MongoDBClient } from "../utils/aws/mongodb";

@singleton()
export class PlacementRepository {
    tableName: string;
    mongoDBClient: MongoDBClient;

    constructor(mongoDBClient: MongoDBClient) {
        this.tableName = process.env.PLACEMENT_TABLE!
        this.mongoDBClient = mongoDBClient
    }

    async batchUpsert(placements: Placement[]) {
        try {
            await this.mongoDBClient.batchUpsert(placements.map(placement => placement.toDB()), this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}