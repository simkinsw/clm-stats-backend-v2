import { singleton } from "tsyringe";
import { WholeHistoryRating } from "whr";
import { Player, PlayerRatingUpdate } from "../models/player";
import { SetList, SimpleSet, TourneySet } from "../models/tourneySet";
import { PlayerRepository } from "../repositories/player";
import { readFromS3, saveToS3 } from "../utils/aws/s3";
import * as _ from "lodash";

@singleton()
export class RatingService {
    whr = new WholeHistoryRating({ w2: 20 });
    playerRepository: PlayerRepository;

    constructor(playerRepository: PlayerRepository) {
        this.playerRepository = playerRepository;
    }

    calcRatings(setLists: SetList[], playerMap: Map<string, Player>) {
        const missingPlayers: PlayerRatingUpdate[] = [];
        const missingTags = new Set<string>();

        for (let i = 0; i < setLists.length; i++) {
            for (const set of setLists[i].sets) {
                this.whr.createGame(set.winnerTag, set.loserTag, "B", i, 0);
                if (!playerMap.has(set.winnerTag)) {
                    missingTags.add(set.winnerTag);
                }
                if (!playerMap.has(set.loserTag)) {
                    missingTags.add(set.loserTag);
                }
            }
        }

        this.whr.iterate(100);

        for (const player of playerMap.values()) {
            const ratings = this.whr.ratingsForPlayer(player.tag);
            if (ratings.length === 0) continue;
            player.rating = ratings[ratings.length - 1][1];
        }

        for (const player of missingTags) {
            const ratings = this.whr.ratingsForPlayer(player);
            if (ratings.length === 0) continue;
            missingPlayers.push({
                tag: player,
                rating: ratings[ratings.length - 1][1]
            });
        }

        return { playerMap, missingPlayers };
    }

    async getAllSetsAndDedupe(newSets: TourneySet[][]) {
        const prevSets = await readFromS3<SetList[]>(process.env.SETS_BUCKET!, process.env.CURRENT_PR_PERIOD!) ?? [];
        const convertedSets: SetList[] = newSets
                                .filter(sets => sets.length !==0)
                                .map(sets => {
                                    return {
                                        eventID: sets[0].eventID,
                                        sets: sets.map(set => set.toSimpleSet())
                                    }
                                });
        return _.uniqBy([...prevSets, ...convertedSets], val => val.eventID);
    }

    async saveSets(sets: SimpleSet[][]) {
        await saveToS3(JSON.stringify(sets), process.env.SETS_BUCKET!, process.env.CURRENT_PR_PERIOD!);
    }
}