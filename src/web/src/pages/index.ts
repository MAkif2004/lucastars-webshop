import "@web/components/LayoutComponent";
import "@web/components/BannerComponent";
import "@web/components/TopGamesComponent";

import { html } from "@web/helpers/webComponents";

export class IndexPageComponent extends HTMLElement {
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
                .banner-title {
                    width: 100%;
                    margin: 50px 0 0 0;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <h2 class="banner-title">Topaanbevelingen</h2>
                <webshop-banner></webshop-banner> 
                <h2>Meest verkochte games</h2>
                <webshop-top-games></webshop-top-games>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-page-index", IndexPageComponent);
