import { WebshopEvent } from "../enums/WebshopEvent";

/**
 * Service to allow components to communicate with eachother through events
 */
export class WebshopEventService {
    /**
     * Listen for a webshop event and execute a function when it occurs
     *
     * @template T Type used for the event data
     *
     * @param webshopEvent Kind of webshop event to listen for
     * @param callback Function to call when the webshop event occurs. Will get the event data as an argument.
     */
    public addEventListener<T>(
        webshopEvent: WebshopEvent,
        callback: (event: T) => void
    ): void {
        window.addEventListener(`webshop:${webshopEvent}`, event => {
            callback((event as CustomEvent).detail as T);
        });
    }

    /**
     * Dispatch a webshop event
     *
     * @template T Type used for the event data
     *
     * @param webshopEvent Kind of webshop event to dispatch
     * @param data Event data to send along with the dispatch
     */
    public dispatchEvent<T>(webshopEvent: WebshopEvent, data?: T): void {
        window.dispatchEvent(
            new CustomEvent(`webshop:${webshopEvent}`, {
                detail: data,
            })
        );
    }
}
