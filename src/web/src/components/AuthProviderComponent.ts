import "@web/components/HeaderComponent";
import "@web/components/FooterComponent";
import { html } from "@web/helpers/webComponents";
import { authService } from "@web/services/AuthService";

export class AuthProviderComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        authService.isLoggedIn()
            .then((isLoggedIn: boolean) => {
                if (isLoggedIn && !this.hasAttribute("not-logged-in")) {
                    this.render();
                }
                else {
                    this.renderNotLoggedIn();
                }
            })
            .catch(() => {
                this.renderNotLoggedIn();
            });
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <slot></slot>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }

    private renderNotLoggedIn(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                    }

                    .not-logged-in {
                        text-align: center;
                        margin: 20px 0;
                        font-size: 18px;
                    }

                    .not-logged-in a {
                        color: #007bff;
                        text-decoration: none;
                    }

                    .not-logged-in a:hover {
                        text-decoration: underline;
                    }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="not-logged-in">
                <p>Je bent niet ingelogd. Log in om toegang te krijgen tot deze pagina.</p>
                <a href="/login.html">Inloggen</a>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }
}

window.customElements.define("webshop-auth-provider", AuthProviderComponent);
