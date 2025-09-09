import "@web/components/LayoutComponent";
import "@web/components/GameInfoComponent";
import { html } from "@web/helpers/webComponents";

class GameInfoPageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-game-info></webshop-game-info>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-game-info", GameInfoPageComponent);
