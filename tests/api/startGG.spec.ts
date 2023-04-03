import { container } from "tsyringe";
import { Event } from "../../src/models/event";
import { startGG } from "../../src/services/startGG";

describe("startgg test suite", () => {

    const EVENT = new Event(798961, "Melee Singles", "Joey's Birthday Bash 2", 61, 1674968400, 
                'tournament/joey-s-birthday-bash-2/event/melee-singles', expect.any(String))

    test("gets events from the API", async () => {
        const variables = {
            coordinates: "41.881832, -87.623177",
            radius: "50mi",
            state: "IL",
            afterDate: 1674790000,
            beforeDate: 1675000000
        };

        const startGGService = container.resolve(startGG);
        const events = await startGGService.getEvents(variables);

        expect(events).toEqual([EVENT]);
    });

    test("gets entrants from the API", async () => {
        const startGGService = container.resolve(startGG);
        const entrants = await startGGService.getEntrants({ eventId: EVENT.id }, 61);

        const expectedPlacement = {
            playerID: 491552,
            playerTag: "DannyPhantom",
            eventID: 798961,
            placement: 1,
            numEntrants: 61,
            prPeriod: 5
        };

        const expectedPlayer = {
            id: 491552,
            tag: "DannyPhantom",
            prefix: "CG",
            realName: "Daniel Durant-Schultz",
            pronouns: "He/Him",
            profileImage: expect.any(String),
            twitter: "Go1ngGhost",
            twitch: "iGoingGhost",
            prPeriod: expect.any(Number),
            prEvents: 0,
            rating: 0
        };

        expect(entrants.length).toEqual(61);
        expect(entrants).toContainEqual({ player: expectedPlayer, placement: expectedPlacement });
    });

    test.only("get sets from the API", async () => {
        const startGGService = container.resolve(startGG);
        const sets = await startGGService.getSets({ eventId: EVENT.id });

        expect(sets.length).toEqual(95);
        expect(sets).toContainEqual({
            id: 56329983,
            winnerID: 7066,
            loserID: 555238,
            winnerTag: 'metroid',
            loserTag: 'BlazinJace',
            fullRoundText: 'Winners Round 1',
            eventID: 798961
        })
    });
});