export class Placement {
    id: string;
    playerID: string;
    playerTag: string;
    eventID: number;
    placement: number;
    numEntrants: number;
    prPeriod = 5;

    constructor(
        id: string,
        playerID: string,
        playerTag: string,
        eventID: number,
        placement: number,
        numEntrants: number
    ) {
        this.id = id;
        this.playerID = playerID;
        this.playerTag = playerTag;
        this.eventID = eventID;
        this.placement = placement;
        this.numEntrants = numEntrants;
    }

    toDB() {
        return {
            id: this.id,
            playerID: this.playerID,
            playerTag: this.playerTag,
            eventID: this.eventID,
            placement: this.placement,
            numEntrants: this.numEntrants
        }
    }
}
