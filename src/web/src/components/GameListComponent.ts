import "@web/components/GameSelectComponent";
import "@web/components/LoadingComponent";
import { Game, PaginatedResponse } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { FilterChangeEvent } from "./FilterControlsComponent";
import { SortingChangeEvent } from "./SortingControlsComponent";
import { LoadingComponent } from "./LoadingComponent";

export type GameListLoadedEvent = {
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
};

/**
 * Displays a list of games with pagination.
 *
 * @remarks The pagination controls is handled by the component itself. This should later be moved to its own component.
 */
export class GameListComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();
    private _gameService: GameService = new GameService();

    private _currentPage: number = 1;
    private _totalPages: number = 1;
    private _itemsPerPage: number = 12;
    private _totalItems: number = 0;

    // Filter values
    private _sortBy: string = "name";
    private _sortOrder: "asc" | "desc" = "asc";
    private _minPrice: number = 0;
    private _maxPrice: number = 100;
    private _tags: number[] = [];

    private _gamesContainer: HTMLElement | null = null;
    private _paginationContainer: HTMLElement | null = null;
    private _loadingComponent: LoadingComponent = html`<webshop-loading></webshop-loading>` as LoadingComponent;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .games-content {
                    flex-grow: 1;
                }

                .games {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 20px;
                    margin: 20px 0;
                }

                .pagination {
                    display: flex;
                    justify-content: center;
                    margin: 20px;
                    gap: 10px;
                }
                
                .pagination button {
                    padding: 8px 16px;
                    background-color: white;
                    border: 1px solid #ddd;
                    cursor: pointer;
                    border-radius: 4px;
                    user-select: none;
                }

                .pagination button.icon {
                    display: flex;
                    padding: 0 8px 0 8px;
                    justify-content: center;
                    align-items: center;
                }
                
                .pagination button:disabled {
                    background-color: #ddd;
                    cursor: not-allowed;
                }

                .pagination button:hover:not(:disabled):not(.active) {
                    background-color: #f0f0f0;
                    border-color: #bbb;
                }
                
                .pagination button.active {
                    background-color: #159eff;
                    border-color: #159eff;
                    color: white;
                }
            </style>
        `;

        this._gamesContainer = html`
            <div class="games"></div>
        `;

        this._paginationContainer = html`
            <div class="pagination"></div>
        `;

        const element: HTMLElement = html`
            <div class="games-content">
                ${this._loadingComponent}

                ${this._gamesContainer}
                <div>
                    ${this._paginationContainer}
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Event listeners
        this._webshopEventService.addEventListener(WebshopEvent.Filter, async (event: FilterChangeEvent) => {
            this._minPrice = event.minPrice;
            this._maxPrice = event.maxPrice;
            this._tags = event.tags;
            this._currentPage = 1;
            await this.updateGames();
        });

        this._webshopEventService.addEventListener(WebshopEvent.Sort, async (event: SortingChangeEvent) => {
            this._sortBy = event.sortBy;
            this._sortOrder = event.sortOrder;
            await this.updateGames();
        });

        await this.updateGames();
    }

    private async updateGames(): Promise<void> {
        if (!this.shadowRoot || !this._gamesContainer || !this._paginationContainer) {
            return;
        }

        // Clear existing games
        this._gamesContainer.innerHTML = "";

        this._loadingComponent.show();

        const paginatedResponse: PaginatedResponse<Game> = await this._gameService.getGames(
            this._currentPage,
            this._itemsPerPage,
            this._sortOrder,
            this._sortBy,
            this._tags,
            this._minPrice,
            this._maxPrice
        );

        const games: Game[] = paginatedResponse.items;
        this._totalPages = paginatedResponse.pagination.totalPages;
        this._currentPage = paginatedResponse.pagination.currentPage;
        this._itemsPerPage = paginatedResponse.pagination.itemsPerPage;
        this._totalItems = paginatedResponse.pagination.totalItems;

        games.forEach(game => {
            const gameElement: HTMLElement = html`
                <webshop-select-game
                    gameId="${game.id}"
                    name="${game.name}"
                    image="${game.thumbnail}"
                    price="${game.price}"
                ></webshop-select-game>
            `;

            this._gamesContainer!.appendChild(gameElement);
        });

        const pageButtons: HTMLButtonElement[] = [];

        const startPage: number = Math.max(1, this._currentPage - 1);
        const endPage: number = Math.min(this._totalPages, startPage + 2);

        for (let i: number = startPage; i <= endPage; i++) {
            const pageButton: HTMLButtonElement = html`<button>${i}</button>` as HTMLButtonElement;

            if (i === this._currentPage) {
                pageButton.classList.add("active");
            }

            pageButton.addEventListener("click", async () => {
                await this.switchPage(i);
            });

            pageButtons.push(pageButton);
        }

        const prevArrow: HTMLButtonElement = html`<button class="icon"><img src="images/icons/arrow-left.svg"></button>` as HTMLButtonElement;
        prevArrow.disabled = this._currentPage === 1;
        prevArrow.addEventListener("click", async () => {
            await this.switchPage(this._currentPage - 1);
        });

        const nextArrow: HTMLButtonElement = html`<button class="icon"><img src="images/icons/arrow-right.svg"></button>` as HTMLButtonElement;
        nextArrow.disabled = this._currentPage === this._totalPages;
        nextArrow.addEventListener("click", async () => {
            await this.switchPage(this._currentPage + 1);
        });

        // Clear existing pagination
        this._paginationContainer.innerHTML = "";
        this._paginationContainer.appendChild(prevArrow);
        pageButtons.forEach(button => {
            this._paginationContainer!.appendChild(button);
        });
        this._paginationContainer.appendChild(nextArrow);

        this._webshopEventService.dispatchEvent(WebshopEvent.GamesListLoaded, {
            totalPages: this._totalPages,
            currentPage: this._currentPage,
            itemsPerPage: this._itemsPerPage,
            totalItems: this._totalItems,
        });

        this._loadingComponent.hide();
    }

    private async switchPage(page: number): Promise<void> {
        if (page < 1 || page > this._totalPages) {
            return;
        }

        if (this._currentPage === page) {
            return;
        }

        this._currentPage = page;
        await this.updateGames();
    }
}

window.customElements.define("webshop-list-games", GameListComponent);
