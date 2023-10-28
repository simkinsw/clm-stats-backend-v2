import { singleton } from "tsyringe";
import { Event } from "../models/event";
import { Placement } from "../models/placement";
import { Player } from "../models/player";
import { TourneySet } from "../models/tourneySet";
import { startGG } from "./startGG";

//TODO: included in the eventbridge scheduled event I guess?
const EVENT_VARIABLES = {
    coordinates: "41.881832, -87.623177",
    radius: "50mi",
    state: "IL"
}

@singleton()
export class EventService {

    startGG: startGG;
    
    constructor(startGG: startGG) {
        this.startGG = startGG;
    }

    async getAllEvents(afterDate: number, beforeDate: number): Promise<Event[]> {
        return this.startGG.getEvents({ ...EVENT_VARIABLES, afterDate, beforeDate });
    }

    async getEntrants(event: Event): Promise<{player: Player, placement: Placement}[]> {
        return this.startGG.getEntrants({ eventId: Number(event.id) }, event.numEntrants);
    }

    async getSets(event: Event): Promise<TourneySet[]> {
        return this.startGG.getSets({ eventId: Number(event.id) });
    }   
}