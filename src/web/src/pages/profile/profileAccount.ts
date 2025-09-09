import { profileService } from "@web/services/profileService";
import { IUser } from "@shared/types";

interface LoadingComponent extends HTMLElement {
    show(): void;
    hide(): void;
}

export class ProfileAccountComponent extends HTMLElement {
    private user: IUser | null = null;
    private loadingComponent: LoadingComponent | null = null;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        console.log("ProfileAccountComponent: connectedCallback");

        // Create loading component
        this.loadingComponent = document.createElement("webshop-loading") as LoadingComponent;

        // Show loading immediately
        this.showLoading();

        try {
            // Load user data
            await this.loadUserData();

            // Hide loading
            this.hideLoading();

            // Render the component
            this.render();
        }
        catch (error) {
            console.error("ProfileAccountComponent: Error in connectedCallback:", error);
            this.hideLoading();
            this.showErrorMessage();
        }
    }

    private showLoading(): void {
        if (this.shadowRoot && this.loadingComponent) {
            this.shadowRoot.innerHTML = "";
            this.shadowRoot.appendChild(this.loadingComponent);
            this.loadingComponent.show();
        }
    }

    private hideLoading(): void {
        if (this.loadingComponent && this.loadingComponent.parentNode) {
            this.loadingComponent.hide();
            this.loadingComponent.remove();
        }
    }

    private async loadUserData(): Promise<void> {
        console.log("ProfileAccountComponent: Loading user data...");
        this.user = await profileService.getCurrentUser();
        console.log("ProfileAccountComponent: User data loaded:", this.user);
    }

    private showErrorMessage(): void {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #dc3545;">
                    <h2>Er is een fout opgetreden</h2>
                    <p>We konden je gegevens niet laden. Probeer het later opnieuw.</p>
                    <a href="/profile" style="color: #159eff;">Terug naar dashboard</a>
                </div>
            `;
        }
    }

    private navigate(path: string): void {
        const profileContent: Element | null = this.closest(".profile-content");
        if (profileContent) {
            profileContent.dispatchEvent(new CustomEvent("profile-navigate", {
                detail: { path },
                bubbles: true,
            }));
        }
    }

    private formatDate(dateString: string | Date): string {
        const date: Date = typeof dateString === "string" ? new Date(dateString) : dateString;
        return new Intl.DateTimeFormat("nl-NL", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    }

    private render(): void {
        console.log("ProfileAccountComponent: Rendering with user:", this.user);

        if (!this.shadowRoot) {
            console.error("ProfileAccountComponent: No shadowRoot");
            return;
        }

        if (!this.user) {
            console.error("ProfileAccountComponent: No user data");
            this.showErrorMessage();
            return;
        }

        // Safely handle null values
        const firstName: string = this.user.firstName || "";
        const prefix: string = this.user.prefix || "";
        const lastName: string = this.user.lastName || "";
        const username: string = this.user.username || "";
        const email: string = this.user.email || "";
        const street: string = this.user.street || "";
        const houseNumber: string = this.user.houseNumber || "";
        const postalCode: string = this.user.postalCode || "";
        const city: string = this.user.city || "";
        const country: string = this.user.country || "";

        const fullName: string = `${firstName}${prefix ? " " + prefix : ""} ${lastName}`.trim();
        const hasAddress: boolean = street !== "" && houseNumber !== "";
        const fullAddress: string = hasAddress
            ? `${street} ${houseNumber}, ${postalCode} ${city}`.trim()
            : "Geen adres opgegeven";

        const createdDate: string = this.formatDate(this.user.created);

        // Create styles element
        const styles: HTMLElement = document.createElement("style");
        styles.textContent = `
            :host {
                display: block;
            }
            
            .account-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 1px solid #e9ecef;
            }
            
            h1 {
                color: #333;
                margin: 0;
            }
            
            .edit-button {
                padding: 10px 20px;
                background-color: #159eff;
                color: white;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                font-size: 16px;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }
            
            .edit-button:hover {
                background-color: #0078cd;
            }
            
            .info-sections {
                display: grid;
                gap: 30px;
            }
            
            .info-section {
                background-color: #f8f9fa;
                padding: 25px;
                border-radius: 15px;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .info-item {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .info-label {
                font-size: 14px;
                color: #666;
                font-weight: 500;
            }
            
            .info-value {
                font-size: 16px;
                color: #333;
            }
            
            .empty-value {
                color: #999;
                font-style: italic;
            }
            
            .icon {
                width: 20px;
                height: 20px;
                fill: #666;
            }
        `;

        // Create content element
        const content: HTMLElement = document.createElement("div");
        content.innerHTML = `
            <div class="account-header">
                <h1>Mijn Account</h1>
                <a href="/profile/account/edit" class="edit-button">Profiel bewerken</a>
            </div>
            
            <div class="info-sections">
                <div class="info-section">
                    <h2 class="section-title">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        Persoonlijke informatie
                    </h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Naam</span>
                            <span class="info-value">${fullName}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Gebruikersnaam</span>
                            <span class="info-value">${username}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">E-mailadres</span>
                            <span class="info-value">${email}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Account aangemaakt</span>
                            <span class="info-value">${createdDate}</span>
                        </div>
                    </div>
                </div>
                
                <div class="info-section">
                    <h2 class="section-title">
                        <svg class="icon" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        Adresgegevens
                    </h2>
                    <div class="info-grid">
                        <div class="info-item">
                            <span class="info-label">Adres</span>
                            <span class="info-value ${!hasAddress ? "empty-value" : ""}">${fullAddress}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Land</span>
                            <span class="info-value ${country === "" ? "empty-value" : ""}">${country || "Niet opgegeven"}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Clear shadowRoot and add elements
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(styles);
        this.shadowRoot.appendChild(content);

        // Add click handler for edit button
        const editButton: HTMLAnchorElement | null = this.shadowRoot.querySelector(".edit-button");
        if (editButton) {
            editButton.addEventListener("click", (e: Event) => {
                e.preventDefault();
                this.navigate("/profile/account/edit");
            });
        }

        console.log("ProfileAccountComponent: Render complete");
    }
}

window.customElements.define("profile-account", ProfileAccountComponent);
