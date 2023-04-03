export class Placement {
    playerID: number;
    playerTag: string;
    eventID: number;
    placement: number;
    numEntrants: number;
    prPeriod = 5;

    constructor(
        playerID: number,
        playerTag: string,
        eventID: number,
        placement: number,
        numEntrants: number
    ) {
        this.playerID = playerID;
        this.playerTag = playerTag;
        this.eventID = eventID;
        this.placement = placement;
        this.numEntrants = numEntrants;
    }
}
