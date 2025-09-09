import { WebshopEvent } from "@web/enums/WebshopEvent";
import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class GameSelectComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();

    private _name: string = "";
    private _image: string = "";
    private _price: number = 0;
    private _gameId: number = 0;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this._name = this.getAttribute("name") ?? "";
        this._gameId = Number(this.getAttribute("gameId") ?? 0);
        this._image = this.getAttribute("image") ?? "";
        this._price = Number(this.getAttribute("price") ?? 0.00);
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .select-game-container {
                    box-shadow: 0px 0px 9px -4px black;
                    height: 230px;
                    width: 200px;
                    border-radius: 25px;

                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin: 10px;
                }

                a {
                    text-decoration: none;
                    color: black;
                }

                .game-img {
                    aspect-ratio: 9 / 5;
                    width: 100%;
                    overflow: hidden;
                    border-top-right-radius: 25px;
                    border-top-left-radius: 25px;
                }

                .game-img img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover; /* crop to fill */
                    object-position: center; /* center the image */
                    display: block;
                }

                .game-title, .game-price {
                    margin: 0;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    align-items: center;
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

                .game-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 85%;
                    text-align: center;
                    margin: 10px auto;
                }

                .game-price {
                    height: 30px;
                    font-size: 14px;
                    color: #e80000;
                }

                .add-button {
                    border: none;
                    border-radius: 20px;
                    width: 80%;
                    padding: 5px 0;
                    background: var(--primary-color);
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                }

                .add-button:hover {
                    background: var(--primary-color-dark);
                }
            </style>
        `;
        const element: HTMLElement = html`
            <article class="box select-game-container">
                <a href="/game-info.html?id=${this._gameId}">
                    <header class="game-img"><img src="${this._image}"/></header>
                </a>
                <p class="game-title">${this._name}</p>
                <p class="game-price">€${this._price.toFixed(2)}</p>
                <button class="add-button" id="add-button-${this._gameId}">
                    Winkelmand
                </button>
            </article>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);

        const addButton: HTMLButtonElement = this.shadowRoot.querySelector(`#add-button-${this._gameId}`)!;
        addButton.addEventListener("click", () => {
            this._webshopEventService.dispatchEvent<number>(WebshopEvent.AddToCart, this._gameId);
        });
    }
}

window.customElements.define("webshop-select-game", GameSelectComponent);
