import { IUserRegisterDTO, IAuthResponse, AuthVerifyResponse } from "@shared/types";

class AuthService {
    private _isLoggedIn: boolean = false;
    private _isLoggedInPromise: Promise<boolean> | null = null;

    public constructor() {
        void this.isLoggedIn();
    }

    /**
     * Checks if the user is logged in by checking the with the API
     */
    public async isLoggedIn(): Promise<boolean> {
        // If a request is already in progress return the same promise to avoid multiple calls to our api
        if (this._isLoggedInPromise) {
            return this._isLoggedInPromise;
        }

        // If we already know the user is logged in return true
        if (this._isLoggedIn) {
            return true;
        }

        // If we don't know if the user is logged in then make a request to the api
        this._isLoggedInPromise = (async () => {
            try {
                const successResponse: AuthVerifyResponse = await this.verifyLoggedIn();
                this._isLoggedIn = successResponse.loggedIn;
                return this._isLoggedIn;
            }
            catch {
                this._isLoggedIn = false;
                return false;
            }
            finally {
                // Clear the cached promise once the request is complete
                this._isLoggedInPromise = null;
            }
        })();

        return this._isLoggedInPromise;
    }

    private async verifyLoggedIn(): Promise<AuthVerifyResponse> {
        const url: string = `${VITE_API_URL}auth/verify`;
        const response: Response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include", // Include cookies for session
        });

        return response.json() as Promise<AuthVerifyResponse>;
    }

    /**
     * Register a new user
     */
    public async register(userData: IUserRegisterDTO): Promise<IAuthResponse> {
        try {
            const url: string = `${VITE_API_URL}auth/register`;

            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData),
                credentials: "include", // Include cookies for session
            });

            console.log("Response status:", response.status, response.statusText);

            // Rest of the method remains the same...
            // Try to read the response text first
            let text: string;
            try {
                text = await response.text();
                console.log("Raw response text:", text);
            }
            catch (readError) {
                console.error("Error reading response text:", readError);
                return {
                    success: false,
                    message: "Failed to read server response",
                };
            }

            if (!text || text.trim() === "") {
                console.warn("Server returned empty response");
                return {
                    success: false,
                    message: "Server returned empty response",
                };
            }

            // Parse the text as JSON
            try {
                const data: IAuthResponse = JSON.parse(text) as IAuthResponse;
                console.log("Parsed response data:", data);

                // Update login state if successful
                if (data.success) {
                    this._isLoggedIn = true;
                }

                return data;
            }
            catch (parseError) {
                const errorMessage: string = parseError instanceof Error ? parseError.message : String(parseError);
                console.error("JSON parse error:", errorMessage);
                console.error("Response text that failed to parse:", text);
                return {
                    success: false,
                    message: "Invalid response format from server",
                };
            }
        }
        catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            console.error("Registration error:", errorMessage);
            return {
                success: false,
                message: "An error occurred during registration",
            };
        }
    }

    /**
     * Login a user
     */
    public async login(email: string, password: string): Promise<IAuthResponse> {
        try {
            const url: string = `${VITE_API_URL}auth/login`;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
                credentials: "include", // Include cookies for session
            });

            console.log("Login response status:", response.status, response.statusText);

            // Try to read the response text first
            let text: string;
            try {
                text = await response.text();
                console.log("Raw login response text:", text);
            }
            catch (readError) {
                console.error("Error reading login response text:", readError);
                return {
                    success: false,
                    message: "Failed to read server response",
                };
            }

            if (!text || text.trim() === "") {
                console.warn("Server returned empty response");
                return {
                    success: false,
                    message: "Server returned empty response",
                };
            }

            // Parse the text as JSON
            try {
                const data: IAuthResponse = JSON.parse(text) as IAuthResponse;
                console.log("Parsed login response data:", data);

                // Update login state if successful
                if (data.success) {
                    this._isLoggedIn = true;
                }

                return data;
            }
            catch (parseError) {
                const errorMessage: string = parseError instanceof Error ? parseError.message : String(parseError);
                console.error("JSON parse error:", errorMessage);
                console.error("Response text that failed to parse:", text);
                return {
                    success: false,
                    message: "Invalid response format from server",
                };
            }
        }
        catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            console.error("Login error:", errorMessage);
            return {
                success: false,
                message: "An error occurred during login",
            };
        }
    }

    /**
     * Logout the current user
     */
    public async logout(): Promise<IAuthResponse> {
        try {
            console.log("AuthService: Logging out user");

            const url: string = `${VITE_API_URL}auth/logout`;
            const response: Response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // Include cookies for session
            });

            console.log("AuthService: Logout response status:", response.status, response.statusText);

            // Always reset login state regardless of response
            this._isLoggedIn = false;
            this._isLoggedInPromise = null;

            // Try to read the response text
            let text: string;
            try {
                text = await response.text();
                console.log("Raw logout response text:", text);
            }
            catch (readError) {
                console.error("Error reading logout response text:", readError);
                // Even if we can't read response, logout was likely successful
                return {
                    success: true,
                    message: "Logged out (response unreadable)",
                };
            }

            if (!text || text.trim() === "") {
                console.warn("Server returned empty logout response");
                return {
                    success: true,
                    message: "Logged out (empty response)",
                };
            }

            // Parse the text as JSON
            try {
                const data: IAuthResponse = JSON.parse(text) as IAuthResponse;
                console.log("Parsed logout response data:", data);
                return data;
            }
            catch (parseError) {
                const errorMessage: string = parseError instanceof Error ? parseError.message : String(parseError);
                console.error("JSON parse error:", errorMessage);
                console.error("Response text that failed to parse:", text);
                // Even if parsing fails, logout was likely successful
                return {
                    success: true,
                    message: "Logged out (response parse error)",
                };
            }
        }
        catch (error) {
            const errorMessage: string = error instanceof Error ? error.message : String(error);
            console.error("AuthService: Logout error:", errorMessage);

            // Always reset login state even on error
            this._isLoggedIn = false;
            this._isLoggedInPromise = null;

            return {
                success: true, // Still return success to allow redirect
                message: "Logged out (with errors)",
            };
        }
    }
}

// Create a singleton instance
export const authService: AuthService = new AuthService();
