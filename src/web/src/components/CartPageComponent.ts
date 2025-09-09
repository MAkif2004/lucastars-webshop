import { CartItem } from "@shared/types";
import "@web/components/CartPageComponent";
import { CartService } from "@web/services/CartService";

export class CartPageComponent extends HTMLElement {
    private _cartService = new CartService();

    private items: CartItem[] = [];

    public async connectedCallback(): Promise<void> {
        this.attachShadow({ mode: "open" });

        try {
            this.items = await this._cartService.getCart();
        }
        catch (error) {
            console.error("Kan winkelwagen niet ophalen:", error);
            this.items = []; // fallback
        }

        this.render();
    }

    private async updateBackendCart(): Promise<void> {
        try {
            await this._cartService.updateCart(this.items);
        }
        catch (error) {
            console.error("Fout bij bijwerken van winkelwagen:", error);
        }
    }

    private render(): void {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = "";

        // eslint-disable-next-line @typescript-eslint/typedef
        const container = document.createElement("section");
        container.style.maxWidth = "700px";
        container.style.margin = "2rem auto";

        // eslint-disable-next-line @typescript-eslint/typedef
        const titleContainer = document.createElement("div");
        titleContainer.style.display = "flex";
        titleContainer.style.justifyContent = "center";
        titleContainer.style.gap = "10px";

        // eslint-disable-next-line @typescript-eslint/typedef
        const title = document.createElement("h2");
        title.textContent = "Mijn winkelmand";
        title.style.textAlign = "center";

        // eslint-disable-next-line @typescript-eslint/typedef
        const titleIcon = document.createElement("img");
        titleIcon.src = "/images/icons/cart.svg";
        titleIcon.alt = "Winkelmand";

        titleContainer.appendChild(titleIcon);
        titleContainer.appendChild(title);

        container.appendChild(titleContainer);

        // eslint-disable-next-line @typescript-eslint/typedef
        const ul = document.createElement("ul");
        ul.style.listStyle = "none";
        ul.style.padding = "0";

        this.items.forEach((item, index) => {
            // eslint-disable-next-line @typescript-eslint/typedef
            const li = document.createElement("li");
            li.style.display = "flex";
            li.style.background = "#fff";
            li.style.borderRadius = "12px";
            li.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
            li.style.padding = "1rem";
            li.style.marginBottom = "1rem";
            li.style.alignItems = "center";

            // eslint-disable-next-line @typescript-eslint/typedef
            const img = document.createElement("img");
            img.src = item.thumbnail;
            img.alt = item.name;
            img.style.width = "100px";
            img.style.height = "100px";
            img.style.objectFit = "cover";
            img.style.borderRadius = "8px";
            img.style.marginRight = "1rem";

            // eslint-disable-next-line @typescript-eslint/typedef
            const details = document.createElement("div");
            details.style.flex = "1";

            // eslint-disable-next-line @typescript-eslint/typedef
            const name = document.createElement("h3");
            name.textContent = item.name;
            name.style.margin = "0 0 0.25rem 0";

            // eslint-disable-next-line @typescript-eslint/typedef
            const desc = document.createElement("p");
            desc.textContent = item.description;
            desc.style.margin = "0 0 0.5rem 0";
            desc.style.color = "#666";

            // eslint-disable-next-line @typescript-eslint/typedef
            const price = document.createElement("p");
            price.innerHTML = `<strong>Prijs:</strong> <span style= "color: red;">€${Number(item.price).toFixed(2)}<span>`;
            price.style.margin = "0.25rem 0";

            // eslint-disable-next-line @typescript-eslint/typedef
            const quantityDiv = document.createElement("div");
            quantityDiv.style.display = "flex";
            quantityDiv.style.alignItems = "center";
            quantityDiv.style.gap = "0.5rem";

            // eslint-disable-next-line @typescript-eslint/typedef
            const qty = document.createElement("span");
            qty.textContent = item.quantity.toString();

            details.appendChild(name);
            details.appendChild(desc);
            details.appendChild(price);
            details.appendChild(quantityDiv);

            // eslint-disable-next-line @typescript-eslint/typedef
            const btnRemove = document.createElement("button");
            btnRemove.innerHTML = "";
            btnRemove.style.marginLeft = "1rem";
            btnRemove.style.background = "transparent";
            btnRemove.style.border = "none";
            btnRemove.style.cursor = "pointer";
            btnRemove.onclick = () => this.removeItem(index);

            // eslint-disable-next-line @typescript-eslint/typedef
            const btnIcon = document.createElement("img");
            btnIcon.src = "/images/icons/trash.svg";
            btnIcon.alt = "Verwijder";

            btnRemove.appendChild(btnIcon);

            li.appendChild(img);
            li.appendChild(details);
            li.appendChild(btnRemove);

            ul.appendChild(li);
        });

        container.appendChild(ul);

        if (this.items.length > 0) {
            // eslint-disable-next-line @typescript-eslint/typedef
            const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);

            // eslint-disable-next-line @typescript-eslint/typedef
            const totalEl = document.createElement("p");
            totalEl.innerHTML = `<strong>Totaal:</strong> <span style= "color: red;">€${total}<span>`;
            totalEl.style.textAlign = "right";
            totalEl.style.fontSize = "1.2rem";

            // eslint-disable-next-line @typescript-eslint/typedef
            const checkoutButton = document.createElement("button");
            checkoutButton.textContent = "Afrekenen";
            checkoutButton.style.marginTop = "1rem";
            checkoutButton.style.padding = "0.75rem 1.5rem";
            checkoutButton.style.fontSize = "1rem";
            checkoutButton.style.backgroundColor = "var(--primary-color)";
            checkoutButton.style.color = "white";
            checkoutButton.style.border = "none";
            checkoutButton.style.borderRadius = "8px";
            checkoutButton.style.cursor = "pointer";
            checkoutButton.onclick = () => {
                // eslint-disable-next-line @typescript-eslint/typedef
                const total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                localStorage.setItem("cart-total", total.toFixed(2));
                window.location.href = "/checkout.html";
            };

            container.appendChild(totalEl);
            container.appendChild(checkoutButton);
        }
        else {
            // Toon melding als winkelmand leeg is
            // eslint-disable-next-line @typescript-eslint/typedef
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "Wat jammer je winkelmand is leeg!";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#888";
            emptyMsg.style.fontSize = "1.1rem";
            container.appendChild(emptyMsg);

            // Voeg "Shop nu" knop toe
            // eslint-disable-next-line @typescript-eslint/typedef
            const shopNowBtn = document.createElement("button");
            shopNowBtn.textContent = "Shop nu";
            shopNowBtn.style.display = "block";
            shopNowBtn.style.margin = "1.5rem auto 0 auto";
            shopNowBtn.style.padding = "0.75rem 1.5rem";
            shopNowBtn.style.fontSize = "1rem";
            shopNowBtn.style.backgroundColor = "var(--primary-color)";
            shopNowBtn.style.color = "white";
            shopNowBtn.style.border = "none";
            shopNowBtn.style.borderRadius = "8px";
            shopNowBtn.style.cursor = "pointer";
            shopNowBtn.onclick = () => {
                window.location.href = "/games.html";
            };
            container.appendChild(shopNowBtn);
        }

        this.shadowRoot.appendChild(container);
    }

    private async removeItem(index: number): Promise<void> {
        const item: CartItem = this.items[index];
        this.items.splice(index, 1);

        try {
            // Delete from backend as well
            await this._cartService.deleteCartItem(item.gameId);
        }
        catch (error) {
            console.error("Fout bij verwijderen van item uit winkelwagen:", error);
        }
        await this.updateBackendCart();
        this.render();
    }
}

window.customElements.define("webshop-cartpage", CartPageComponent);
