import "@web/components/LayoutComponent";
import { html } from "@web/helpers/webComponents";

class ExamplePageComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <webshop-layout>
                <div>
                    <h1>
                        Welkom bij de LucaStars Webshop!
                    </h1>

                    <p>
                        Dit is example.html!
                    </p>
                </div>
            </webshop-layout>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("webshop-page-example", ExamplePageComponent);
