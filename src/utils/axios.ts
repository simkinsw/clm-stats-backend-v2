import axios from "axios";
import { RateLimiter } from "limiter";

const limit = new RateLimiter({
    tokensPerInterval: 72,
    interval: "minute"
})

export async function post<T>(path: string, token: string, body: any): Promise<T> {
    await limit.removeTokens(1);
    const { data } = await axios.post<T>(path, body, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json"
        }
    })

    return data;
}
