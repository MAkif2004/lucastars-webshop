import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { Game } from "@shared/types";
import { IGameService } from "@web/interfaces/IGameService";
import { GameService } from "@web/services/GameService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class BannerComponent extends HTMLElement {
    private _gameService: IGameService = new GameService();
    private currentIndex: number = 0;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        // Show temporary "loading" content
        this.shadowRoot.innerHTML = "<p>Loading featured games...</p>";

        const games: Game[] | undefined = await this._gameService.getFiveRandomGames();

        if (games.length === 0) {
            this.shadowRoot.innerHTML = "<p>No games found.</p>";
            return;
        }

        // Now continue rendering actual content after data has arrived
        const styles: HTMLElement = html`
            <style>
                :host {
                    display: block;
                    width: 100%;
                    overflow-x: hidden;
                }

                html, body {
                    max-width: 100vw;
                    overflow-x: hidden;
                }
                
                *, body {
                    margin: 0;
                    padding: 0;
                    font-family: 'Inter', sans-serif;
                }

                .banner-section {
                    margin-top: 30px;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .arrow-container {
                    position: relative;
                    width: 940px;
                    height: 353px;
                }

                .featured-games-container {
                    font-weight: bold;
                    width: 100%;
                    height: 100%;

                    justify-content: space-between;
                    box-shadow: 0px 0px 9px -4px black;
                    background: white;
                    border-radius: 30px;
                    display: none; /* hide all by default */
                }

                .arrow-right, .arrow-left {
                    position: absolute;
                    top: 35%;
                    height: 105px;
                    width: 40px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: var(--primary-color);
                    font-size: 25px;
                    cursor: pointer;
                }

                .arrow-right {
                    right: -50px;
                }

                .arrow-right:hover {
                    color: var(--primary-color-dark);
                }

                .arrow-left {
                    left: -50px;
                }

                .arrow-left:hover {
                    color: var(--primary-color-dark);
                }

                .big-picture {
                    height: 100%;
                    width: 616px;

                }

                .big-picture img {
                    width: 100%;
                    height: 100%;

                    object-fit: cover;
                    object-position: center;
                    display: block;
                    border-top-left-radius: 30px;
                    border-bottom-left-radius: 30px;
                }

                .game-details {
                    width: 324px;
                }

                .title {
                    margin: 15px 0;
                    text-align: center;
                    padding: 0 10px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .small-pictures {
                    width: 100%;
                    height: 200px;
                    display: flex;
                    flex-wrap: wrap;
                }

                .small-picture {
                    width: 45%;
                    height: 45%;
                    margin: 5px 8px;
                    position: relative;
                    background: white;
                }

                .small-picture p {
                    position: absolute;
                    background: #f07a33d9;
                    padding: 3px 11px 3px 3px;
                    color: white;
                    bottom: 0;
                    font-weight: bold;
                    border-top-right-radius: 30px;
                }

                .small-picture h5 {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .featured-games-container.active {
                    display: flex; /* show only the active one */
                }

                .small-pictures img {
                    width: 100%;
                    height: 100%;

                    object-fit: cover;
                    object-position: center;
                    display: block;
                }

                .status {
                    background: #fd911f;
                    color: white;
                    padding: 5px 10px;
                    display: inline-block;
                    margin-left: 10px;
                    font-size: 13px;
                    margin-top: 27px;
                }

                .price {
                    margin-top: 15px;
                    margin-left: 10px;
                    color: red;
                    font-weight: bold;
                }

                .buttons-container {
                    max-width: 940px;
                    width: 100%;
                    display: flex;
                    justify-content: space-evenly;
                    margin: 12px 0;
                    flex-wrap: wrap;
                }

                .scrollable-banner {
                    display: none;
                }

                @media only screen and (max-width: 1030px) {
                    .arrow-container {
                        position: relative;
                        width: 610px;
                        height: 290px;
                    }

                    .big-picture {
                        width: 434px;
                    }

                    .game-details {
                        width: 29%;
                        display: flex;
                        flex-wrap: wrap;
                    }

                    .status {
                        margin-top: 10px;
                    }

                    .game-details h2 {
                        font-size: 16px;
                        margin-top: 8px;
                    }

                    .small-pictures {
                        width: 100%;
                    }

                    .small-picture {
                        width: 86%;
                    }

                    .small-picture:first-of-type, .small-picture:last-of-type {
                        display: none;
                    }
                }
                .link-button {
                    font-size: 25px;
                    border: none;
                    background: var(--primary-color);
                    color: white;
                    padding: 5px 0;
                    border-radius: 15px;
                    font-weight: bold;
                    width: 220px;
                    margin: 10px;
                }

                .link-button:hover {
                    background: var(--primary-color-dark);
                }
            </style>
        `;

        const responsiveStyles: HTMLElement = html`
            <style>
                @media only screen and (max-width: 768px) {
                    main {
                        padding: 0;
                    }
                    .arrow-container, .buttons-container {
                        display: none;
                    }

                    .scrollable-banner {
                        display: flex !important;
                        overflow-x: auto;
                        gap: 16px;
                        padding: 16px;
                        scroll-snap-type: x mandatory;
                        width: 85vw;
                    }

                    .scrollable-card {
                        min-width: 260px;
                        flex: 0 0 auto;
                        scroll-snap-align: start;
                        background: white;
                        border-radius: 16px;
                        box-shadow: 0px 0px 9px -4px black;
                        padding: 12px;
                        color: black;
                        text-decoration: none;
                    }

                    .scrollable-card img {
                        width: 100%;
                        height: 160px;
                        object-fit: cover;
                        border-radius: 10px;
                    }

                    .scrollable-card .title {
                        margin: 10px 0 5px 0;
                        font-size: 1rem;
                        font-weight: bold;
                        text-align: center;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .scrollable-card .status {
                        background: #fd911f;
                        color: white;
                        padding: 5px 10px;
                        display: inline-block;
                        font-size: 13px;
                        border-radius: 8px;
                        margin-bottom: 5px;
                    }

                    .scrollable-card .price {
                        text-align: center;
                        font-weight: bold;
                        font-size: 1.1rem;
                    }
                }
            </style>
        `;

        const bannerGames: HTMLElement[] = [];
        for (let i: number = 0; i < 5; i++) {
            bannerGames.push(
                html`
                    <div class="featured-games-container ${i === 0 ? "active" : ""}" id="banner-${i}">
                        <a href="/game-info.html?id=${games[i].id}">
                            <div class="big-picture">
                                <img id="big-img-${i}" alt="Main Screenshot of Game"
                                     src="${games[i].thumbnail}"/>
                            </div>
                        </a>
                        <div class="game-details">
                            <h2 class="title">${games[i].name}</h2>
                            <div class="small-pictures">
                                <div class="small-picture">
                                    <img
                                        alt="Screenshot"
                                        src="${games[i].thumbnail}"
                                        data-banner-index="${i}"
                                        data-image-src="${games[i].thumbnail}"
                                        class="thumbnail"
                                    />
                                </div>
                                ${games[i].images[1]
? html`
                                    <div class="small-picture">
                                        <img
                                            alt="Screenshot"
                                            src="${games[i].images[1]}"
                                            data-banner-index="${i}"
                                            data-image-src="${games[i].images[1]}"
                                            class="thumbnail"
                                        />
                                    </div>
                                `
: ""}
                                ${games[i].images[2]
? html`
                                    <div class="small-picture">
                                        <img
                                            alt="Screenshot"
                                            src="${games[i].images[2]}"
                                            data-banner-index="${i}"
                                            data-image-src="${games[i].images[2]}"
                                            class="thumbnail"
                                        />
                                    </div>
                                `
: ""}
                                ${games[i].images[3]
? html`
                                    <div class="small-picture">
                                        <img
                                            alt="Screenshot"
                                            src="${games[i].images[3]}"
                                            data-banner-index="${i}"
                                            data-image-src="${games[i].images[3]}"
                                            class="thumbnail"
                                        />
                                    </div>
                                `
: ""}
                            </div>
                            <h3 class="status">${games[i].tags[0] ? games[i].tags[0] : "N/A"}</h3>
                            <p class="price">€${games[i].price}</p>
                        </div>
                    </div>
                `
            );
        }

        const scrollableBanner: HTMLElement = html`
            <div class="scrollable-banner">
                ${games.map(game => html`
                    <a class="scrollable-card" href="/game-info.html?id=${game.id}">
                        <img src="${game.thumbnail}" alt="${game.name}"/>
                        <div class="title">${game.name}</div>
                        <div class="status">${game.tags[0] ? game.tags[0] : "N/A"}</div>
                        <div class="price">€${game.price}</div>
                    </a>
                `)}
            </div>
        `;

        const element: HTMLElement = html`
            <section class="banner-section" id="banner-section">
                <div class="arrow-container">
                    <div class="arrow-right" id="arrow-right">&#9654;</div>
                    <div class="arrow-left" id="arrow-left">&#9664;</div>
                    ${bannerGames}
                </div>
                ${scrollableBanner}
                <div class="buttons-container">
                    <a href="/my-games.html"><button class="link-button">Mijn games</button></a>
                    <a href="/games.html"><button class="link-button">Shop nu!</button></a>
                </div>
            </section>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(responsiveStyles, styles, element);

        this.currentIndex = 0;
        const updateVisibleBanner: () => void = () => {
            for (let i: number = 0; i < 5; i++) {
                const el: HTMLElement | null = element.querySelector(`#banner-${i}`);
                if (el) {
                    el.classList.toggle("active", i === this.currentIndex);
                }
            }
        };

        this.shadowRoot.getElementById("arrow-right")?.addEventListener("click", () => {
            this.currentIndex = (this.currentIndex + 1) % 5;
            updateVisibleBanner();
        });

        this.shadowRoot.getElementById("arrow-left")?.addEventListener("click", () => {
            this.currentIndex = (this.currentIndex - 1 + 5) % 5;
            updateVisibleBanner();
        });

        this.shadowRoot.querySelectorAll(".thumbnail").forEach(img => {
            img.addEventListener("click", event => {
                event.preventDefault();
                const target: HTMLImageElement = event.currentTarget as HTMLImageElement;
                const bannerIndex: string = target.getAttribute("data-banner-index")!;
                const newSrc: string = target.getAttribute("data-image-src")!;

                const bigImg: HTMLImageElement = this.shadowRoot!.getElementById(`big-img-${bannerIndex}`) as HTMLImageElement;
                bigImg.src = newSrc;
            });
        });
    }
}

window.customElements.define("webshop-banner", BannerComponent);
