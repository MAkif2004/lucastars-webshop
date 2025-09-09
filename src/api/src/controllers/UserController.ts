import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { IUser } from "@shared/types";

interface UpdateUserRequest {
    firstName?: string;
    prefix?: string;
    lastName?: string;
}

interface UpdateAddressRequest {
    street?: string;
    houseNumber?: string;
    postalCode?: string;
    city?: string;
    country?: string;
}

export class UserController {
    private readonly _userService: UserService = new UserService();

    /**
     * Get current user
     */
    public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number | undefined = req.userId; // From auth middleware

            if (!userId) {
                res.status(401).json({ error: "Not authenticated" });
                return;
            }

            const user: IUser | undefined = await this._userService.getUserById(userId);

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            res.status(200).json(user);
        }
        catch (error: unknown) {
            console.error("Error fetching current user:", error);
            res.status(500).json({ error: "Failed to fetch user data" });
        }
    };

    /**
     * Update user
     */
    public updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const requestingUserId: number | undefined = req.userId;

            // Check if user is updating their own profile
            if (!requestingUserId || requestingUserId !== userId) {
                res.status(403).json({ error: "You can only update your own profile" });
                return;
            }

            const updateData: UpdateUserRequest = req.body as UpdateUserRequest;

            // Only allow updating certain fields
            const filteredData: Partial<UpdateUserRequest> = {};

            if (updateData.firstName !== undefined) {
                filteredData.firstName = updateData.firstName;
            }
            if (updateData.prefix !== undefined) {
                filteredData.prefix = updateData.prefix;
            }
            if (updateData.lastName !== undefined) {
                filteredData.lastName = updateData.lastName;
            }

            const success: boolean = await this._userService.updateUser(userId, filteredData);

            if (!success) {
                res.status(500).json({ error: "Failed to update user" });
                return;
            }

            // Return updated user
            const updatedUser: IUser | undefined = await this._userService.getUserById(userId);
            res.status(200).json(updatedUser);
        }
        catch (error: unknown) {
            console.error("Error updating user:", error);
            res.status(500).json({ error: "Failed to update user" });
        }
    };

    /**
     * Update user address
     */
    public updateAddress = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId: number = parseInt(req.params.id, 10);
            const requestingUserId: number | undefined = req.userId;

            // Check if user is updating their own address
            if (!requestingUserId || requestingUserId !== userId) {
                res.status(403).json({ error: "You can only update your own address" });
                return;
            }

            const addressData: UpdateAddressRequest = req.body as UpdateAddressRequest;

            // Validate address fields
            const filteredData: Partial<UpdateAddressRequest> = {};

            if (addressData.street !== undefined) {
                filteredData.street = addressData.street || undefined;
            }
            if (addressData.houseNumber !== undefined) {
                filteredData.houseNumber = addressData.houseNumber || undefined;
            }
            if (addressData.postalCode !== undefined) {
                filteredData.postalCode = addressData.postalCode || undefined;
            }
            if (addressData.city !== undefined) {
                filteredData.city = addressData.city || undefined;
            }
            if (addressData.country !== undefined) {
                filteredData.country = addressData.country || undefined;
            }

            const success: boolean = await this._userService.updateUserAddress(userId, filteredData);

            if (!success) {
                res.status(500).json({ error: "Failed to update address" });
                return;
            }

            res.status(200).json({ success: true });
        }
        catch (error: unknown) {
            console.error("Error updating address:", error);
            res.status(500).json({ error: "Failed to update address" });
        }
    };
}
