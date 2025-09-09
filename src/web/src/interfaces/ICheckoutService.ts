export abstract class ICheckoutService {
    public abstract getPaymentStatus(): Promise<void>;
}
