import { Game } from "@shared/types";
import { html } from "@web/helpers/webComponents";
import { GameService } from "@web/services/GameService";

export class SearchBarComponent extends HTMLElement {
    private _gameService: GameService = new GameService();
    private _debounceTimer?: number;
    private _resultsDropdown?: HTMLElement;

    /**
     * The delay in milliseconds to wait before executing the search function.
     */
    private static readonly DebounceDelay: number = 300;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();

        // Hide the results dropdown when clicking outside
        document.addEventListener("click", (event: MouseEvent) => {
            const path: EventTarget[] = event.composedPath();

            if (!path.includes(this) && this._resultsDropdown) {
                this._resultsDropdown.classList.remove("visible");
            }
        });
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .search-container {
                    position: relative;
                }

                .input-container {
                    box-sizing: border-box;
                    display: flex;
                    width: 300px;
                    height: 32px;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 4px 12px;
                    background-color: white;
                }

                .input-container:has(input:focus) {
                    border: 1px solid var(--primary-color);
                }

                input.search-input {
                    font-family: 'Inter';
                    border: none;
                    padding: 0;
                    outline: none;
                    width: 100%;
                }

                .results-dropdown {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: 1000;
                }

                .results-dropdown.visible {
                    display: block;
                }

                .result-game {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    cursor: pointer;
                }

                .result-game:hover {
                    background-color: #f5f5f5;
                }

                .result-game img {
                    width: 40px;
                    height: 40px;
                    margin-right: 10px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                
                .result-game .game-info {
                    flex: 1;
                }
                
                .result-game .game-name {
                    font-weight: bold;
                    margin-bottom: 3px;
                }
                
                .result-game .game-price {
                    font-size: 12px;
                    color: #e80000;
                }

                .info {
                    padding: 10px;
                    text-align: center;
                }
            </style>
        `;

        const searchInput: HTMLInputElement = html`
            <input 
                type="text" 
                class="search-input" 
                placeholder="Zoek spellen..." 
                autocomplete="off"
            />
        ` as HTMLInputElement;

        this._resultsDropdown = html`<div class="results-dropdown"></div>`;

        const element: HTMLElement = html`
            <div class="search-container">
                <div class="input-container">
                    ${searchInput}
                    <img src="/images/icons/search.svg" alt="Zoeken" />
                </div>
                ${this._resultsDropdown}
            </div>
        `;

        searchInput.addEventListener("input", (event: Event) => {
            const input: HTMLInputElement = event.target as HTMLInputElement;
            const query: string = input.value;

            // Clear the previous debounce timer
            if (this._debounceTimer) {
                window.clearTimeout(this._debounceTimer);
            }

            // Minimize the search to 3 characters
            if (query.length < 3) {
                this._resultsDropdown!.classList.remove("visible");
                this._resultsDropdown!.innerHTML = "";
                return;
            }

            this.showLoading();

            // Set a new debounce timer
            this._debounceTimer = window.setTimeout(async () => {
                const games: Game[] = await this._gameService.searchGames(query);
                this.renderResults(games);
            }, SearchBarComponent.DebounceDelay);
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private renderResults(games: Game[]): void {
        if (!this._resultsDropdown) {
            return;
        }

        if (games.length === 0) {
            this.showNoResults();
            return;
        }

        this._resultsDropdown.innerHTML = "";

        games.forEach(game => {
            const gameElement: HTMLElement = html`
                <div class="result-game">
                    <img src="${game.thumbnail}" alt="${game.name}" />
                    <div class="game-info">
                        <div class="game-name">${game.name}</div>
                        <div class="game-price">€${game.price}</div>
                    </div>
                </div>
            `;

            gameElement.addEventListener("click", () => {
                window.location.href = `/game-info.html?id=${game.id}`;
            });

            this._resultsDropdown?.appendChild(gameElement);
        });

        this._resultsDropdown.classList.add("visible");
    }

    private showNoResults(): void {
        if (!this._resultsDropdown) {
            return;
        }

        this._resultsDropdown.innerHTML = `
            <div class="info">
                <span>Geen resultaten gevonden</span>
            </div>
        `;
        this._resultsDropdown.classList.add("visible");
    }

    private showLoading(): void {
        if (!this._resultsDropdown) {
            return;
        }

        this._resultsDropdown.innerHTML = `
            <div class="info">
                <span>Zoeken...</span>
            </div>
        `;
        this._resultsDropdown.classList.add("visible");
    }
}

window.customElements.define("webshop-search-bar", SearchBarComponent);
