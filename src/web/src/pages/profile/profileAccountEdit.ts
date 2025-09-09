// src/pages/profile/profileAccountEdit.ts (Fixed)
import { profileService } from "@web/services/profileService";
import { IUser } from "@shared/types";

interface LoadingComponent extends HTMLElement {
    show(): void;
    hide(): void;
}

export class ProfileAccountEditComponent extends HTMLElement {
    private user: IUser | null = null;
    private loadingComponent: LoadingComponent | null = null;
    private isSubmitting: boolean = false;

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });
        console.log("ProfileAccountEditComponent: connectedCallback");

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
            console.error("ProfileAccountEditComponent: Error in connectedCallback:", error);
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
        console.log("ProfileAccountEditComponent: Loading user data...");
        this.user = await profileService.getCurrentUser();
        console.log("ProfileAccountEditComponent: User data loaded:", this.user);
    }

    private showErrorMessage(): void {
        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #dc3545;">
                    <h2>Er is een fout opgetreden</h2>
                    <p>We konden je gegevens niet laden. Probeer het later opnieuw.</p>
                    <a href="/profile/account" style="color: #159eff;">Terug naar account</a>
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

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();
        console.log("ProfileAccountEditComponent: Form submitted");

        if (this.isSubmitting || !this.user) {
            return;
        }

        this.isSubmitting = true;
        this.updateSubmitButton();

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const formData: FormData = new FormData(form);

        const updateData: Partial<IUser> = {
            firstName: formData.get("firstName") as string,
            prefix: (formData.get("prefix") as string) || undefined,
            lastName: formData.get("lastName") as string,
            street: (formData.get("street") as string) || undefined,
            houseNumber: (formData.get("houseNumber") as string) || undefined,
            postalCode: (formData.get("postalCode") as string) || undefined,
            city: (formData.get("city") as string) || undefined,
            country: (formData.get("country") as string) || undefined,
        };

        console.log("ProfileAccountEditComponent: Update data:", updateData);

        try {
            await profileService.updateProfile(this.user.id, updateData);
            this.showSuccessMessage();

            // Navigate back after a delay
            setTimeout(() => {
                this.navigate("/profile/account");
            }, 2000);
        }
        catch (error: unknown) {
            console.error("ProfileAccountEditComponent: Failed to update profile:", error);
            this.showUpdateError();
        }
        finally {
            this.isSubmitting = false;
            this.updateSubmitButton();
        }
    }

    private updateSubmitButton(): void {
        const submitButton: HTMLButtonElement | null = this.shadowRoot?.querySelector(".submit-button") as HTMLButtonElement | null;
        if (submitButton) {
            submitButton.disabled = this.isSubmitting;
            submitButton.textContent = this.isSubmitting ? "Bezig met opslaan..." : "Opslaan";
        }
    }

    private showSuccessMessage(): void {
        const messageDiv: HTMLElement | null = this.shadowRoot?.querySelector(".message") as HTMLElement | null;
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div style="padding: 15px; background-color: #d4edda; color: #155724; border-radius: 10px; margin-bottom: 20px;">
                    <strong>Succes!</strong> Je profiel is bijgewerkt. Je wordt teruggeleid naar je account...
                </div>
            `;
        }
    }

    private showUpdateError(): void {
        const messageDiv: HTMLElement | null = this.shadowRoot?.querySelector(".message") as HTMLElement | null;
        if (messageDiv) {
            messageDiv.innerHTML = `
                <div style="padding: 15px; background-color: #f8d7da; color: #721c24; border-radius: 10px; margin-bottom: 20px;">
                    <strong>Fout!</strong> Er ging iets mis bij het bijwerken van je profiel. Probeer het opnieuw.
                </div>
            `;
        }
    }

    private render(): void {
        console.log("ProfileAccountEditComponent: Rendering with user:", this.user);

        if (!this.shadowRoot) {
            console.error("ProfileAccountEditComponent: No shadowRoot");
            return;
        }

        if (!this.user) {
            console.error("ProfileAccountEditComponent: No user data");
            this.showErrorMessage();
            return;
        }

        // Safely handle null values
        const firstName: string = this.user.firstName || "";
        const prefix: string = this.user.prefix || "";
        const lastName: string = this.user.lastName || "";
        const street: string = this.user.street || "";
        const houseNumber: string = this.user.houseNumber || "";
        const postalCode: string = this.user.postalCode || "";
        const city: string = this.user.city || "";
        const country: string = this.user.country || "";

        // Create styles element
        const styles: HTMLElement = document.createElement("style");
        styles.textContent = `
            :host {
                display: block;
            }
            
            .edit-header {
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
            
            .back-button {
                padding: 10px 20px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                font-size: 16px;
                text-decoration: none;
                transition: background-color 0.3s ease;
            }
            
            .back-button:hover {
                background-color: #5a6268;
            }
            
            .edit-form {
                background-color: #f8f9fa;
                padding: 25px;
                border-radius: 15px;
            }
            
            .form-section {
                margin-bottom: 30px;
            }
            
            .section-title {
                font-size: 18px;
                font-weight: bold;
                color: #333;
                margin-bottom: 20px;
            }
            
            .form-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .form-label {
                font-size: 14px;
                color: #666;
                font-weight: 500;
            }
            
            .form-input {
                padding: 12px;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 16px;
                transition: border-color 0.3s ease;
            }
            
            .form-input:focus {
                outline: none;
                border-color: #159eff;
                box-shadow: 0 0 0 2px rgba(21, 158, 255, 0.1);
            }
            
            .form-actions {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e9ecef;
            }
            
            .submit-button {
                padding: 12px 24px;
                background-color: #159eff;
                color: white;
                border: none;
                border-radius: 15px;
                cursor: pointer;
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            
            .submit-button:hover:not(:disabled) {
                background-color: #0078cd;
            }
            
            .submit-button:disabled {
                background-color: #ccc;
                cursor: not-allowed;
            }
            
            .cancel-button {
                padding: 12px 24px;
                background-color: transparent;
                color: #666;
                border: 1px solid #ddd;
                border-radius: 15px;
                cursor: pointer;
                font-size: 16px;
                text-decoration: none;
                transition: all 0.3s ease;
            }
            
            .cancel-button:hover {
                background-color: #f8f9fa;
                border-color: #bbb;
            }
        `;

        // Create content element
        const content: HTMLElement = document.createElement("div");
        content.innerHTML = `
            <div class="edit-header">
                <h1>Profiel Bewerken</h1>
                <a href="/profile/account" class="back-button">Terug</a>
            </div>
            
            <div class="message"></div>
            
            <form class="edit-form">
                <div class="form-section">
                    <h2 class="section-title">Persoonlijke informatie</h2>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label" for="firstName">Voornaam *</label>
                            <input type="text" id="firstName" name="firstName" class="form-input" 
                                   value="${firstName}" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="prefix">Tussenvoegsel</label>
                            <input type="text" id="prefix" name="prefix" class="form-input" 
                                   value="${prefix}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="lastName">Achternaam *</label>
                            <input type="text" id="lastName" name="lastName" class="form-input" 
                                   value="${lastName}" required>
                        </div>
                    </div>
                </div>
                
                <div class="form-section">
                    <h2 class="section-title">Adresgegevens</h2>
                    <div class="form-grid">
                        <div class="form-group">
                            <label class="form-label" for="street">Straat</label>
                            <input type="text" id="street" name="street" class="form-input" 
                                   value="${street}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="houseNumber">Huisnummer</label>
                            <input type="text" id="houseNumber" name="houseNumber" class="form-input" 
                                   value="${houseNumber}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="postalCode">Postcode</label>
                            <input type="text" id="postalCode" name="postalCode" class="form-input" 
                                   value="${postalCode}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="city">Plaats</label>
                            <input type="text" id="city" name="city" class="form-input" 
                                   value="${city}">
                        </div>
                        <div class="form-group">
                            <label class="form-label" for="country">Land</label>
                            <input type="text" id="country" name="country" class="form-input" 
                                   value="${country}">
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <a href="/profile/account" class="cancel-button">Annuleren</a>
                    <button type="submit" class="submit-button">Opslaan</button>
                </div>
            </form>
        `;

        // Clear shadowRoot and add elements
        this.shadowRoot.innerHTML = "";
        this.shadowRoot.appendChild(styles);
        this.shadowRoot.appendChild(content);

        // Add event listeners
        const form: HTMLFormElement | null = this.shadowRoot.querySelector("form");
        if (form) {
            form.addEventListener("submit", e => this.handleSubmit(e));
        }

        // Add click handlers for navigation
        this.shadowRoot.querySelectorAll("a").forEach((link: Element) => {
            link.addEventListener("click", (e: Event) => {
                const href: string | null = (e.target as HTMLAnchorElement).getAttribute("href");
                if (href && href.startsWith("/profile")) {
                    e.preventDefault();
                    this.navigate(href);
                }
            });
        });

        console.log("ProfileAccountEditComponent: Render complete");
    }
}

window.customElements.define("profile-account-edit", ProfileAccountEditComponent);
