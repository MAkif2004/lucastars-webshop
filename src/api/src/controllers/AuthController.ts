import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { SessionService } from "../services/SessionService";
import { AuthReponse, IUserRegisterDTO, IUser, AuthVerifyResponse } from "@shared/types";

export class AuthController {
    private readonly _userService: UserService = new UserService();
    private readonly _sessionService: SessionService = new SessionService();

    /**
     * Register a new user
     */
    public register = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("Register request received:", req.body);
            const userData: IUserRegisterDTO = req.body as IUserRegisterDTO;

            // Basic validation
            if (!userData.username || !userData.email || !userData.password ||
              !userData.confirmPassword || !userData.firstName || !userData.lastName) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "All required fields must be filled in",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            if (userData.password !== userData.confirmPassword) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Passwords do not match",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            // Check if user already exists
            const existingUserByEmail: IUser | undefined = await this._userService.getUserByEmail(userData.email);
            if (existingUserByEmail) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Email already in use",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            const existingUserByUsername: IUser | undefined = await this._userService.getUserByUsername(userData.username);
            if (existingUserByUsername) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Username already taken",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            // Create user
            const userId: number | undefined = await this._userService.createUser(
                userData.username,
                userData.email,
                userData.firstName,
                userData.prefix,
                userData.lastName,
                userData.password
            );

            if (!userId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Failed to create user",
                };
                console.log("Sending error response:", errorResponse);
                res.status(500).json(errorResponse);
                return;
            }

            // Create session
            const sessionId: string | undefined = await this._sessionService.createSession(userId);

            if (!sessionId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Failed to create session",
                };
                console.log("Sending error response:", errorResponse);
                res.status(500).json(errorResponse);
                return;
            }

            // Set session cookie
            res.cookie("session", sessionId, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            const successResponse: AuthReponse = {
                success: true,
                message: "User registered successfully",
                sessionId,
            };
            console.log("Sending success response:", successResponse);
            res.status(201).json(successResponse);
        }
        catch (error) {
            console.error("Registration error:", error);
            const errorResponse: AuthReponse = {
                success: false,
                message: "Internal server error",
            };
            console.log("Sending error response:", errorResponse);
            res.status(500).json(errorResponse);
        }
    };

    /**
     * Login a user
     */
    public login = async (req: Request, res: Response): Promise<void> => {
        try {
            const loginData: { email: string; password: string } = req.body as { email: string; password: string };
            const { email, password } = loginData;

            // Basic validation
            if (!email || !password) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Email and password are required",
                };
                console.log("Sending error response:", errorResponse);
                res.status(400).json(errorResponse);
                return;
            }

            // Check if user exists
            const user: IUser | undefined = await this._userService.getUserByEmail(email);
            if (!user) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Invalid email or password",
                };
                console.log("Sending error response:", errorResponse);
                res.status(401).json(errorResponse);
                return;
            }

            // Check password
            const isPasswordCorrect: boolean = await this._userService.verifyPassword(user.email, password);
            if (!isPasswordCorrect) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Invalid email or password",
                };
                console.log("Sending error response:", errorResponse);
                res.status(401).json(errorResponse);
                return;
            }

            // Create session
            const sessionId: string | undefined = await this._sessionService.createSession(user.id);

            if (!sessionId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "Failed to create session",
                };
                console.log("Sending error response:", errorResponse);
                res.status(500).json(errorResponse);
                return;
            }

            // Set session cookie
            res.cookie("session", sessionId, {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            const successResponse: AuthReponse = {
                success: true,
                message: "Login successful",
                sessionId,
            };
            console.log("Sending success response:", successResponse);
            res.status(200).json(successResponse);
        }
        catch (error) {
            console.error("Login error:", error);
            const errorResponse: AuthReponse = {
                success: false,
                message: "Internal server error",
            };
            console.log("Sending error response:", errorResponse);
            res.status(500).json(errorResponse);
        }
    };

    /**
     * Verify if user is authenticated
     */
    public verify(req: Request, res: Response): void {
        const response: AuthVerifyResponse = {
            loggedIn: req.userId !== undefined,
        };

        res.status(200).json(response);
    }

    /**
     * Logout the current user
     */
    public logout = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("Logout request received for user:", req.userId || "unknown");

            // Get session from cookie
            const sessionId: string | undefined = req.cookies.session as string | undefined;

            if (!sessionId) {
                const errorResponse: AuthReponse = {
                    success: false,
                    message: "No active session found",
                };
                console.log("Sending error response:", errorResponse);
                res.status(401).json(errorResponse);
                return;
            }

            // Delete the session from database
            const sessionDeleted: boolean = await this._sessionService.deleteSession(sessionId);

            if (!sessionDeleted) {
                console.warn(`Failed to delete session ${sessionId} from database`);
                // Continue with cookie clearing even if database deletion failed
            }

            // Clear the session cookie
            res.clearCookie("session", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            const successResponse: AuthReponse = {
                success: true,
                message: "Logged out successfully",
            };

            console.log(`User ${req.userId || "unknown"} logged out successfully`);
            res.status(200).json(successResponse);
        }
        catch (error) {
            console.error("Logout error:", error);

            // Even if there's an error, clear the cookie to ensure logout
            res.clearCookie("session", {
                httpOnly: true,
                sameSite: "strict",
                secure: process.env.NODE_ENV === "production",
            });

            const errorResponse: AuthReponse = {
                success: false,
                message: "Error during logout, but session cleared",
            };
            console.log("Sending error response:", errorResponse);
            res.status(500).json(errorResponse);
        }
    };
}
