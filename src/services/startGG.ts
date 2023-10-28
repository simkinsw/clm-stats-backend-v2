import { singleton } from "tsyringe";
import { Event, EventResponse } from "../models/event";
import { Placement } from "../models/placement";
import { Player } from "../models/player";
import { TourneySet } from "../models/tourneySet";
import { ENTRANTS_QUERY } from "../queries/entrantsQueries";
import { EVENT_PAGE_QUERY, EVENT_QUERY } from "../queries/eventQueries";
import { SETS_QUERY, SETS_PAGE_QUERY } from "../queries/setsQueries";
import {
    StartGGAPIResponse,
    EventPagesAPIResponse,
    EventAPIResponse,
    EntrantsAPIResponse,
    SetsPagesAPIResponse,
    SetsAPIResponse,
} from "../types/responses";
import { EntrantsVariables, EventVariables, SetsVariables } from "../types/variables";
import { getSSMSecret } from "../utils/aws/ssm";
import { post } from "../utils/axios";
import { uniqueId } from "lodash";

@singleton()
export class startGG {
    url = "https://api.start.gg/gql/alpha";
    apiKey: string;


    private async sendQuery<T extends StartGGAPIResponse>(
        query: string,
        variables: string
    ): Promise<T["data"]> {
        if (!this.apiKey) {
            this.apiKey = await getSSMSecret("clmstats-startgg-token");
        }
        return (await post<T>(this.url, this.apiKey, { query, variables }))
            .data;
    }

    private async getEventPages(variables: EventVariables): Promise<number> {
        const response = await this.sendQuery<EventPagesAPIResponse>(
            EVENT_PAGE_QUERY,
            JSON.stringify(variables)
        );
        return response.tournaments.pageInfo.totalPages;
    }

    public async getEvents(variables: EventVariables): Promise<Event[]> {
        const pages = await this.getEventPages(variables);
        const eventResponses: EventResponse[] = [];

        for (let page = 1; page <= pages; page++) {
            const response = await this.sendQuery<EventAPIResponse>(
                EVENT_QUERY,
                JSON.stringify({ ...variables, page })
            );
            const parsedResponse = response.tournaments.nodes
                .map((node) => node.events)
                .flat(1);
            eventResponses.push(...parsedResponse);
        }

        //.filter(Boolean) removes all undefined values (responses which were not able to be parsed bc of missing data)
        return eventResponses.map(Event.fromAPIResponse).filter(Boolean);
    }

    //TODO: paginate for events > 500?
    public async getEntrants(variables: EntrantsVariables, numEntrants: number): Promise<{ player: Player; placement: Placement }[]> {
        const entrantsResponses = await this.sendQuery<EntrantsAPIResponse>(
            ENTRANTS_QUERY,
            JSON.stringify(variables)
        );

        return entrantsResponses.event.entrants.nodes.map((response) => {
            const player = Player.fromParticipantsResponse(
                response.participants
            );

            if (!player || !response.standing) return undefined;

            //TODO: Need a fromParticipantsResponse type thing here that filters out DQs   
            const placement = new Placement(
                uniqueId(),
                player.id,
                player.tag,
                variables.eventId,
                response.standing.placement,
                numEntrants
            );
            return { player, placement };
        }).filter(Boolean);
    }

    private async getSetsPages(variables: SetsVariables): Promise<number> {
        const response = await this.sendQuery<SetsPagesAPIResponse>(
            SETS_PAGE_QUERY,
            JSON.stringify(variables)
        );
        return response.event.sets.pageInfo.totalPages;
    }

    public async getSets(variables: SetsVariables): Promise<TourneySet[]> {
        const pages = await this.getSetsPages(variables);
        const setsResponses: any[] = [];

        
        for (let page = 1; page <= pages; page++) {
            const response = await this.sendQuery<SetsAPIResponse>(
                SETS_QUERY,
                JSON.stringify({ ...variables, page })
            );
            setsResponses.push(...response.event.sets.nodes);
        }
        
       return setsResponses.map(TourneySet.fromSetsResponse).filter(Boolean);
    }
}
