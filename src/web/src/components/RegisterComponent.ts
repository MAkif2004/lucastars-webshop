import { html } from "../helpers/webComponents";
import { authService } from "../services/AuthService";
import { IAuthResponse } from "../../../shared/types";

export class RegisterComponent extends HTMLElement {
    private _usernameInput: HTMLInputElement | null = null;
    private _emailInput: HTMLInputElement | null = null;
    private _firstNameInput: HTMLInputElement | null = null;
    private _prefixInput: HTMLInputElement | null = null;
    private _lastNameInput: HTMLInputElement | null = null;
    private _passwordInput: HTMLInputElement | null = null;
    private _confirmPasswordInput: HTMLInputElement | null = null;
    private _errorMessage: HTMLElement | null = null;
    private _submitButton: HTMLButtonElement | null = null;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }
        const element: HTMLElement = html`
            <div class="register-form">
                <h2>Account aanmaken</h2>
                <div id="error-message" class="error-message" style="display: none;"></div>
                <form id="register-form">
                    <div class="form-group">
                        <label for="username">Gebruikersnaam: <span class="required">*</span></label>
                        <input type="text" id="username" name="username" required>
                    </div>
                    <div class="form-group">
                        <label for="email">E-mail: <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    
                    <!-- Name fields -->
                    <div class="name-section">
                        <h3>Volledige Naam</h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="first-name">Voornaam: <span class="required">*</span></label>
                                <input type="text" id="first-name" name="firstName" required>
                            </div>
                            <div class="form-group">
                                <label for="prefix">Tussenvoegsel:</label>
                                <input type="text" id="prefix" name="prefix">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="last-name">Achternaam: <span class="required">*</span></label>
                            <input type="text" id="last-name" name="lastName" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="password">Wachtwoord: <span class="required">*</span></label>
                        <input type="password" id="password" name="password" required>
                        <p class="password-hint">Wachtwoord moet minimaal 8 tekens zijn</p>
                    </div>
                    <div class="form-group">
                        <label for="confirm-password">Bevestig Wachtwoord: <span class="required">*</span></label>
                        <input type="password" id="confirm-password" name="confirm_password" required>
                    </div>
                    <div class="form-group">
                        <button type="submit" id="submit-button">Registreer</button>
                    </div>
                    <div class="form-group">
                        <p>Heeft u al account? Log in <a href = "/login.html" >hier</a>.</p>
                    </div>
                </form>
            </div>
        `;

        const styles: HTMLElement = html`

            <style>
                .register-form {
                    max-width: 500px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 30px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                
                h2, h3 {
                    color: #333;
                    }
                
                h2 {
                    text-align: center;
                    margin-bottom: 20px;
                }
                
                h3 {
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                }
                
                .name-section {
                    margin: 20px 0;
                    padding: 15px;
                    background-color: #f0f0f0;
                    border-radius: 15px;
                }
                
                .form-group {
                    margin-bottom: 15px;
                }
                
                .form-row {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                }
                
                .form-row .form-group {
                    flex: 1;
                    margin-bottom: 0;
                }
                
                label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: bold;
                    color: #555;
                }
                
                .required {
                    color: #ecae20;
                }
                
                input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 15px;
                    font-size: 16px;
                    box-sizing: border-box;
                }
                
                .password-hint {
                    margin: 5px 0 0;
                    font-size: 12px;
                    color: #6c757d;
                }
                
                button {
                    width: 100%;
                    padding: 12px;
                    background-color: #159eff;
                    color: white;
                    border: none;
                    border-radius: 15px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                }
                
                button:hover {
                    background-color: #0078cd;
                }
                
                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }
                
                .error-message {
                    color: #dc3545;
                    margin: 10px 0;
                    padding: 10px;
                    background-color: #f8d7da;
                    border-radius: 15px;
                    font-size: 14px;
                }
                
                @media (max-width: 600px) {
                    .form-row {
                        flex-direction: column;
                        gap: 10px;
                    }
                }
            </style>
        `;

        // Store references to elements
        this._usernameInput = element.querySelector("#username") as HTMLInputElement;
        this._emailInput = element.querySelector("#email") as HTMLInputElement;
        this._firstNameInput = element.querySelector("#first-name") as HTMLInputElement;
        this._prefixInput = element.querySelector("#prefix") as HTMLInputElement;
        this._lastNameInput = element.querySelector("#last-name") as HTMLInputElement;
        this._passwordInput = element.querySelector("#password") as HTMLInputElement;
        this._confirmPasswordInput = element.querySelector("#confirm-password") as HTMLInputElement;
        this._errorMessage = element.querySelector("#error-message");
        this._submitButton = element.querySelector("#submit-button") as HTMLButtonElement;

        // Add event listeners
        const form: HTMLFormElement | null = element.querySelector("#register-form");
        form?.addEventListener("submit", this.handleSubmit.bind(this));

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(styles, element);
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        if (!this._usernameInput || !this._emailInput || !this._firstNameInput ||
          !this._lastNameInput || !this._passwordInput ||
          !this._confirmPasswordInput || !this._errorMessage || !this._submitButton) {
            return;
        }

        // Hide error message
        this._errorMessage.style.display = "none";
        this._errorMessage.textContent = "";

        // Disable submit button
        this._submitButton.disabled = true;
        this._submitButton.textContent = "Registreren...";

        try {
            const username: string = this._usernameInput.value.trim();
            const email: string = this._emailInput.value.trim();
            const firstName: string = this._firstNameInput.value.trim();
            const prefix: string | undefined = this._prefixInput?.value.trim();
            const lastName: string = this._lastNameInput.value.trim();
            const password: string = this._passwordInput.value;
            const confirmPassword: string = this._confirmPasswordInput.value;

            // Basic validation
            if (!username || !email || !firstName || !lastName || !password || !confirmPassword) {
                this.showError("Vul alle velden in");
                return;
            }

            if (password !== confirmPassword) {
                this.showError("Wachtwoorden komen niet overeen");
                return;
            }

            if (password.length < 8) {
                this.showError("Wachtwoord moet minimaal 8 tekens zijn");
                return;
            }

            // Register request
            const result: IAuthResponse = await authService.register({
                username,
                email,
                firstName: firstName,
                prefix,
                lastName: lastName,
                password,
                confirmPassword,
            });

            console.log(result);

            if (result.success) {
                // Show success message before redirect
                this._errorMessage.style.display = "block";
                this._errorMessage.style.backgroundColor = "#d4edda";
                this._errorMessage.style.color = "#155724";
                this._errorMessage.textContent = "Registratie successvol! Een moment...";

                // Redirect to home page after a short delay
                setTimeout(() => {
                    window.location.href = "/login.html";
                }, 1500);
            }
            else {
                this.showError(result.message);
            }
        }
        catch (error: unknown) {
            console.error("Registration error:", error);
            // Fix TypeScript error with proper type handling
            let errorMessage: string = "An error occurred during registration";

            if (error instanceof Error) {
                errorMessage = error.message;
            }
            else if (typeof error === "string") {
                errorMessage = error;
            }
            else if (error && typeof error === "object" && "message" in error &&
              typeof error.message === "string") {
                errorMessage = error.message;
            }

            this.showError(errorMessage);
        }
        finally {
            // Re-enable submit button
            this._submitButton.disabled = false;
            this._submitButton.textContent = "Register";
        }
    }

    private showError(message: string): void {
        if (this._errorMessage) {
            this._errorMessage.textContent = message;
            this._errorMessage.style.display = "block";
            this._errorMessage.style.backgroundColor = "#f8d7da";
            this._errorMessage.style.color = "#dc3545";
        }
    }
}

// Define custom element
customElements.define("register-component", RegisterComponent);
