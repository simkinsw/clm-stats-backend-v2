import { getCharacterData } from "../../../src/data/characterData";
import { Event } from "../../../src/models/event";
import { Placement } from "../../../src/models/placement";
import { sendTop8Request } from "../../../src/services/top8Service";
import { invokeLambdaAsync } from "../../../src/utils/aws/lambda";

jest.mock("../../../src/data/characterData", () => ({
    __esModule: true,
    getCharacterData: jest.fn(() => ({
            character: "fox",
            color: "default",
    }))
}));

jest.mock("../../../src/utils/aws/lambda", () => ({
    __esModule: true,
    invokeLambdaAsync: jest.fn()
}));

describe("top 8 graphic test suite", () => {

    const PLACEMENTS = Array.from(Array(8).keys()).map(i => ({
        playerTag: `p${i+1}`,
        placement: i+1
    }));

    const DATE = Date.now();

    const EVENT = {
        slug: "tournament/midlane-melee-999/events",
        date: DATE
    };

    afterEach(() => {
        jest.restoreAllMocks();
    })

    test("Sends a request to generate a top 8 graphic", async () => {
        sendTop8Request(PLACEMENTS as Placement[], EVENT as Event);

        const expectedPayload = JSON.stringify({
            data: {
                number: "999",
                date: new Date(DATE).toLocaleDateString(),
                players: PLACEMENTS.map((p) => {
                    return { 
                        tag: p.playerTag,
                        character: "fox",
                        color: "default"
                    }
                })
            }
        });

        expect(invokeLambdaAsync).toHaveBeenCalledWith("clmstats-generate-top8-graphic", expectedPayload);
    });
});
