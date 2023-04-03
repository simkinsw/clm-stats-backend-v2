import { Client, TextChannel, AttachmentBuilder } from "discord.js";
import { singleton } from "tsyringe";
import { getSSMSecret } from "../utils/aws/ssm";

@singleton()
export class DiscordService {

    client: Client;

    constructor() {
        this.client = new Client({
            intents: []
        });
    }

    async sendMessage (tourneyNum: string, imageUrl: string, test: boolean) {
        const token = await getSSMSecret("clmstats-discord-token");
        await this.client.login(token);

        const channelID = test ? process.env.TEST_CHANNEL_ID : process.env.CHANNEL_ID;
        const channel = await this.client.channels.fetch(channelID!) as TextChannel;

        const file = new AttachmentBuilder(imageUrl);
        await channel.send({ content:`**Midlane Melee ${tourneyNum}**`, files: [file] });
    }
}