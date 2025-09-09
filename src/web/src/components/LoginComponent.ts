import { html } from "@web/helpers/webComponents";
import { authService } from "../services/AuthService";
import { IAuthResponse } from "@shared/types";

export class LoginComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
        this.addEventListeners();
    }

    private addEventListeners(): void {
        if (!this.shadowRoot) {
            return;
        }

        const form: HTMLFormElement = this.shadowRoot.getElementById("login-form") as HTMLFormElement;
        form.addEventListener("submit", this.handleSubmit.bind(this));
    }

    private async handleSubmit(event: Event): Promise<void> {
        event.preventDefault();

        if (!this.shadowRoot) {
            return;
        }

        const form: HTMLFormElement = event.target as HTMLFormElement;
        const email: string = (form.elements.namedItem("email") as HTMLInputElement).value;
        const password: string = (form.elements.namedItem("password") as HTMLInputElement).value;

        // Disable the submit button and show loading state
        const submitButton: HTMLButtonElement = this.shadowRoot.getElementById("submit-button") as HTMLButtonElement;
        const originalButtonText: string | null = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";

        // Hide any previous error messages
        const errorElement: HTMLElement = this.shadowRoot.getElementById("error-message") as HTMLDivElement;
        errorElement.style.display = "none";
        errorElement.textContent = "";

        try {
            const response: IAuthResponse = await authService.login(email, password);

            if (response.success) {
                window.location.href = "/index.html";
            }
            else {
                // Show error message
                errorElement.textContent = response.message;
                errorElement.style.display = "block";

                // Reset the submit button
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
        catch (error) {
            // Show generic error message
            errorElement.textContent = "An unexpected error occurred. Please try again.";
            errorElement.style.display = "block";

            // Reset the submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;

            console.error("Login error:", error);
        }
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div class="register-form">
                <h2>Inloggen</h2>
                <div id="error-message" class="error-message" style="display: none;"></div>
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">E-mail: <span class="required">*</span></label>
                        <input type="email" id="email" name="email" required>
                    </div>
                
                    
                    <div class="form-group">
                        <label for="password">Wachtwoord: <span class="required">*</span></label>
                        <input type="password" id="password" name="password" required>
                    </div>

                    <div class="form-group">
                        <button type="submit" id="submit-button">Inloggen</button>
                    </div>

                    <div class="form-group">
                        <p>Heeft u nog geen account? Registreer <a href = "/register.html" >hier</a>.</p>
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
                    color: #000000;
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
                    border-radius: 30px;
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

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element, styles);
    }
}

window.customElements.define("login-component", LoginComponent);
