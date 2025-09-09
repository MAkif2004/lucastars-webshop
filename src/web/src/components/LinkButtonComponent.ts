import { html } from "@web/helpers/webComponents";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class LinkButtonComponent extends HTMLElement {
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
                .link-button {
                    font-size: 25px;
                    border: none;
                    background: var(--primary-color);
                    color: white;
                    padding: 5px 0;
                    border-radius: 15px;
                    font-weight: bold;
                    width: 220px;
                    margin: 10px;
                }
                
                .link-button:hover {
                    background: var(--primary-color-dark);
                }
            </style>
        `;

        const element: HTMLElement = html`
            <a href="/games.html"><button class="link-button"><slot></slot></button></a>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-link-button", LinkButtonComponent);
