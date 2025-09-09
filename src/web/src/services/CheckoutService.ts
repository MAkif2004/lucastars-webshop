import { CheckoutItem, Payment, PaymentResponse, PaymentReturnResponse } from "@shared/types";

export class CheckoutService {
    public async getCheckoutData(): Promise<CheckoutItem> {
        const res: Response = await fetch(`${VITE_API_URL}checkout`, { credentials: "include" });
        return await res.json() as unknown as CheckoutItem;
    }

    public async submitCheckout(data: CheckoutItem): Promise<CheckoutItem> {
        const res: Response = await fetch(`${VITE_API_URL}checkout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });

        return await res.json() as unknown as CheckoutItem;
    }

    public async createPayment(data: Payment): Promise<PaymentResponse> {
        const res: Response = await fetch(`${VITE_API_URL}payments/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(data),
        });
        return await res.json() as unknown as PaymentResponse;
    }

    public async getPaymentStatus(orderId: number): Promise<PaymentReturnResponse> {
        const response: Response = await fetch(`${VITE_API_URL}payments/status?orderId=${encodeURIComponent(orderId)}`, {
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch payment status");
        }

        const paymentReturnResponse: PaymentReturnResponse = await response.json() as unknown as PaymentReturnResponse;
        return paymentReturnResponse;
    }
}
