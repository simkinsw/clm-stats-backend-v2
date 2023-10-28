import { singleton } from "tsyringe";
import { Event } from "../models/event";
import { Placement } from "../models/placement";
import { Player, PlayerRatingUpdate } from "../models/player";
import { SetList, TourneySet } from "../models/tourneySet";
import { EventRepository } from "../repositories/event";
import { PlacementRepository } from "../repositories/placement";
import { PlayerRepository } from "../repositories/player";
import { SetRepository } from "../repositories/set";
import { saveToS3 } from "../utils/aws/s3";
import { EventService } from "./eventService";
import { RatingService } from "./ratingService";
import { sendTop8Request } from "./top8Service";

//TODO: where does this go?
const CUR_PR = ["Skerzo", "Zamu", "shabo", "Eggy", "Q?", "Ober", "JustJoe", "Ferocitii", "GI0GOAT", "Killablue", "FoxCap", "Unsure", "Will Pickles", "Dragoid", "macdaddy69",];

@singleton()
export class ImportDataService {
    eventService: EventService;
    ratingService: RatingService;
    eventRepository: EventRepository;
    playerRepository: PlayerRepository;
    setRepository: SetRepository;
    placementRepository: PlacementRepository;

    playerMap = new Map<string, Player>();
    oldPlayers: PlayerRatingUpdate[] = [];
    ratedSets: TourneySet[][] = [];
    unratedSets: TourneySet[] = [];
    simpleSets: SetList[] = [];
    placements: Placement[] = [];
    events: Event[];

    constructor(
        eventService: EventService,
        ratingService: RatingService,
        eventRepository: EventRepository,
        playerRepository: PlayerRepository,
        setRepository: SetRepository,
        placementRepository: PlacementRepository
    ) {
        this.eventService = eventService;
        this.ratingService = ratingService;
        this.eventRepository = eventRepository;
        this.playerRepository = playerRepository;
        this.setRepository = setRepository;
        this.placementRepository = placementRepository;
    }


    async importData(afterDate: number, beforeDate: number) {
        const newEvents = await this.eventService.getAllEvents(afterDate, beforeDate);

        if (!newEvents || newEvents.length === 0) {
            console.log("No new events found, aborting...");
            return;
        }

        this.events = newEvents;

        for (const event of this.events) {
            await this.parseEvent(event);
        }

        //await this.calcRatings();
        //await this.saveAll();
    }

    async calcRatings() {
        this.simpleSets = await this.ratingService.getAllSetsAndDedupe(this.ratedSets);
        const players = this.ratingService.calcRatings(this.simpleSets, this.playerMap);
        this.playerMap = players.playerMap;
        this.oldPlayers = players.missingPlayers;
    }

    async saveAll() {
        //Not Promise.all because of WCU concerns?
        //await this.eventRepository.batchInsert(this.events);
        //await this.placementRepository.batchInsert(this.placements);
        //await saveToS3(JSON.stringify(this.simpleSets), process.env.SETS_BUCKET, process.env.CURRENT_PR_PERIOD);
        await this.playerRepository.batchInsert(Array.from(this.playerMap.values()));
        //await this.playerRepository.batchUpdateRatings(this.oldPlayers);
    }

    //TODO: don't parse events that have already been parsed
    async parseEvent(event: Event) {
        const data = await this.eventService.getEntrants(event);
        const players = data.map((entry) => entry.player);
        const placements = data.map((entry) => entry.placement);

        const isPrEvent = players.some((player) => CUR_PR.includes(player.tag));

        players.forEach((player) => {
            if (!this.playerMap.has(player.tag)) this.playerMap.set(player.tag, player);
            if (isPrEvent) this.playerMap.get(player.tag).prEvents++;
        });

        const newSets = await this.eventService.getSets(event);

        if (isPrEvent) {
            this.ratedSets.push(newSets);
        } else {
            this.unratedSets.push(...newSets);
        }

        this.placements.push(...placements);

        //can this reasonably error and mess up the whole import?
        if (event.tournamentName.toLowerCase().includes("midlane")) {
            sendTop8Request(placements, event);
        }
    }
}
