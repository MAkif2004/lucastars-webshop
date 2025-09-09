import { CheckoutItem, PaymentReturnResponse } from "@shared/types";

@Interface
export abstract class ICheckoutService {
    public abstract getCheckout(userId: number): Promise<CheckoutItem | null>;
    public abstract postCheckout(userId: number, item: CheckoutItem): Promise<CheckoutItem | null>;
    public abstract createPayment(userId: number, value: number): Promise<string | undefined>;
    public abstract handlePaymentReturn(orderId: number): Promise<PaymentReturnResponse | undefined>;
}
