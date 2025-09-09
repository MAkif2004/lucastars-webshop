import "@web/components/LayoutComponent";
import "@web/components/LoadingComponent";
import "@web/pages/profile/profileWelcome";
import "@web/pages/profile/profileAccount";
import "@web/pages/profile/profileAccountEdit";
import { html } from "@web/helpers/webComponents";
import { profileService } from "@web/services/profileService";

interface Route {
    path: string;
    component: string;
    title?: string;
}

class ProfilePageComponent extends HTMLElement {
    private readonly routes: Route[] = [
        { path: "/profile", component: "profile-welcome", title: "Welkom" },
        { path: "/profile/account", component: "profile-account", title: "Account" },
        { path: "/profile/account/edit", component: "profile-account-edit", title: "Account Bewerken" },
    ];

    private currentRoute: string = "";
    private isLoggingOut: boolean = false;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // Listen for popstate events (browser back/forward)
        window.addEventListener("popstate", this.handleRouteChange.bind(this));

        // Handle initial route
        this.handleRouteChange();
    }

    public disconnectedCallback(): void {
        window.removeEventListener("popstate", this.handleRouteChange.bind(this));
    }

    private handleRouteChange(): void {
        const path: string = window.location.pathname;
        const route: Route | undefined = this.findMatchingRoute(path);

        if (!route) {
            // Default to welcome page
            this.navigate("/profile");
            return;
        }

        if (this.currentRoute === route.path) {
            return;
        }

        this.currentRoute = route.path;
        this.render(route);
    }

    private findMatchingRoute(path: string): Route | undefined {
        // Exact match first
        let route: Route | undefined = this.routes.find(r => r.path === path);

        // If no exact match, try to find the closest parent route
        if (!route && path.startsWith("/profile")) {
            const segments: string[] = path.split("/");
            while (segments.length > 2 && !route) {
                segments.pop();
                const parentPath: string = segments.join("/");
                route = this.routes.find(r => r.path === parentPath);
            }
        }

        return route;
    }

    public navigate(path: string): void {
        window.history.pushState({}, "", path);
        this.handleRouteChange();
    }

    private async handleLogout(): Promise<void> {
        if (this.isLoggingOut) {
            return;
        }

        this.isLoggingOut = true;
        this.updateLogoutButton();

        try {
            await profileService.logout();
        }
        catch (error: unknown) {
            console.error("Error during logout:", error);
            // ProfileService already handles redirect even on error
        }
        finally {
            this.isLoggingOut = false;
        }
    }

    private updateLogoutButton(): void {
        const logoutButton: HTMLButtonElement | null = this.shadowRoot?.querySelector(".logout-button") as HTMLButtonElement | null;
        if (logoutButton) {
            logoutButton.disabled = this.isLoggingOut;
            logoutButton.textContent = this.isLoggingOut ? "Uitloggen..." : "Uitloggen";
        }
    }

    private render(route: Route): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .profile-container {
                    display: flex;
                    max-width: 1400px;
                    margin: 0 auto;
                    gap: 30px;
                    padding: 0 20px;
                }
                
                .profile-sidebar {
                    width: 280px;
                    background-color: #f8f9fa;
                    border-radius: 15px;
                    padding: 25px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    height: fit-content;
                    position: sticky;
                    top: 20px;
                }
                
                .profile-content {
                    flex: 1;
                    background-color: #ffffff;
                    border-radius: 15px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    min-height: calc(100vh - 200px);
                }
                
                .sidebar-nav {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .sidebar-nav li {
                    margin-bottom: 12px;
                }
                
                .sidebar-nav a {
                    display: block;
                    padding: 12px 18px;
                    text-decoration: none;
                    color: #333;
                    border-radius: 10px;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }
                
                .sidebar-nav a:hover {
                    background-color: #e9ecef;
                    transform: translateX(3px);
                }
                
                .sidebar-nav a.active {
                    background-color: #159eff;
                    color: white;
                    box-shadow: 0 4px 12px rgba(21, 158, 255, 0.3);
                }
                
                .logout-section {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #e9ecef;
                }
                
                .logout-button {
                    width: 100%;
                    padding: 12px 18px;
                    background-color: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                }
                
                .logout-button:hover:not(:disabled) {
                    background-color: #c82333;
                    transform: translateY(-1px);
                }
                
                .logout-button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    transform: none;
                }
                
                @media (max-width: 768px) {
                    .profile-container {
                        flex-direction: column;
                        padding: 0 15px;
                    }
                    
                    .profile-sidebar {
                        width: 100%;
                        position: static;
                    }
                    
                    .profile-content {
                        padding: 20px;
                        min-height: auto;
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <webshop-layout>
                <div class="profile-container">
                    <aside class="profile-sidebar">
                        <nav>
                            <ul class="sidebar-nav">
                                <li><a href="/profile" class="${this.currentRoute === "/profile" ? "active" : ""}">Dashboard</a></li>
                                <li><a href="/profile/account" class="${this.currentRoute === "/profile/account" || this.currentRoute === "/profile/account/edit" ? "active" : ""}">Mijn Account</a></li>
                            </ul>
                        </nav>
                        
                        <div class="logout-section">
                            <button class="logout-button">Uitloggen</button>
                        </div>
                    </aside>
                    <main class="profile-content">
                        <${route.component}></${route.component}>
                    </main>
                </div>
            </webshop-layout>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        // Add click handlers to navigation links
        this.shadowRoot.querySelectorAll(".sidebar-nav a").forEach((link: Element) => {
            link.addEventListener("click", (e: Event) => {
                e.preventDefault();
                const href: string | null = (e.target as HTMLAnchorElement).getAttribute("href");
                if (href) {
                    this.navigate(href);
                }
            });
        });

        // Add click handler for logout button and set initial state
        const logoutButton: HTMLButtonElement | null = this.shadowRoot.querySelector(".logout-button");
        if (logoutButton) {
            // Set initial state
            logoutButton.disabled = this.isLoggingOut;
            logoutButton.textContent = this.isLoggingOut ? "Uitloggen..." : "Uitloggen";

            logoutButton.addEventListener("click", () => {
                void this.handleLogout();
            });
        }

        // Expose navigate method to child components
        const profileContent: Element | null = this.shadowRoot.querySelector(".profile-content");
        if (profileContent) {
            // Custom event to allow child components to navigate
            profileContent.addEventListener("profile-navigate", (e: Event) => {
                const customEvent: CustomEvent<{ path: string }> = e as CustomEvent<{ path: string }>;
                this.navigate(customEvent.detail.path);
            });
        }
    }
}

window.customElements.define("webshop-page-profile", ProfilePageComponent);
