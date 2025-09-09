export function deepQuerySelector(element: Node, selector: string): HTMLElement | null {
    const elements: HTMLElement[] = deepQuerySelectorAll(element, selector);

    if (elements.length === 0) {
        return null;
    }

    return elements[0];
}

export function deepQuerySelectorAll(element: Node, selector: string): HTMLElement[] {
    const elements: HTMLElement[] = [];

    function search(node: Node): void {
        if (
            node instanceof HTMLElement &&
            typeof node.matches === "function" &&
            node.matches(selector)
        ) {
            elements.push(node);
        }

        node.childNodes.forEach(search);

        if ((node as Element).shadowRoot) {
            search((node as Element).shadowRoot as Node);
        }
    }

    search(element);

    return elements;
}
