import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { GameService } from "@web/services/GameService";
import { IGameService } from "@web/interfaces/IGameService";
import { Game, ICartResponse } from "@shared/types";
import { CartService } from "@web/services/CartService";
import { ICartService } from "@web/interfaces/ICartService";
/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class GameInfoComponent extends HTMLElement {
    private gameService: IGameService = new GameService();
    private cartService: ICartService = new CartService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const params: URLSearchParams = new URLSearchParams(window.location.search);
        const id: number = Number(params.get("id") ?? 0);
        let game: Game[] = [];
        if (id) {
            game = await this.gameService.getGameById(id);
        }

        const styles: HTMLElement = html`
            <style>
                .container {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                }

                .container header {
                    margin-left: 85px;
                    margin-top: 11px;
                    width: 100%;
                }

                .container header h2 {
                    margin-bottom: 10px;
                }

                .container header img {
                    width: 25px;
                }

                .image-container {
                    margin-top: 20px;
                    margin-left: 85px;
                    height: 350px;
                    width: 350px;
                    border: 1px solid black;
                    border-radius: 25px;
                    
                    background: black;
                    
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .image-container img {
                    width: 100%;
                }

                .game-info {
                    margin-left: 200px;
                    min-width: 300px;
                    max-width: 500px;
                    height: 450px;
                }

                .game-info .price {
                    color: #ff2b2b;
                    font-size: 23px;
                    text-align: center;
                    font-weight: bold;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .game-info .description {
                    margin: 0 50px;
                    width: 100%;
                    height: 300px;
                    overflow-y: auto;
                }

                .quantity-selector {
                    width: 100%;
                }
                
                #message-container {
                    display: none;
                    width: 100%;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    pointer-events: none;
                    justify-content: end;
                }
                
                #message {
                    transition: 0.3s;
                    height: 50px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                    border-radius: 15px;
                    position: relative;
                    top: 68px;
                }

                .quantity {
                    margin-top: 60px;
                    margin-left: 50px;
                    width: 50px;
                    height: 50px;
                    border: 2px solid black;
                    border-radius: 10px;
                    display: none;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                }

                .cart-button {
                    margin-top: 80px;
                    margin-left: 50px;
                    width: 200px;
                    height: 50px;
                    border-radius: 10px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 20px;
                    background: #159eff;
                    color: white;
                }

                .cart-button:hover {
                    background: #1083d5;
                }
                
                @media only screen and (max-width: 1168px) {
                    .game-info {
                        margin-left: 0;
                    }
                }

                @media only screen and (max-width: 968px) {
                    .container {
                        justify-content: center;
                        height: 1043px;
                    }
                    .container header {
                        height: 20px;
                    }
                }

                @media only screen and (max-width: 606px) {
                    .image-container {
                        width: 250px;
                        height: 250px;
                    }
                    .game-info {
                        width: 250px;
                        min-width: auto;
                        max-width: none;
                        margin-left: 73px;
                    }
                    .image-container {
                        margin-left: 0;
                    }
                    .game-info .description {
                        margin: 0;
                    }
                    .container header {
                        margin-left: 0;
                    }
                    .container header h2 {
                        text-align: center;
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="container">
                <div id="message-container">
                    <p id="message">Toegevoegd aan de winkelmand</p>
                </div>
                <header>
                    <h2>${game[0].name}</h2>
                    <div class="stars-container">
                    </div>
                </header>
                <div class="image-container">
                    <img src="${game[0].thumbnail}" alt="game-cover" />
                </div>
                <div class="game-info">
                    <p class="price">${game[0].price}</p>
                    <div class="description">${game[0].description}</div>
                    <div class="quantity-selector">
                        <div class="quantity">1x</div>
                    </div>
                    <div id="add-to-cart-button" class="cart-button">In winkelwagen</div>
                </div>
            </div>
        `;

        const cartButton: HTMLElement = element.querySelector("#add-to-cart-button")!;
        cartButton.addEventListener("click", async () => {
            const cartResponse: ICartResponse = await this.cartService.createCart({
                gameId: id, quantity: 1,
                userId: 0,
                thumbnail: "",
                name: "",
                description: "",
                price: 0,
            });
            if (cartResponse.success) {
                this.showPopup(
                    "Toegevoegd aan de winkelmand",
                    "success"
                );
            }
            else {
                this.showPopup(
                    "Je bent niet ingelogd",
                    "warning"
                );
            }
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private showPopup(message: string, type: string = "warning"): void {
        const messageContainerElement: HTMLElement = this.shadowRoot!.querySelector("#message-container")!;
        const messageElement: HTMLElement = this.shadowRoot!.querySelector("#message")!;

        // Reset position & show container
        messageElement.style.right = "-200px";
        messageContainerElement.style.display = "flex";

        // Slide in after a tiny delay to trigger CSS transition
        setTimeout(() => {
            messageElement.style.right = "18px";
        }, 20);

        // Set message and background color
        messageElement.innerHTML = message;
        switch (type) {
            case "success":
                messageElement.style.backgroundColor = "#159eff";
                break;
            case "warning":
                messageElement.style.backgroundColor = "orange";
                break;
            case "error":
                messageElement.style.backgroundColor = "red";
                break;
        }

        // Auto-hide after 4 seconds
        setTimeout(() => {
            messageElement.style.right = "-400px";

            setTimeout(() => {
                messageContainerElement.style.display = "none";
            }, 300);
        }, 2000);
    }
}

window.customElements.define("webshop-game-info", GameInfoComponent);
