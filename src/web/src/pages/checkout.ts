import "@web/components/LayoutComponent";

import "@web/components/CheckoutPageComponent";
import { html } from "@web/helpers/webComponents";

class CheckoutPageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;

        const element: HTMLElement = html`
            <webshop-layout>
                <webshop-checkoutpage></webshop-checkoutpage>
            </webshop-layout>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(element);
    }
}

window.customElements.define("webshop-checkout-page", CheckoutPageComponent);
