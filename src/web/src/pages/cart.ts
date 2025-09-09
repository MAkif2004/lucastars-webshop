// src/pages/cart.ts
import "@web/components/LayoutComponent";
import "@web/components/CartPageComponent";
import "@web/components/AuthProviderComponent";
import { html } from "@web/helpers/webComponents";

class CartPageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-auth-provider>
                    <webshop-cartpage></webshop-cartpage>
                </webshop-auth-provider>
            </webshop-layout>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
    }
}

window.customElements.define("webshop-page-cart", CartPageComponent);
