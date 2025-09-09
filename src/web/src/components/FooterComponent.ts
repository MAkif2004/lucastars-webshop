import "@web/components/NavigationComponent";
import { html } from "@web/helpers/webComponents";

/**
 * This component is the footer for the webshop.
 */
export class FooterComponent extends HTMLElement {
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
                footer {
                    background-color: var(--footer-background-color);
                    border-top: 1px solid var(--border-color);
                    text-align: center;
                    height: var(--footer-height);
                }

                div.wrapper {
                    max-width: var(--max-width);
                    width: 100%;
                    height: 100%;
                    margin: 0 auto;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <footer>
                <div class="wrapper">
                    <span>&copy; 2025 LucaStars</span>
                </div>
            </footer>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-footer", FooterComponent);
