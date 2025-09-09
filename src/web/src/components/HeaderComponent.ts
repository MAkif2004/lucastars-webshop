import "@web/components/SearchBarComponent";
import { html } from "@web/helpers/webComponents";

/**
 * This component is used to display the header of the webshop.
 * It contains the logo and the navigation bar.
 */
export class HeaderComponent extends HTMLElement {
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
                header {
                    height: var(--header-height);
                    background-color: var(--header-background-color);
                    border-bottom: 1px solid var(--border-color);
                }

                div.wrapper {
                    max-width: var(--max-width);
                    width: 100%;
                    height: 100%;
                    padding: 0 1em;
                    margin: 0 auto;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-sizing: border-box;
                }

                div.wrapper > div {
                    height: 100%;
                }

                header img {
                    box-sizing: border-box;
                    height: 100%;
                    padding: 5px 0;
                }

                .logo-container {
                    display: flex;
                    gap: 32px;
                }

                .search-bar-container {
                    display: flex;
                    align-items: center;
                    width: 100%;
                }
            </style>
        `;

        const element: HTMLElement = html`
            <header>
                <div class="wrapper">
                    <div class="logo-container">
                        <a href="/index.html">
                            <img src="/images/logo.png" alt="LucaStars Logo" />
                        </a>
                        <div class="search-bar-container">
                            <webshop-search-bar></webshop-search-bar>
                        </div>
                    </div>
                    <webshop-navigation></webshop-navigation>
                </div>
            </header>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-header", HeaderComponent);
