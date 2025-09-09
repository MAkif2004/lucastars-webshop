import { DatabaseService } from "@api/services/DatabaseService";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

const COLOR_GREEN: string = "\x1b[32m";
const COLOR_GRAY: string = "\x1b[90m";
const COLOR_RESET: string = "\x1b[0m";

// Type definition for records that will be passed between seeders
export type SeederRecord = Record<string, unknown> & { id?: number };

/**
 * Seeder class to seed the database with test data.
 *
 * @remarks The template type T should have all the columns of the table to seed.
 */
export abstract class Seeder<T extends { id?: number }> {
    protected readonly _databaseService: DatabaseService;

    /**
     * The name of the table to seed.
     */
    protected abstract _table: string;

    private _devMode: boolean;

    /**
     * Constructor for the Seeder class.
     *
     * @param databaseService The DatabaseService instance to use for database operations.
     */
    public constructor(devMode: boolean, databaseService: DatabaseService = new DatabaseService()) {
        this._devMode = devMode;
        this._databaseService = databaseService;
    }

    /**
     * Get the records to seed the database with.
     *
     * @param count The number of records to generate.
     * @param seederRecords Contains records passed from other seeders.
     * @remarks return type should match the table columns defined in `_tableColumns`
     */
    protected abstract getRecords(count: number, seederRecords: SeederRecord[][]): SyncOrAsync<T[]>;

    /**
     * Get the records to seed the database with in development mode.
     *
     * @param count The number of records to generate.
     * @param seederRecords Contains records passed from other seeders.
     * @remarks Defaults to the same as `getRecords` but can be overridden to provide different data for development.
     */
    protected getRecordsDev(count: number, seederRecords: SeederRecord[][]): SyncOrAsync<T[]> {
        return this.getRecords(count, seederRecords);
    }

    /**
     * Seed the database with test data.
     *
     * @param count The number of records to generate.
     * @param seederRecords Contains records passed from other seeders.
     */
    public async seed(count: number, ...seederRecords: SeederRecord[][]): Promise<T[]> {
        const connection: PoolConnection = await this._databaseService.openConnection();

        // Get the records to insert. If we are in dev mode, we will use the dev records.
        const records: T[] = this._devMode
            ? await this.getRecordsDev(count, seederRecords)
            : await this.getRecords(count, seederRecords);

        if (records.length === 0) {
            console.log(`${COLOR_GRAY}No records to seed for ${this._table}${COLOR_RESET}`);
            return [];
        }

        try {
            console.log(`${COLOR_GRAY}Seeding records to ${this._table}...${COLOR_RESET}`);

            const columns: string[] = Object.keys(records[0]);
            const values: unknown[] = records.map(record => Object.values(record));

            const result: ResultSetHeader = await this._databaseService.query<ResultSetHeader>(
                connection,
                `INSERT INTO \`${this._table}\`
                    (${columns.join(", ")})
                VALUES
                    ?`,
                [...values]
            );

            // If the number of affected rows does not equal the amount of records, throw an error
            if (result.affectedRows !== records.length) {
                throw new Error(`Failed to insert ${records.length} records`);
            }

            // We set the id that we got from the database to the records
            for (let i: number = 0; i < records.length; i++) {
                records[i].id = result.insertId + i;
            }

            console.log(`${COLOR_GREEN}Successfully seeded ${records.length} records${COLOR_RESET}`);

            return records;
        }
        finally {
            connection.release();
        }
    }

    /**
     * Truncates the table.
     *
     * @remarks This action is descructive and will remove all data from the table.
     */
    public async truncate(): Promise<void> {
        const connection: PoolConnection = await this._databaseService.openConnection();
        try {
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 0");
            await this._databaseService.query(connection, `TRUNCATE TABLE \`${this._table}\``);
            await this._databaseService.query(connection, "SET FOREIGN_KEY_CHECKS = 1");
        }
        finally {
            connection.release();
        }
    }
}
