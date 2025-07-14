import type { RequestHandler } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";

const symbols = ['^GSPC', '^OMX30', '^URTH'];

export const GET: RequestHandler = async ({ url }) => {
    const key = env.ALPHA_VANTAGE_KEY;
    const results: Record<string, any> = {};

    for (const symbol of symbols) {
        const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${encodeURIComponent(symbol)}&apikey=${key}`
        const res = await fetch(url);
        const json = await res.json();
        results[symbol] = json['Monthly Adjusted Time Series'];
    }

    return new Response(JSON.stringify(results), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=3600" // Cache for 1 hour
        }
    });
}
