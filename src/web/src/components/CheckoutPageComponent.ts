import { CheckoutItem, Payment, PaymentResponse } from "@shared/types";
import "@web/components/CheckoutPageComponent";
import { CheckoutService } from "@web/services/CheckoutService";

export class CheckoutPageComponent extends HTMLElement {
    private _checkoutService = new CheckoutService();

    private item?: CheckoutItem;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        try {
            this.item = await this._checkoutService.getCheckoutData();
            console.log(this.item);
        }
        catch (error) {
            console.error("Fout bij ophalen van checkoutgegevens:", error);
        }

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) return;
        if (!this.item) return;

        this.shadowRoot.innerHTML = "";

        const container: HTMLElement = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "2rem";

        // Professioneel gestylede invoervelden voor bezorgadres
        const userInfo: HTMLElement = document.createElement("div");
        userInfo.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="/images/icons/account-outline.svg" alt="User Icon" />
                <h2>Bezorginformatie</h2>
            </div>
            <form id="address-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 2;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Straat
                            <input 
                                type="text" 
                                name="street" 
                                value="${this.item.street ?? ""}" 
                                placeholder="Straatnaam" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                    <div style="flex: 1;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Huisnummer
                            <input 
                                type="text" 
                                name="houseNumber" 
                                value="${this.item.houseNumber ?? ""}" 
                                placeholder="Nr." 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                </div>
                <div style="display: flex; gap: 1rem;">
                    <div style="flex: 1;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Postcode
                            <input 
                                type="text" 
                                name="postalCode" 
                                value="${this.item.postalCode ?? ""}" 
                                placeholder="1234 AB" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                    <div style="flex: 2;">
                        <label style="display: flex; flex-direction: column; font-weight: 500;">
                            Stad
                            <input 
                                type="text" 
                                name="city" 
                                value="${this.item.city ?? ""}" 
                                placeholder="Plaatsnaam" 
                                required 
                                style="padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;"
                            />
                        </label>
                    </div>
                </div>
                <p style="margin-top: 1rem;"><strong>Totaal:</strong> <span style= "color: red;">€${this.item.totalPrice.toFixed(2)}</span></p>
            </form>
        `;
        const payment: HTMLElement = document.createElement("div");
        payment.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="/images/icons/payment.svg" alt="User Icon" />
                <h2>Betaalmethode</h2>
            </div>
            <form id="payment-form" style="display: flex; flex-direction: column; gap: 1rem;">
                <label><input type="radio" name="payment" value="ideal" checked /> iDEAL</label>
                <label><input type="radio" name="payment" value="creditcard" /> Creditcard</label>
                <label><input type="radio" name="payment" value="paypal" /> PayPal</label>
            </form>
        `;

        const submitButton: HTMLElement = document.createElement("button");
        submitButton.textContent = "Bestelling plaatsen";
        submitButton.style.padding = "0.75rem";
        submitButton.style.backgroundColor = "var(--primary-color)";
        submitButton.style.color = "white";
        submitButton.style.border = "none";
        submitButton.style.borderRadius = "8px";
        submitButton.style.fontSize = "1rem";
        submitButton.style.cursor = "pointer";
        submitButton.onclick = async () => {
            // Haal adresgegevens op uit het formulier
            const addressForm: HTMLFormElement | null | undefined = this.shadowRoot?.querySelector<HTMLFormElement>("#address-form");
            if (addressForm) {
                const formData: FormData = new FormData(addressForm);
                const street: string = formData.get("street") as string;
                const houseNumber: string = formData.get("houseNumber") as string;
                const postalCode: string = formData.get("postalCode") as string;
                const city: string = formData.get("city") as string;

                if (!street || !houseNumber || !postalCode || !city) {
                    alert("Vul alle velden in.");
                    return;
                }
                const data: CheckoutItem = {
                    orderId: null,
                    street: street,
                    houseNumber: houseNumber,
                    postalCode: postalCode,
                    city: city,
                    totalPrice: Number(localStorage.getItem("cart-total")) || 0,
                };
                console.log(data);
                const result: CheckoutItem = await this._checkoutService.submitCheckout(data);
                const data2: Payment = {
                    orderId: result.orderId ?? 0,
                    value: this.item?.totalPrice ?? 0,
                };
                const transactionId: PaymentResponse = await this._checkoutService.createPayment(data2);
                console.log(transactionId.transactionId);
                location.href = `https://psp.api.lucastars.hbo-ict.cloud/checkout/${transactionId.transactionId}`;
            }
            else {
                alert("Vul het adres in.");
            }
        };

        container.appendChild(userInfo);
        container.appendChild(payment);
        container.appendChild(submitButton);

        this.shadowRoot.appendChild(container);
    }
}

window.customElements.define("webshop-checkoutpage", CheckoutPageComponent);
