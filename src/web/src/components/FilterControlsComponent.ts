import "toolcool-range-slider";
import "@web/components/LoadingComponent";

import { css, html } from "@web/helpers/webComponents";
import { RangeSlider } from "toolcool-range-slider";
import { TagService } from "@web/services/TagService";
import { Tag } from "@shared/types";
import { WebshopEventService } from "@web/services/WebshopEventService";
import { WebshopEvent } from "@web/enums/WebshopEvent";
import { LoadingComponent } from "./LoadingComponent";

type SliderChangeEvent = CustomEvent<{
    value1: number;
    value2: number;
}>;

export type FilterChangeEvent = {
    minPrice: number;
    maxPrice: number;
    tags: number[];
};

export class FilterControlsComponent extends HTMLElement {
    private _webshopEventService: WebshopEventService = new WebshopEventService();
    private _tagService: TagService = new TagService();

    private _minPrice: number = 5;
    private _maxPrice: number = 60;
    private _selectedMinPrice: number = 5;
    private _selectedMaxPrice: number = 60;
    private _selectedTags: number[] = [];

    private _rangeSlider: RangeSlider | null = null;
    private _minPriceSpan: HTMLSpanElement | null = null;
    private _maxPriceSpan: HTMLSpanElement | null = null;

    private _loadingComponent: LoadingComponent = html`<webshop-loading></webshop-loading>` as LoadingComponent;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const styles: HTMLElement = html`
            <style>
                .filter-container {
                    box-sizing: border-box;
                    border-radius: 8px;
                    width: 100%;
                }
                
                .filter-section {
                    margin-bottom: 20px;
                }
                
                .filter-section-title {
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                
                .price-inputs {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                }
                
                .price-inputs input {
                    width: 60px;
                    padding: 5px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .range-slider .range-slider__range {
                    background: var(--primary-color);
                }

                .range-slider .range-slider__thumb {
                    background: var(--primary-color);
                }
                
                .tag-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .tag-checkbox {
                    display: flex;
                    align-items: center;
                }
                
                .tag-checkbox input {
                    margin-right: 8px;
                }
                
                .filter-actions {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px;
                }
                
                .apply-button {
                    padding: 8px 16px;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .clear-button {
                    padding: 8px 16px;
                    background: transparent;
                    color: #555;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }
                
                .apply-button:hover {
                    background: var(--primary-color-dark);
                }
                
                .clear-button:hover {
                    background: #f0f0f0;
                }
            </style>
        `;

        this._rangeSlider = html`
            <tc-range-slider
                min="${this._minPrice}"
                max="${this._maxPrice}"
                value1="${this._selectedMinPrice}"
                value2="${this._selectedMaxPrice}"
                step="1"
                round="0"
            >
            </tc-range-slider>
        ` as RangeSlider;

        this._minPriceSpan = html`
            <span>${this._selectedMinPrice}</span>
        ` as HTMLSpanElement;

        this._maxPriceSpan = html`
            <span>${this._selectedMaxPrice}</span>
        ` as HTMLSpanElement;

        const tagList: HTMLElement = html`
            <div class="tag-list"></div>
        `;

        const element: HTMLElement = html`
            <div class="filter-container">
                <div class="filter-section">
                    <div class="filter-section-title">Filter op prijs</div>
                    ${this._rangeSlider}
                    <p>
                        Prijs: &euro;
                        ${this._minPriceSpan}
                        <span> - </span> &euro;
                        ${this._maxPriceSpan}
                    </p>
                </div>
                
                <div class="filter-section">
                    <div class="filter-section-title">Filter op categorieën</div>
                    ${this._loadingComponent}
                    ${tagList}
                </div>
                
                <div class="filter-actions">
                    <button class="clear-button" id="clear-filters">Wissen</button>
                    <button class="apply-button" id="apply-filters">Filteren</button>
                </div>
            </div>
        `;

        this.shadowRoot.innerHTML = "";
        this.shadowRoot.append(styles, element);

        this._rangeSlider.addCSS(css`
            .panel-fill{
                background: var(--primary-color);
            }

            .pointer .pointer-shape {
                background: var(--primary-color);
                border: 0;
                box-shadow: none;
            }

            .pointer:focus .pointer-shape {
                background: var(--primary-color);
                border: 0;
                box-shadow: none;
            }
        `);

        this._loadingComponent.show();

        const tags: Tag[] = await this._tagService.getTags();

        tags.forEach(tag => {
            const tagCheckbox: HTMLElement = html`
                <label class="tag-checkbox">
                    <input type="checkbox" value="${tag.id}" ?checked=${this._selectedTags.includes(tag.id)} />
                    ${tag.value}
                </label>
            `;

            tagList.append(tagCheckbox);
        });

        this._loadingComponent.hide();

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        if (!this.shadowRoot || !this._rangeSlider) {
            return;
        }

        const applyButton: HTMLElement = this.shadowRoot.getElementById("apply-filters") as HTMLElement;
        const clearButton: HTMLElement = this.shadowRoot.getElementById("clear-filters") as HTMLElement;
        const tagCheckboxes: NodeListOf<HTMLInputElement> = this.shadowRoot.querySelectorAll("input[type=\"checkbox\"]");

        this._rangeSlider.addEventListener("change", (event: Event) => {
            const customEvent: SliderChangeEvent = event as SliderChangeEvent;
            this._selectedMinPrice = customEvent.detail.value1;
            this._selectedMaxPrice = customEvent.detail.value2;

            this._minPriceSpan!.innerText = this._selectedMinPrice.toString();
            this._maxPriceSpan!.innerText = this._selectedMaxPrice.toString();
        });

        tagCheckboxes.forEach(checkbox => {
            checkbox.addEventListener("change", e => {
                const target: HTMLInputElement = e.target as HTMLInputElement;
                const tagId: number = target.value as unknown as number;

                if (target.checked && !this._selectedTags.includes(tagId)) {
                    this._selectedTags.push(tagId);
                }
                else if (!target.checked && this._selectedTags.includes(tagId)) {
                    this._selectedTags = this._selectedTags.filter(tag => tag !== tagId);
                }
            });
        });

        applyButton.addEventListener("click", () => {
            this._webshopEventService.dispatchEvent<FilterChangeEvent>(WebshopEvent.Filter, {
                minPrice: this._selectedMinPrice,
                maxPrice: this._selectedMaxPrice,
                tags: this._selectedTags,
            });
        });

        clearButton.addEventListener("click", () => {
            this._selectedMinPrice = this._minPrice;
            this._selectedMaxPrice = this._maxPrice;
            this._selectedTags = [];

            this._rangeSlider!.value1 = this._minPrice;
            this._rangeSlider!.value2 = this._maxPrice;

            tagCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            this._webshopEventService.dispatchEvent<FilterChangeEvent>(WebshopEvent.Filter, {
                minPrice: this._selectedMinPrice,
                maxPrice: this._selectedMaxPrice,
                tags: [],
            });
        });
    }
}

window.customElements.define("webshop-filter-controls", FilterControlsComponent);
