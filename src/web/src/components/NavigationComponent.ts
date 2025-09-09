import { html } from "@web/helpers/webComponents";
import { authService } from "@web/services/AuthService";

/**
 * This component is used to display the navigation bar.
 *
 * @remarks On mobile, the navigation bar will be offset by `var(--header-height)` from the top of the page.
 */
export class NavigationComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const isLoggedIn: boolean = await authService.isLoggedIn();

        const styles: HTMLElement = html`
            <style>
                nav {
                    display: flex;
                    gap: 16px;
                }

                nav a {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 10px 0;
                    text-decoration: none;
                    color: black;
                    text-decoration: none;
                    position: relative;
                    transition: all 0.3s ease;
                    transform: translateY(-3px);
                }

                nav a:hover {
                    transform: translateY(-3px);
                }

                nav a::before{
                    content: "";
                    position: absolute;
                    z-index: -1;
                    bottom: -1px;
                    left: 0;
                    right: 0;
                    height: 5px;
                    background-color: #d6d6d6;
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.3s ease;
                }

                a:hover::before {
                    transform: scaleY(1);
                }

                nav img {
                    height: 24px;
                    width: 24px;
                    user-select: none;
                }

                .dropbtn {
                    padding: 16px;
                    font-size: 16px;
                    border: none;
                    cursor: pointer;
                    background-color: transparent;
                }

                .dropbtn:hover {
                    background-color: #d6d6d6;
                }

                .dropdown {
                    position: relative;
                    display: inline-block;
                }

                .dropdown-content {
                    display: none;
                    position: absolute;
                    background-color: #f9f9f9;
                    min-width: 160px;
                    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
                    z-index: 1;
                }

                .dropdown-content a {
                    color: black;
                    padding: 12px 16px;
                    text-decoration: none;
                    display: block;
                }

                .dropdown-content a:hover {
                    background-color: #d2d2d2
                }

                .dropdown:hover .dropdown-content {
                    display: block;
                }


                .hamburger {
                    display: none;
                    cursor: pointer;
                    padding: 10px;
                }

                .hamburger img {
                    vertical-align: middle;
                }

                @media (max-width: 768px) {
                    nav {
                        display: none;
                    }

                    nav.active {
                        position: absolute;
                        top: var(--header-height);
                        left: 0;
                        display: flex;
                        flex-direction: column;
                        background-color: white;
                        width: 100%;
                        box-sizing: border-box;
                        padding: 10px;
                        border-top: 1px solid var(--border-color);
                        border-bottom: 1px solid var(--border-color);
                    }

                    .hamburger {
                        display: block;
                    }
                }
            </style>
        `;

        const hamburgerButton: HTMLElement = html`
            <div class="hamburger">
                <img src="/images/icons/hamburger-menu.svg" alt="Hamburger icon" />
            </div>
        `;

        const navigation: HTMLElement = html`
            <nav>
                <a href="/games.html">
                    <img src="/images/icons/gamepad.svg" alt="Gamepad icon" />
                    <span>Spellen</span>
                </a>

                <a href="/cart.html">
                    <img src="/images/icons/cart.svg" alt="Cart icon" />
                    <span>Winkelmand</span>
                </a>

                <div class ="dropdown">
                    <button class ="dropbtn">
                        <img src="/images/icons/account.svg" />
                    </button>
                    <div class ="dropdown-content">
                        ${!isLoggedIn
? `
                            <a href="/login.html">Inloggen</a>
                            <a href="/register.html">Registreren</a>
                        `
: `
                            <a href="/profile.html">Account</a>
                            <a href="/my-games.html">Mijn spellen</a>
                        `}
                    </div>
                </div>
            </nav>
        `;

        hamburgerButton.addEventListener("click", () => {
            navigation.classList.toggle("active");
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, navigation, hamburgerButton);
    }
}

window.customElements.define("webshop-navigation", NavigationComponent);
