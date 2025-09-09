import { Request, Response } from "express";
import { ICheckoutService } from "@api/interfaces/ICheckoutService";
import { CheckoutService } from "@api/services/CheckoutService";
import { CheckoutItem, Payment, PaymentReturnResponse } from "@shared/types";

export class CheckoutController {
    private readonly _checkoutService: ICheckoutService = new CheckoutService();

    public async getCheckout(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const item: CheckoutItem | null = await this._checkoutService.getCheckout(userId);
        res.json(item);
    }

    public async createPayment(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const data: Payment | undefined = req.body as Payment | undefined;

        if (!data) {
            res.status(400);
            return;
        }
        if (typeof data.orderId !== "number") {
            res.status(400).json({ error: "Invalid orderId" });
            return;
        }
        const transactionId: string | undefined = await this._checkoutService.createPayment(data.orderId, data.value);

        if (!transactionId) {
            res.status(400);
            return;
        }
        res.status(200).json({ transactionId });
    }

    public async postCheckout(req: Request, res: Response): Promise<void> {
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401);
            return;
        }

        const item: CheckoutItem | undefined = req.body as CheckoutItem | undefined;

        if (!item) {
            res.status(400);
            return;
        }

        const result: CheckoutItem | null = await this._checkoutService.postCheckout(userId, item);

        if (!result) {
            res.status(400);
            return;
        }

        res.json(result);
    }

    public async getPaymentStatus(req: Request, res: Response): Promise<void> {
        const orderId: number = Number((req.query as { orderId: string }).orderId);
        const userId: number | undefined = req.userId;

        if (!userId) {
            res.status(401).send("Unauthorized");
            return;
        }

        const paymentReturnStatus: PaymentReturnResponse | undefined = await this._checkoutService.handlePaymentReturn(orderId);

        if (!paymentReturnStatus) {
            res.status(400).json({ error: "Failed to retrieve payment status" });
            return;
        }

        res.status(200).json({ status: paymentReturnStatus.status, transactionId: paymentReturnStatus.transactionId });
    }
}
