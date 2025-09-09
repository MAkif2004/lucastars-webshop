import { html } from "@web/helpers/webComponents";
import "@web/components/GameInfoModalComponent";
import { GameInfoModalComponent } from "@web/components/GameInfoModalComponent";

/**
 * This component represents a single game card in the my games page.
 */
export class MyGameComponent extends HTMLElement {
    private _gameId: string = "";
    private _name: string = "";
    private _description: string = "";
    private _image: string = "";

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this._gameId = this.getAttribute("gameId") ?? "";
        this._name = this.getAttribute("name") ?? "";
        this._description = this.getAttribute("description") ?? "";
        this._image = this.getAttribute("image") ?? "";
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .game-card {
                    box-shadow: 0px 0px 9px -4px black;
                    height: 300px;
                    border-radius: 25px;
                    display: flex;
                    flex-direction: column;
                }

                .game-card main {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    margin: 10px;
                    flex-grow: 1;
                }
                
                a {
                    text-decoration: none;
                    color: black;
                }

                .game-card header {
                    height: 200px;
                    width: 100%;
                    overflow: hidden;
                    border-top-right-radius: 25px;
                    border-top-left-radius: 25px;
                    position: relative;
                }

                .game-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                }

                .game-title, .game-price {
                    margin: 0;
                    justify-content: center;
                    font-size: 18px;
                    font-weight: bold;
                    align-items: center;
                }
                
                .game-title {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 85%;
                    text-align: center;
                    margin: 10px auto;
                }

                .play-button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 20px;
                    border: none;
                    border-radius: 20px;
                    width: 100%;
                    padding: 5px 0;
                    background: #159eff;
                    color: white;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                    user-select: none;
                }

                .play-button:hover {
                    background: #138be1;
                }

                .info-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: white;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    padding: 3px;
                }

                .info-button:hover {
                    background: #f0f0f0;
                }

                .info-button img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    object-position: center;
                    display: block;
                }
            </style>
        `;

        const infoButton: HTMLElement = html`
            <button class="info-button">
                <img src="/images/icons/eye.svg" alt="Info" />
            </button>
        `;

        const playUrl: string = `/play.html?id=${this._gameId}`;

        const infoModal: GameInfoModalComponent = document.createElement("game-info-modal") as GameInfoModalComponent;
        infoModal.setAttribute("name", this._name);
        infoModal.setAttribute("image", this._image);
        infoModal.setAttribute("description", this._description);
        infoModal.setAttribute("url", playUrl);

        infoButton.addEventListener("click", () => {
            infoModal.showModal();
        });

        const element: HTMLElement = html`
                <article class="game-card">
                    <header>
                        <img src="${this._image}" class="game-image" />

                        ${infoButton}
                    </header>
                    <main>
                        <p class="game-title">${this._name}</p>
                        <a href="${playUrl}" class="play-button" >
                            Speel
                        </a>
                    </main>
                </article>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element, infoModal);
    }
}

window.customElements.define("webshop-my-game", MyGameComponent);
