import { singleton } from "tsyringe";
import { TourneySet } from "../models/tourneySet";
import { MongoDBClient } from "../utils/aws/mongodb";

@singleton()
export class SetRepository {
    tableName: string;
    mongoDBClient: MongoDBClient;

    constructor(mongoDBClient: MongoDBClient) {
        this.tableName = process.env.SET_TABLE!
        this.mongoDBClient = mongoDBClient
    }

    async batchInsert(sets: TourneySet[]) {
        try {
            await this.mongoDBClient.batchUpsert(sets.map(set => set.toDB()), this.tableName)
        } catch (err) {
            console.log(err);
        }
    }
}