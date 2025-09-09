import { html } from "@web/helpers/webComponents";

/**
 * This component displays detailed game information in a modal dialog.
 */
export class GameInfoModalComponent extends HTMLElement {
    private _modal: HTMLDialogElement = document.createElement("dialog");

    private _name: string = "";
    private _description: string = "";
    private _image: string = "";
    private _url: string = "";

    public connectedCallback(): void {
        this._name = this.getAttribute("name") ?? "";
        this._description = this.getAttribute("description") ?? "";
        this._image = this.getAttribute("image") ?? "";
        this._url = this.getAttribute("url") ?? "";

        const shadowRoot: ShadowRoot = this.attachShadow({ mode: "open" });
        shadowRoot.append(this._modal);

        this._modal.addEventListener("click", (event: MouseEvent) => {
            const target: HTMLElement = event.target as HTMLElement;
            if (target === this._modal || target.id === "close-button") {
                this.closeModal();
            }
        });
    }

    public showModal(): void {
        this.render();
        this._modal.showModal();
    }

    public closeModal(): void {
        this._modal.close();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                dialog {
                    padding: 0;
                    border: none;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    max-width: 600px;
                    width: 90%;
                }

                dialog::backdrop {
                    background: rgba(0, 0, 0, 0.5);
                }

                .game-info-modal {
                    padding: 20px;
                }

                header h1 {
                    margin: 0 0 20px 0;
                    color: #333;
                    text-align: center;
                }

                img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                }

                p {
                    line-height: 1.5;
                    color: #666;
                }

                .description {
                    margin: 20px 0;
                }

                button, a {
                    padding: 10px 20px;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    font-size: 13px;
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                }

                .button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }

                #close-button {
                    background: #159eff;
                }

                #close-button:hover {
                    background: #138be1;
                }

                #play-button {
                    background: #28a745;
                }

                #play-button:hover {
                    background: #218838;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="game-info-modal">
                <header>
                    <h1>${this._name}</h1>
                </header>
                <main>
                    <img src="${this._image}" alt="${this._name}">
                    <div class="description">
                        ${this._description}
                    </div>

                    <div class="button-container">
                        <button id="close-button">Sluiten</button>
                        <a href="${this._url}" id="play-button">Spelen</a>
                    </div>
                </main>
            </div>
        `;

        this._modal.innerHTML = "";
        this._modal.append(styles, element);
    }
}

window.customElements.define("game-info-modal", GameInfoModalComponent);
