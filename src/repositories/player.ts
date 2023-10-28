import { singleton } from "tsyringe";
import { Player } from "../models/player";
import { MongoDBClient } from "../utils/aws/mongodb";

@singleton()
export class PlayerRepository {
    tableName: string;
    mongoDBClient: MongoDBClient;

    constructor(mongoDBClient: MongoDBClient) {
        this.tableName = process.env.PLAYER_TABLE!
        this.mongoDBClient = mongoDBClient
    }

    async batchInsert(players: Player[]) {
        try {
            await this.mongoDBClient.batchUpsert(players.map(player => player.toDB()), this.tableName)
        } catch (err) {
            console.log(err);
        }
    }

    async batchUpdateRatings(partialPlayers: { id: string, rating: number }[]) {
        try { 
            const transactItems = partialPlayers.map(player => {
                return {
                    updateOne: {
                        filter: { id: player.id },
                        update: {
                            $set: { rating: player.rating }
                        }
                    }
                }
            });
            await this.mongoDBClient.bulkUpdate(transactItems, this.tableName);
        } catch (err) {
            console.log(err);
        }
    }
}