import "@web/components/LayoutComponent";
import "@web/components/GameListComponent";
import "@web/components/FilterControlsComponent";
import "@web/components/SortingControlsComponent";
import { html } from "@web/helpers/webComponents";

class GamesPageComponent extends HTMLElement {
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
                .games-container {
                    display: flex;
                    gap: 40px;
                }

                .games-container > div {
                    flex: 1;
                }

                webshop-filter-controls {
                    max-width: 250px;
                }

                @media (max-width: 768px) {
                    .games-container {
                        flex-direction: column;
                    }

                    webshop-filter-controls {
                        max-width: 100%;
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <h1>All onze games!</h1>

                <div class="games-container">
                    <webshop-filter-controls></webshop-filter-controls>
                    <div>
                        <webshop-sorting-controls></webshop-sorting-controls>
                        <webshop-list-games></webshop-list-games>
                    </div>
                </div>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-games", GamesPageComponent);
