import { invokeLambdaAsync } from "../utils/aws/lambda";
import { Event } from "../models/event";
import { Placement } from "../models/placement";
import { getCharacterData } from "../data/characterData";

export function sendTop8Request(placements: Placement[], event: Event) {
    const top8Tags = placements
        .sort((a,b) => a.placement - b.placement)
        .slice(0, 8)
        .map((placement) => placement.playerTag);

    const playerList = top8Tags.map((tag) => {
        try {
            return {
                tag,
                character: getCharacterData(tag).character,
                color: getCharacterData(tag).color,
            };
        } catch (err) {
            console.log(`Did not find character data for ${tag}. Unable to generate a graphic`);
            throw new Error("could not generate graphic");
        }
    });

    const payload = JSON.stringify({
        data: {
            number: event.slug.split("/")[1].split("-")[2],
            date: new Date(event.date * 1000).toLocaleDateString(),
            players: playerList,
        }
    });

    invokeLambdaAsync("clmstats-generate-top8-graphic", payload);
}    
