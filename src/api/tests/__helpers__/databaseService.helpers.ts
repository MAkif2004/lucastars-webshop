import { DatabaseService } from "@api/services/DatabaseService";
import { PoolConnection } from "mysql2/promise";
import { MockInstance, vi } from "vitest";
import { mock, MockProxy } from "vitest-mock-extended";

export type MockDatabaseService = {
    poolConnection: MockProxy<PoolConnection>;
    openConnection: MockInstance<DatabaseService["openConnection"]>;
    query: MockInstance<DatabaseService["query"]>;
};

export function createMockDatabaseService(): MockDatabaseService {
    const poolConnectionMock: MockProxy<PoolConnection> = mock<PoolConnection>();

    const openConnectionMock: MockInstance<DatabaseService["openConnection"]> = vi
        .spyOn(DatabaseService.prototype, "openConnection")
        .mockResolvedValue(poolConnectionMock);

    const queryMock: MockInstance<DatabaseService["query"]> = vi
        .spyOn(DatabaseService.prototype, "query");

    return {
        poolConnection: poolConnectionMock,
        openConnection: openConnectionMock,
        query: queryMock,
    };
}
