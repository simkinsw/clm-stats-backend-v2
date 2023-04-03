export class TourneySet {
    id: number;
    winnerID: number;
    loserID: number;
    winnerTag: string;
    loserTag: string;
    fullRoundText: string;
    eventID: number;

    constructor(id: number, winnerID: number, loserID: number, winnerTag: string, loserTag: string, fullRoundText: string, eventID: number) {
        this.id = id;
        this.winnerID = winnerID;
        this.loserID = loserID;
        this.winnerTag = winnerTag;
        this.loserTag = loserTag;
        this.fullRoundText = fullRoundText;
        this.eventID = eventID;
    }

    //TODO: how to identify DQs? -1?
    //parse won games/lost games
    static fromSetsResponse(setsResponse: SetsResponse): TourneySet {
        try {
            const id = setsResponse.id;
            const eventID = setsResponse.event.id;
            const winner = setsResponse.winnerId;
            if(!winner || setsResponse.displayScore === "DQ") {
                return undefined;
            }

            const fullRoundText = setsResponse.fullRoundText;
            
            //TODO: parse this
            const displayScore = setsResponse.displayScore;

            const e1ID = setsResponse.slots[0].entrant.id;
            const { id: p1ID, gamerTag: p1Tag } = setsResponse.slots[0].entrant.participants[0].player;
            const { id: p2ID, gamerTag: p2Tag } = setsResponse.slots[1].entrant.participants[0].player;

            let winnerID, loserID, winnerTag, loserTag;
            if (e1ID === winner) {
                winnerID = p1ID;
                loserID = p2ID;
                winnerTag = p1Tag;
                loserTag = p2Tag;
            } else {
                winnerID = p2ID;
                loserID = p1ID;
                winnerTag = p2Tag;
                loserTag = p1Tag;
            }

            return new TourneySet(id, winnerID, loserID, winnerTag, loserTag, fullRoundText, eventID);
        } catch (err) {
            return undefined;
        }
    }

    toSimpleSet(): SimpleSet {
        return { 
            winnerTag: this.winnerTag, 
            loserTag: this.loserTag 
        }
    }
}

export type SetList = {
    eventID: number;
    sets: SimpleSet[];
}

export type SimpleSet = {
    winnerTag: string;
    loserTag: string;
}

export type SetsResponse = {
    id: number;
    displayScore: string;
    winnerId: number;
    fullRoundText: string;
    event: {
        id: number;
    }
    slots: {
        entrant: {
            id: number;
            participants: {
                player: {
                    id: number;
                    gamerTag: string;
                }
            }[]
        }
    }[]
}