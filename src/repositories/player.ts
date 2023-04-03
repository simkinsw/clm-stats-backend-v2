import { marshall } from "@aws-sdk/util-dynamodb";
import { singleton } from "tsyringe";
import { Player } from "../models/player";
import { DocumentClient } from "../utils/aws/dynamodb";

@singleton()
export class PlayerRepository {
    tableName: string;
    documentClient: DocumentClient;

    constructor(documentClient: DocumentClient) {
        this.tableName = process.env.PLAYER_TABLE!
        this.documentClient = documentClient
    }

    async batchInsert(players: Player[]) {
        try {
            await this.documentClient.batchInsert(players, this.tableName)
        } catch (err) {
            console.log(err);
        }
    }

    async batchUpdateRatings(partialPlayers: { tag: string, rating: number }[]) {
        try { 
            const transactItems = partialPlayers.map(player => {
                return {
                    Update: {
                        ExpressionAttributeNames: { "#rating": "rating" },
                        ExpressionAttributeValues: marshall({ ":rating": player.rating }),
                        Key: marshall({ tag: player.tag }),
                        TableName: this.tableName,
                        UpdateExpression: "SET #rating = :rating"
                    }
                }
            });
            await this.documentClient.transact(transactItems);
        } catch (err) {
            console.log(err);
        }
    }
}