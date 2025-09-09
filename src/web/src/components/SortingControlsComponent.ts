import { WebshopEvent } from "@web/enums/WebshopEvent";
import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { GameListLoadedEvent } from "./GameListComponent";

export type SortingChangeEvent = {
    sortBy: string;
    sortOrder: "asc" | "desc";
};

export class SortingControlsComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    private _sortBy: string = "name";
    private _sortOrder: "asc" | "desc" = "asc";

    private _totalResultsSpan: HTMLSpanElement | null = null;

    public set totalResults(value: number) {
        if (this._totalResultsSpan) {
            this._totalResultsSpan.textContent = `${value} resultaten`;
        }
    }

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .controls-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .sort-controls {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                
                .sort-controls label {
                    font-weight: bold;
                }
                
                .sort-controls select {
                    padding: 8px;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }
                
                .sort-direction {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 36px;
                    height: 36px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .total-results {
                    font-weight: bold;
                }
            </style>
        `;

        const sortSelect: HTMLSelectElement = html`
            <select id="sort-select">
                <option value="name">Naam</option>
                <option value="price">Prijs</option>
                <option value="created">Datum toegevoegd</option>
            </select>
        ` as HTMLSelectElement;

        Array.from(sortSelect.options).forEach(option => {
            if (option.value === this._sortBy) {
                option.selected = true;
            }
        });

        const sortDirection: HTMLButtonElement = html`
            <button class="sort-direction" id="sort-direction">
                <img src="/images/icons/arrow-${this._sortOrder === "asc" ? "up" : "down"}.svg" alt="Sort direction" />
            </button>
        ` as HTMLButtonElement;

        this._totalResultsSpan = html`
            <span>0 resultaten</span>
        ` as HTMLSpanElement;

        const element: HTMLElement = html`
            <div class="controls-container">
                <div class="sort-controls">
                    <label for="sort-select">Sorteer op:</label>
                    ${sortSelect}
                    ${sortDirection}
                </div>
                <div class="total-results">
                    ${this._totalResultsSpan}
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add event listeners
        sortSelect.addEventListener("change", () => {
            this._sortBy = sortSelect.value;

            this._webshopEventService.dispatchEvent<SortingChangeEvent>(WebshopEvent.Sort, {
                sortBy: this._sortBy,
                sortOrder: this._sortOrder,
            });
        });

        sortDirection.addEventListener("click", () => {
            this._sortOrder = this._sortOrder === "asc" ? "desc" : "asc";
            sortDirection.querySelector("img")!.src = `/images/icons/arrow-${this._sortOrder === "asc" ? "up" : "down"}.svg`;

            this._webshopEventService.dispatchEvent<SortingChangeEvent>(WebshopEvent.Sort, {
                sortBy: this._sortBy,
                sortOrder: this._sortOrder,
            });
        });

        this._webshopEventService.addEventListener(WebshopEvent.GamesListLoaded, (event: GameListLoadedEvent) => {
            if (!this._totalResultsSpan) {
                return;
            }

            this._totalResultsSpan.innerText = `${event.totalItems} resultaten`;
        });
    }
}

window.customElements.define("webshop-sorting-controls", SortingControlsComponent);
