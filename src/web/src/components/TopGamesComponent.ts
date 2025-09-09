import { html } from "@web/helpers/webComponents";
import "@web/components/GameSelectComponent";
import { OrdersGamesService } from "@web/services/OrdersGamesService";
import { OrdersGames } from "@shared/types";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class TopGamesComponent extends HTMLElement {
    private _ordersGamesService: OrdersGamesService = new OrdersGamesService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const ordersGames: OrdersGames[] = await this._ordersGamesService.getOrdersGames();

        // Use the OrdersGames type directly
        const games: { gameId: number; name: string; thumbnail: string; price: number }[] = this.getTopGames(ordersGames, 10);

        const styles: HTMLElement = html`
            <style>
                .slider-container {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    max-width: 971px;
                    position: relative;
                }

                .slider-view {
                    width: 100%; /* 5 boxes * 100px each */
                    overflow: hidden;
                }

                .slider-track {
                    display: flex;
                    transition: transform 0.3s ease;
                }

                .box {
                    width: 100px;
                    height: 100px;
                    background-color: #8c8;
                    border: 2px solid #555;
                    margin-right: 5px;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                }

                .arrow {
                    background-color: #F9FAFC;
                    color: var(--primary-color);
                    border: none;
                    font-size: 24px;
                    width: 40px;
                    height: 100px;
                    cursor: pointer;
                }
                
                .arrow:hover {
                    color: var(--primary-color-dark);
                }
                
                .top-games {
                    width: 100%;
                    margin: 50px 0;
                    display: flex;
                    justify-content: space-evenly;
                    flex-wrap: wrap;
                }
                
                @media only screen and (max-width: 968px) {
                    .slider-track {
                        flex-wrap: wrap;
                        justify-content: space-evenly;
                    }
                    .arrow {
                        display: none;
                    }
                    .slider-view {
                        display: flex;
                        justify-content: center;
                    }
                }
            </style>
        `;

        const gameElements: HTMLElement[] = games.map(game => {
            const gameElement: HTMLElement = html`
                <webshop-select-game
                    gameId="${game.gameId}"
                    name="${game.name}"
                    image="${game.thumbnail}"
                    price="${game.price}">
                </webshop-select-game>
            `;
            return gameElement;
        });

        const element: HTMLElement = html`
            <section class="top-games">
                <div class="slider-container">
                    <button id="prev" class="arrow">&#9664;</button>

                    <div class="slider-view">
                        <div class="slider-track">
                            ${gameElements}
                        </div>
                    </div>

                    <button id="next" class="arrow">&#9654;</button>
                </div>
            </section>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);

        const track: HTMLElement = element.querySelector(".slider-track")!;
        const next: HTMLElement = element.querySelector("#next")!;
        const prev: HTMLElement = element.querySelector("#prev")!;

        const visibleBoxes: number = 5;
        const boxWidth: number = 219; // box + margin
        const totalBoxes: number = track.children.length;

        let currentIndex: number = 0;

        next.addEventListener("click", () => {
            if (currentIndex < totalBoxes - visibleBoxes) {
                currentIndex++;
                updateSlider();
            }
        });

        prev.addEventListener("click", () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        });

        function updateSlider(): void {
            track.style.transform = `translateX(-${currentIndex * boxWidth}px)`;
        }
    }

    private getTopGames(purchases: OrdersGames[], topN: number = 5): { gameId: number; name: string; thumbnail: string; price: number }[] {
        const seenPairs: Set<string> = new Set();
        const gameMap: Map<number, { userId: number; name: string; thumbnail: string; price: number; users: Set<number> }> = new Map();

        for (const { gameId, userId, name, thumbnail, price } of purchases) {
            const key: string = `${userId}-${gameId}`;
            if (seenPairs.has(key)) continue;

            seenPairs.add(key);

            if (!gameMap.has(gameId)) {
                gameMap.set(gameId, {
                    userId,
                    name,
                    thumbnail,
                    price: price,
                    users: new Set(),
                });
            }

            gameMap.get(gameId)!.users.add(userId);
        }

        const topGames: { gameId: number; name: string; thumbnail: string; price: number }[] = Array.from(gameMap.entries())
            .map(([gameId, { name, thumbnail, price }]) => ({
                gameId,
                name,
                thumbnail,
                price,
            }))
            .slice(0, topN);

        return topGames;
    }
}

window.customElements.define("webshop-top-games", TopGamesComponent);
