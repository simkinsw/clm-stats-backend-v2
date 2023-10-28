export class Player {
    id: string;
    tag: string;
    prefix: string;
    realName: string;
    pronouns: string;
    profileImage: string;
    twitter: string;
    twitch: string;
    prPeriod = 5;
    prEvents = 0;
    rating = 0;

    constructor(
        id: string,
        tag: string,
        prefix: string,
        realName: string,
        pronouns: string,
        profileImage?: string,
        twitter?: string,
        twitch?: string
    ) {
        this.id = id;
        this.tag = tag;
        this.prefix = prefix;
        this.realName = realName;
        this.pronouns = pronouns;
        this.profileImage = profileImage;
        this.twitter = twitter;
        this.twitch = twitch;
    }

    toDB() {
        return {
            id: this.id,
            tag: this.tag,
            prefix: this.prefix,
            realName: this.realName,
            pronouns: this.pronouns,
            profileImage: this.profileImage,
            twitter: this.twitter,
            twitch: this.twitch
        }
    }

    static fromParticipantsResponse(
        participantsResponse: ParticipantsResponse
    ): Player | undefined {
        try {
            const playerResponse = participantsResponse[0].player;

            if (!playerResponse || playerResponse.gamerTag.includes("BYE")) {
                return undefined;
            }
            /*

            const profileImage = playerResponse.user.images.find(
                (image) => image.type === "profile"
            )?.url;
            const twitter = playerResponse.user.authorizations.find(
                (image) => image.type === "TWITTER"
            )?.externalUsername;
            const twitch = playerResponse.user.authorizations.find(
                (image) => image.type === "TWITCH"
            )?.externalUsername;
            */

            return new Player(
                playerResponse.id.toString(),
                playerResponse.gamerTag,
                !!playerResponse.prefix ? playerResponse.prefix : undefined,
                playerResponse.user.name ?? undefined,
                playerResponse.user.genderPronoun ?? undefined,
            );
        } catch (err) {
            return undefined;
        }
    }
}

export type PlayerRatingUpdate = {
    tag: string,
    rating: number
}

export type ParticipantsResponse = {
    player: {
        id: number;
        gamerTag: string;
        prefix: string;
        user: {
            genderPronoun: string;
            name: string;
            authorizations: {
                type: string;
                externalUsername: string;
            }[];
            images: {
                type: string;
                url: string;
            }[];
        };
    };
}[];
