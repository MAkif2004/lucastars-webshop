// api/src/services/UserService.ts (Fixed)
import { IUser } from "../../../shared/types";
import { DatabaseService } from "./DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";
import { hash, compare } from "bcrypt-ts/node";

interface UserPasswordQueryResult {
    password: string;
}

interface AddressData {
    street?: string | null;
    houseNumber?: string | null;
    postalCode?: string | null;
    city?: string | null;
    country?: string | null;
}

interface ExistingAddressResult {
    id: number;
}

export class UserService {
    private readonly _databaseService: DatabaseService = new DatabaseService();
    private readonly SALT_ROUNDS: number = 10;

    private _getUserBaseQuery(): string {
        return `
            SELECT
                u.id,
                u.username,
                u.email,
                u.firstName,
                u.prefix,
                u.lastName,
                a.street,
                a.houseNumber,
                a.postalCode,
                a.city,
                a.country,
                u.created,
                u.updated
            FROM users u
            LEFT JOIN addresses a ON u.id = a.userId
        `;
    }

    public async getUserByUsername(username: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.username = ?
                `,
                username
            );
            if (result.length !== 1) {
                return undefined;
            }
            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user by username: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getUserByEmail(email: string): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.email = ?
                `,
                email
            );
            if (result.length !== 1) {
                return undefined;
            }
            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user by email: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async getUserById(userId: number): Promise<IUser | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: IUser[] = await this._databaseService.query<IUser[]>(
                connection,
                `
                ${this._getUserBaseQuery()}
                WHERE u.id = ?
                `,
                userId
            );

            if (result.length !== 1) {
                return undefined;
            }

            return result[0];
        }
        catch (e: unknown) {
            throw new Error(`Failed to get user from session: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async createUser(
        username: string,
        email: string,
        firstName: string,
        prefix: string | undefined,
        lastName: string,
        password: string
    ): Promise<number | undefined> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // Hash the password
            const hashedPassword: string = await hash(password, this.SALT_ROUNDS);

            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `
                INSERT INTO users (username, email, firstName, prefix, lastName, password)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                username,
                email,
                firstName,
                prefix || null,
                lastName,
                hashedPassword
            );
            return result.insertId > 0 ? result.insertId : undefined;
        }
        catch (e: unknown) {
            throw new Error(`Failed to create user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    public async verifyPassword(email: string, password: string): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            const result: UserPasswordQueryResult[] = await this._databaseService.query<UserPasswordQueryResult[]>(
                connection,
                `
                SELECT password
                FROM users
                WHERE email = ?
                `,
                email
            );

            if (result.length !== 1) {
                return false;
            }

            const hashedPassword: string = result[0].password;

            return await compare(password, hashedPassword);
        }
        catch (error: unknown) {
            console.error("Password verification error:", error);
            return false;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Update user information
     */
    public async updateUser(userId: number, updateData: Partial<IUser>): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // Build dynamic update query
            const updateFields: string[] = [];
            const values: (string | null)[] = [];

            if (updateData.firstName !== undefined) {
                updateFields.push("firstName = ?");
                values.push(updateData.firstName);
            }
            if (updateData.prefix !== undefined) {
                updateFields.push("prefix = ?");
                values.push(updateData.prefix || null);
            }
            if (updateData.lastName !== undefined) {
                updateFields.push("lastName = ?");
                values.push(updateData.lastName);
            }

            if (updateFields.length === 0) {
                return true; // Nothing to update
            }

            // Add userId for WHERE clause
            values.push(userId.toString());

            const query: string = `
                UPDATE users 
                SET ${updateFields.join(", ")}, updated = CURRENT_TIMESTAMP
                WHERE id = ?
            `;

            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                query,
                ...values
            );

            return result.affectedRows > 0;
        }
        catch (e: unknown) {
            throw new Error(`Failed to update user: ${e}`);
        }
        finally {
            connection.release();
        }
    }

    /**
     * Update user address - FIXED VERSION
     */
    public async updateUserAddress(userId: number, addressData: AddressData): Promise<boolean> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            // First check if address exists
            const checkQuery: string = `
                SELECT id FROM addresses WHERE userId = ?
            `;

            const existingAddress: ExistingAddressResult[] = await this._databaseService.query<ExistingAddressResult[]>(
                connection,
                checkQuery,
                userId
            );

            if (existingAddress.length === 0) {
                // Insert new address
                const insertQuery: string = `
                    INSERT INTO addresses (userId, street, houseNumber, postalCode, city, country)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                    connection,
                    insertQuery,
                    userId,
                    addressData.street || null,
                    addressData.houseNumber || null,
                    addressData.postalCode || null,
                    addressData.city || null,
                    addressData.country || null
                );

                return result.affectedRows > 0;
            }
            else {
                // Update existing address - REMOVED updated_at reference
                const updateFields: string[] = [];
                const values: (string | null)[] = [];

                if (addressData.street !== undefined) {
                    updateFields.push("street = ?");
                    values.push(addressData.street || null);
                }
                if (addressData.houseNumber !== undefined) {
                    updateFields.push("houseNumber = ?");
                    values.push(addressData.houseNumber || null);
                }
                if (addressData.postalCode !== undefined) {
                    updateFields.push("postalCode = ?");
                    values.push(addressData.postalCode || null);
                }
                if (addressData.city !== undefined) {
                    updateFields.push("city = ?");
                    values.push(addressData.city || null);
                }
                if (addressData.country !== undefined) {
                    updateFields.push("country = ?");
                    values.push(addressData.country || null);
                }

                if (updateFields.length === 0) {
                    return true; // Nothing to update
                }

                // Add userId for WHERE clause
                values.push(userId.toString());

                // FIXED: Removed reference to updated_at column
                const updateQuery: string = `
                    UPDATE addresses 
                    SET ${updateFields.join(", ")}
                    WHERE userId = ?
                `;

                const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                    connection,
                    updateQuery,
                    ...values
                );

                return result.affectedRows > 0;
            }
        }
        catch (e: unknown) {
            console.error("Error in updateUserAddress:", e);
            throw new Error(`Failed to update address: ${e}`);
        }
        finally {
            connection.release();
        }
    }
}
