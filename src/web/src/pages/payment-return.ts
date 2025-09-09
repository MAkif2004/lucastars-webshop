import "@web/components/LayoutComponent";
import "@web/components/MyGamesListComponent";
import "@web/components/AuthProviderComponent";
import "@web/components/PaymentReturnComponent";
import { html } from "@web/helpers/webComponents";

class paymentReturnPageComponent extends HTMLElement {
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
                <webshop-payment-return>
                </webshop-payment-return>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-payment-return", paymentReturnPageComponent);
