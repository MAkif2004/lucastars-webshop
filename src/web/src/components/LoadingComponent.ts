import { html } from "@web/helpers/webComponents";

/**
 * Displays a loading spinner.
 *
 * @remarks This component will only show the spinner when the `show` method is called.
 *          The spinner will also be hidden after a delay of 300ms to prevent flickering.
 */
export class LoadingComponent extends HTMLElement {
    private showTimer: number | null = null;
    private delayMs: number = 300;

    public connectedCallback(): void {
        this.style.display = "none";

        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 20px;
                    box-sizing: border-box;
                }
                
                .loading-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                
                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spin 1s ease-in-out infinite;
                    margin-bottom: 10px;
                }
                
                
                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }
            </style>
        `;

        const element: HTMLElement = html`
            <div class="loading-container">
                <div class="spinner"></div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);
    }

    public show(): void {
        this.clearTimer();

        this.showTimer = window.setTimeout(() => {
            this.style.display = "flex";
            this.showTimer = null;
        }, this.delayMs);
    }

    public hide(): void {
        this.clearTimer();
        this.style.display = "none";
    }

    private clearTimer(): void {
        if (this.showTimer === null) {
            return;
        }

        clearTimeout(this.showTimer);
        this.showTimer = null;
    }

    public disconnectedCallback(): void {
        this.clearTimer();
    }
}

window.customElements.define("webshop-loading", LoadingComponent);
