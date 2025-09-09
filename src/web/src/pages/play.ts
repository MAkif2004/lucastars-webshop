import "@web/components/LayoutComponent";
import "@web/components/GameListComponent";
import "@web/components/AuthProviderComponent";
import { html } from "@web/helpers/webComponents";
import { Game } from "@shared/types";
import { GameService } from "@web/services/GameService";
import { authService } from "@web/services/AuthService";

class PlayPageComponent extends HTMLElement {
    private _gameService: GameService = new GameService();
    private _gameId: number = 0;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
        const gameId: string | null = urlParams.get("id");

        if (gameId) {
            this._gameId = Number(gameId);
        }

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const isLoggedIn: boolean = await authService.isLoggedIn();
        if (!isLoggedIn) {
            const element: HTMLElement = html`
                <webshop-layout>
                    <webshop-auth-provider>
                    </webshop-auth-provider>
                </webshop-layout>
            `;

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(element);
            return;
        }

        const games: Game[] = await this._gameService.getOwnedGames(this._gameId);
        const game: Game | undefined = games.at(0);

        if (!game) {
            const element: HTMLElement = html`
                <webshop-layout>
                    <webshop-auth-provider>
                        <p>Je hebt deze game nog niet gekocht! We zullen je na 5 seconden doorverwijzen naar de spel pagina.</p>
                        <p>Als je niet automatisch wordt doorgestuurd, klik dan <a href="/game-info.html?id=${this._gameId}">hier</a>.</p>
                    </webshop-auth-provider>
                </webshop-layout>
            `;

            setTimeout(() => {
                window.location.href = `/game-info.html?id=${this._gameId}`;
            }, 5000);

            this.shadowRoot.firstChild?.remove();
            this.shadowRoot.append(element);
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .fullscreen-button {
                    font-family: "Inter";
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 16px;
                }

                .fullscreen-button:hover {
                    background-color: var(--primary-color-dark);
                }

                .game-container {
                    margin: auto;
                    width: 800px;
                    height: 600px;
                }

                .game {
                    border: none;
                    width: 100%;
                    height: 100%;
                }
            </style>
        `;

        const gameContainer: HTMLIFrameElement = html`
            <div class="game-container">
                <iframe src="${game.url!}" class="game" allow="fullscreen"></iframe>
            </div>
        ` as HTMLIFrameElement;

        const fullscreenButton: HTMLElement = html`
            <button class="fullscreen-button">
                <img src="images/icons/fullscreen.svg" alt="Fullscreen icon" />
                <span>Volledig scherm</span>
            </button>
        `;

        fullscreenButton.addEventListener("click", async () => {
            await gameContainer.requestFullscreen();
        });

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-auth-provider>
                    <div class="header">
                        <h1>${game.name}</h1>
                        ${fullscreenButton}
                    </div>

                    ${gameContainer}
                </webshop-auth-provider>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-play", PlayPageComponent);
