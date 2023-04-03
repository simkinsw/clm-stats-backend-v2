import "reflect-metadata";
import { container } from "tsyringe";
import { DiscordService } from "../services/discordService";
import { responseBuilder } from "../utils/responseBuilder";
import { batchDeleteMessages, pollQueue } from "../utils/aws/sqs";

const postTop8Graphic = async (event: Record<string, any>) => {
    const test = event.detail.channel === "TEST";
    console.log("Received scheduled request to post top8 graphic", event);

    const messages = await pollQueue(process.env.QUEUE_URL!);
    
    if(!messages || messages.length === 0) {
        console.log("no graphics found");
        return responseBuilder("Did not find any messages in the queue", 500);
    }

    console.log(`Received ${messages.length} message(s). Posting to Discord.`);

    const discordService = container.resolve(DiscordService);
    for (const message of messages) {
        const imageKey: string = JSON.parse(message.Body!).Records[0].s3.object.key;
        const tourneyNum = imageKey.split("/")[1].split(".")[0]; 
        await discordService.sendMessage(tourneyNum, "https://" + process.env.BASE_URL! + "/" + imageKey, test);
    }

    if (!test) {
        console.log("Deleted all processed messages from the queue.");
        await batchDeleteMessages(process.env.QUEUE_URL!, messages.map((message) => {
            return { Id: message.MessageId, ReceiptHandle: message.ReceiptHandle };
        }));
    }

    return responseBuilder(`Successfully posted graphic to ${event.detail.Type} channel`);
}

export const handler = postTop8Graphic;