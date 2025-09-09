import { IGameService } from "@api/interfaces/IGameService";
import { GameService } from "@api/services/GameService";
import { Game, GetGamesOptions, PaginatedResponse } from "@shared/types";
import { Request, Response } from "express";

/**
 * This controller is responsible for handling requests related to games.
 */
export class GamesController {
    private readonly _gameService: IGameService = new GameService();

    /**
     * Handles the request to get all games.
     *
     * @remarks This will later handle filtering and/or sorting.
     */
    public async getGames(req: Request, res: Response): Promise<void> {
        const options: GetGamesOptions = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
            sort: req.query.sort ? (req.query.sort as "asc" | "desc") : undefined,
            sortBy: req.query.sortBy ? (req.query.sortBy as "name" | "price" | "created") : undefined,
            tags: req.query.tags ? (req.query.tags as string).split(",").map(Number) : undefined,
            minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
            maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        };

        if (options.page < 1) {
            res.status(400).json({
                error: "Page must be greater than 0",
            });
            return;
        }

        if (options.limit < 1) {
            res.status(400).json({
                error: "Limit must be greater than 0",
            });
            return;
        }

        if (options.sort && !["asc", "desc"].includes(options.sort)) {
            res.status(400).json({
                error: "Invalid sort value",
            });
            return;
        }

        if (options.sortBy && !["name", "price", "created"].includes(options.sortBy)) {
            res.status(400).json({
                error: "Invalid sortBy value",
            });
            return;
        }

        if (options.tags && options.tags.length > 0) {
            for (const tag of options.tags) {
                if (isNaN(tag)) {
                    res.status(400).json({
                        error: "Invalid tag value",
                    });
                    return;
                }
            }
        }

        if (options.minPrice && isNaN(options.minPrice)) {
            res.status(400).json({
                error: "Invalid minPrice value",
            });
            return;
        }

        if (options.maxPrice && isNaN(options.maxPrice)) {
            res.status(400).json({
                error: "Invalid maxPrice value",
            });
            return;
        }

        const paginatedResult: PaginatedResponse<Game> = await this._gameService.getGames(options);
        res.json(paginatedResult);
    }

    public async getGameById(req: Request, res: Response): Promise<void> {
        const id: number = Number(req.query.id as string);

        if (!id) {
            res.status(400).json({ error: "Missing 'id' parameter" });
            return;
        }

        const game: Game[] = await this._gameService.getGameById(id);
        res.status(200).json({ games: game });
    }

    public async getFiveRandomGames(_req: Request, res: Response): Promise<void> {
        const game: Game[] = await this._gameService.getFiveRandomGames();

        res.status(200).json({
            games: game,
        });
    }

    /**
     * Handles the request to get all owned games for a user.
     */
    public async getOwnedGames(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        // Check if we need to get a specific game or all owned games.
        const gameId: number | undefined = req.query.id ? Number(req.query.id) : undefined;

        const ownedGames: Game[] = await this._gameService.getOwnedGames(userId, gameId);

        res.json({
            games: ownedGames,
        });
    }

    /**
     * Handles the request to search for games.
     *
     * @remarks This will later be paginated.
     */
    public async searchGames(req: Request, res: Response): Promise<void> {
        const query: string | undefined = req.query.q as string || undefined;

        if (!query) {
            res.json({ games: [] });
            return;
        }

        const games: Game[] = await this._gameService.searchGames(query);
        res.json({ games });
    }
}
