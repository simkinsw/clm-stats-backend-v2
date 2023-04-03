export class Event {
    id: number;
    eventName: string;
    tournamentName: string;
    numEntrants: number;
    date: number;
    slug: string;
    prEligible = false;
    imageUrl: string;
    prPeriod = 5;

    
    constructor(id: number, eventName: string, tournamentName: string, numEntrants: number, date: number, slug: string, imageUrl: string) {
        this.id = id;
        this.eventName = eventName;
        this.tournamentName = tournamentName;
        this.numEntrants = numEntrants;
        this.date = date;
        this.slug = slug;
        this.imageUrl = imageUrl;
    }

    //TODO: filter non serious events? e.g. low tier, etc.
    static fromAPIResponse(eventResponse: EventResponse): Event | undefined {
        try {
            const eventName = eventResponse.name;
            if (!Event.isSingles(eventName)) {
                return undefined;
            } 

            const id = eventResponse.id;
            const tournamentName = eventResponse.tournament.name;
            const numEntrants = eventResponse.numEntrants;
            const date = eventResponse.tournament.endAt;
            const slug = eventResponse.slug;
            const imageUrl = eventResponse.tournament.images.find(image => image.type === "profile")?.url 
                                ?? eventResponse.tournament.images?.[0].url ?? "";

            return new Event(id, eventName, tournamentName, numEntrants, date, slug, imageUrl);
        } catch (err) {
            //TODO: improve error handling
            console.log("invalid event: " + JSON.stringify(eventResponse));
            return undefined;
        }
    }

    static isSingles(eventName: string) {
        const name = eventName.toLowerCase();

        if (name.includes("double") || name.includes("team") || name.includes("low tier")) {
            return false;
        }
        else if (name !== "melee singles") {
            console.log("Suspicious event name was kept:" + eventName);
        }

        return true;
    }
}

export type EventResponse = {
    id: number;
    name: string;
    numEntrants: number;
    slug: string;
    tournament: {
        name: string;
        endAt: number;
        images: {
            url: string;
            type: string;
        }[];
    }
}