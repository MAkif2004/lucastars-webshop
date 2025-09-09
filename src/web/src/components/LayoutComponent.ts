import "@web/components/HeaderComponent";
import "@web/components/FooterComponent";
import { html } from "@web/helpers/webComponents";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { CartService } from "@web/services/CartService";
import { ICartService } from "@web/interfaces/ICartService";
import { ICartResponse } from "@shared/types";

/**
 * This component is the main layout for the webshop.
 * It contains the header, footer and a slot for the main content.
 */
export class LayoutComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();
    private _cartService: ICartService = new CartService();

    private _notificationContainer: HTMLElement | null = null;

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
                div.wrapper {
                    display: flex;
                    flex-direction: column;
                    min-height: 100dvh;
                    width: 100%;
                    box-sizing: border-box;
                }
                
                main {
                    display: flex;
                    flex-grow: 1;
                    max-width: var(--max-width);
                    width: 100%;
                    padding: 0 1em;
                    margin: 0 auto;
                    box-sizing: border-box;
                }

                slot {
                    flex-grow: 1;
                    display: block;
                }

                #notifications-container {
                    display: none;
                    width: 100%;
                    height: 100vh;
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1;
                    pointer-events: none;
                    justify-content: end;
                }

                .notification {
                    transition: 0.3s;
                    height: 50px;
                    padding: 0 20px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    font-weight: bold;
                    border-radius: 15px;
                    position: relative;
                    top: 68px;
                }
            </style>
        `;

        this._notificationContainer = html`
            <div id="notifications-container">
                <div class="notification"></div>
            </div>
        `;

        const element: HTMLElement = html`
            <div class="wrapper">
                <webshop-header></webshop-header>

                <main>
                    ${this._notificationContainer}
                    <slot></slot>
                </main>

                <webshop-footer></webshop-footer>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);

        // Cart event listener
        this._webshopEventService.addEventListener(WebshopEvent.AddToCart, async (gameId: number) => {
            const cartResponse: ICartResponse = await this._cartService.createCart({
                gameId: gameId,
                quantity: 1,
                userId: 0,
                thumbnail: "",
                name: "",
                description: "",
                price: 0,
            });

            if (cartResponse.success) {
                this.showNotification(
                    "Toegevoegd aan de winkelmand",
                    "success"
                );
            }
            else {
                this.showNotification(
                    "Je bent niet ingelogd",
                    "warning"
                );
            }
        });
    }

    public showNotification(message: string, type: "success" | "warning" | "error"): void {
        if (!this._notificationContainer) {
            return;
        }

        const notification: HTMLElement = this._notificationContainer.querySelector(".notification")!;

        console.log(notification, this._notificationContainer);

        // Reset position & show container
        notification.style.right = "-200px";
        this._notificationContainer.style.display = "flex";

        // Slide in after a tiny delay to trigger CSS transition
        setTimeout(() => {
            notification.style.right = "18px";
        }, 20);

        // Set message and background color
        notification.innerHTML = message;
        switch (type) {
            case "success":
                notification.style.backgroundColor = "#159eff";
                break;
            case "warning":
                notification.style.backgroundColor = "orange";
                break;
            case "error":
                notification.style.backgroundColor = "red";
                break;
        }

        // Auto-hide after 4 seconds
        setTimeout(() => {
            notification.style.right = "-400px";

            setTimeout(() => {
                this._notificationContainer!.style.display = "none";
            }, 300);
        }, 2000);
    }
}

window.customElements.define("webshop-layout", LayoutComponent);
