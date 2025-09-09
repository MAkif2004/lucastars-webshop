import "@web/components/LayoutComponent";
import "@web/components/MyGamesListComponent";
import "@web/components/AuthProviderComponent";
import { html } from "@web/helpers/webComponents";

class MyGamesPageComponent extends HTMLElement {
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
                <webshop-auth-provider>
                    <webshop-my-games-list></webshop-my-games-list>
                </webshop-auth-provider>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-my-games", MyGamesPageComponent);
