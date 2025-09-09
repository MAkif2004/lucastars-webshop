/**
 * Treat the content of this template literal as CSS
 *
 * @remarks This tagged template works exactly the same as the normal template literal.
 *
 * @returns Concatenated string
 */
export function css(strings: TemplateStringsArray, ...values: unknown[]): string {
    let result: string = "";

    for (let i: number = 0; i < strings.length - 1; i++) {
        result += strings[i];
        result += String(values[i]);
    }

    result += strings[strings.length - 1];

    return result;
}

/**
 * Treat the content of this template literal as HTML
 *
 * @remarks This tagged template supports concatenating HTMLElement instances as-is.
 *
 * @returns A single HTMLElement instance
 */
export function html(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement {
    return htmlArray(strings, ...values)[0];
}

/**
 * Treat the content of this template literal as HTML
 *
 * @remarks This tagged template supports concatenating HTMLElement instances as-is.
 *
 * @returns Array of HTMLElement instances
 */
export function htmlArray(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement[] {
    // Concatenate the strings and values, replacing HTMLElement instances with a comment instead.
    let innerHtml: string = "";

    for (let i: number = 0; i < strings.length - 1; i++) {
        innerHtml += strings[i];

        const value: unknown = values[i];

        if (value instanceof HTMLElement) {
            innerHtml += `<element data-id=${i}></element>`;
        }
        else if (Array.isArray(value) && value.every(v => v instanceof HTMLElement)) {
            innerHtml += `<element-array data-id=${i}></element-array>`;
        }
        else {
            innerHtml += String(value);
        }
    }

    innerHtml += strings[strings.length - 1];

    // Create a template element
    const template: HTMLTemplateElement = document.createElement("template");
    template.innerHTML = innerHtml.trim();

    // Replace each comment with the appropriate HTMLElement instance
    values.forEach((value, i) => {
        if (value instanceof HTMLElement) {
            const placeholder: Element | null = template.content.querySelector(`element[data-id="${i}"]`);

            if (!placeholder || !placeholder.parentNode) {
                return;
            }

            placeholder.parentNode.replaceChild(value, placeholder);
        }
        else if (Array.isArray(value) && value.every(v => v instanceof HTMLElement)) {
            const placeholder: Element | null = template.content.querySelector(`element-array[data-id="${i}"]`);

            if (!placeholder || !placeholder.parentNode) {
                return;
            }

            const container: DocumentFragment = document.createDocumentFragment();
            value.forEach(v => container.appendChild(v));
            placeholder.parentNode.replaceChild(container, placeholder);
        }
    });

    // Return the child nodes of the template element
    return Array.from(template.content.childNodes) as HTMLElement[];
}
