import { Request, Response } from "express";
import { MockRequest as NodeMockRequest, MockResponse as NodeMockResponse } from "node-mocks-http";
import supertest from "supertest";
import TestAgent from "supertest/lib/agent";
import { App } from "supertest/types";
export {
    createRequest as createMockRequest,
    createResponse as createMockResponse
} from "node-mocks-http";

export type TestApp = TestAgent;
export type TestResponse = supertest.Response;
export type MockRequest = NodeMockRequest<Request>;
export type MockResponse = NodeMockResponse<Response>;

export function createTestApp(app: unknown): TestAgent {
    return supertest(app as App);
}
