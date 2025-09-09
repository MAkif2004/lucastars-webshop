import { html } from "@web/helpers/webComponents";
import "@web/components/LinkButtonComponent";
import { CheckoutService } from "@web/services/CheckoutService";
import { PaymentReturnResponse } from "@shared/types";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class PaymentReturnComponent extends HTMLElement {
    private _checkoutService: CheckoutService = new CheckoutService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) return;

        const url: URL = new URL(window.location.href);
        const orderId: string | null = url.searchParams.get("orderId");

        if (!orderId) {
            throw new Error("orderId missing from URL");
        }

        const status: PaymentReturnResponse = await this._checkoutService.getPaymentStatus(Number(orderId));

        // need to check for all 3 status options
        let paymentMessage: string = "";
        let paymentColor: string = "";
        let href: string = "";
        let buttonText: string = "";
        if (status.status === "Paid") {
            paymentMessage = "Betaling gelukt!";
            paymentColor = "green";
            href = "/my-games.html";
            buttonText = "Mijn spellen";
        }
        else if (status.status === "Open") {
            paymentMessage = "Betaling in behandeling...";
            paymentColor = "orange";
            href = status.transactionId ? `https://psp.api.lucastars.hbo-ict.cloud/checkout/${status.transactionId}` : "/index.html";
            buttonText = "Opnieuw proberen";
        }
        else if (status.status === "Canceled") {
            paymentMessage = "Betaling mislukt. Probeer het opnieuw.";
            paymentColor = "red";
            href = "/index.html";
            buttonText = "Homepagina";
        }
        else {
            throw new Error("Onbekende payment status");
        }
        // Now continue rendering actual content after data has arrived
        const styles: HTMLElement = html`
            <style>
                section {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                }
                .payment-status-container {
                    margin-top: 80px;
                    width: 500px;
                    height: 263px;
                    box-shadow: 0px 0px 9px -4px black;
                    border-radius: 30px;
                    
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }
                
                h1 {
                    text-align: center;
                    color: ${paymentColor};
                }

                .link-button {
                    font-size: 25px;
                    border: none;
                    background: var(--primary-color);
                    text-decoration: none;
                    color: white;
                    padding: 5px 0;
                    border-radius: 15px;
                    font-weight: bold;
                    width: 220px;
                    margin: 10px;
                    text-align: center;
                    
                }

                .link-button:hover {
                    background: var(--primary-color-dark);
                }
                
            </style>
        `;

        const element: HTMLElement = html`
            <section>
                <div class="payment-status-container">
                    <h1>${paymentMessage}</h1>
                    <a href="${href}"><div class="link-button" id="my-games-button">${buttonText}</div></a>
                </div>
            </section>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-payment-return", PaymentReturnComponent);
