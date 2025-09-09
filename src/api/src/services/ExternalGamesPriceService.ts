type GamesPriceApiResponse = {
    productId: string;
    price: number;
    currency: string;
    validUntil: string;
};

/**
 * This class fetches price data for games from the Payment Service Provider (PSP) API.
 *
 * @remarks This should only be used in seeders and not in the application itself!
 *          Make sure the PSP API is running on Oege and that the endpoint is correct in the .env file.
 */
export class ExternalGamesPriceService {
    /**
     * Fetches the price by SKU from the PSP.
     * @param sku SKU to fetch the price for
     * @returns The price of the game or undefined if the price could not be fetched or found
     */
    public async getPrice(sku: string): Promise<number | undefined> {
        const data: GamesPriceApiResponse[] | undefined = await this.fetchPriceData(sku);

        if (!data || data.length === 0) {
            return undefined;
        }

        return data[0].price;
    }

    /**
     * Fetches the prices for a list of SKU's from the PSP.
     * @param skus List of SKU's to fetch prices for
     * @remarks The map will be empty if the API is unavailable or no prices are found.
     */
    public async getPrices(skus: string[]): Promise<Map<string, number>> {
        const prices: Map<string, number> = new Map<string, number>();
        const data: GamesPriceApiResponse[] | undefined = await this.fetchPriceData(skus.join(","));

        if (!data) {
            return prices;
        }

        for (const game of data) {
            prices.set(game.productId, game.price);
        }

        return prices;
    }

    /**
     * Fetches price data from the PSP API.
     * @param skuParam Single SKU or comma separated list of SKU's
     */
    private async fetchPriceData(skuParam: string): Promise<GamesPriceApiResponse[] | undefined> {
        try {
            const response: Response = await fetch(`${process.env.PSP_HOST}api/productprices/${skuParam}`);

            // Sometimes the API isn't online, so return undefined if its unavailable
            if (!response.ok) {
                return undefined;
            }

            return await response.json() as GamesPriceApiResponse[];
        }
        catch {
            console.warn("PSP API is unavailable. Dit you forget to start the docker container or is the endpoint wrong?");
            return undefined;
        }
    }
}
