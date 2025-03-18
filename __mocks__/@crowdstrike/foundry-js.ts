import { jest } from "@jest/globals";

/**
 * Stub that enables `jest.mock("@crowdstrike/foundry-js")` since we won't be able to interact with
 * Foundry from a local test. Mock specific function calls in individual tests, for example:
 *
 * ```
 * const mockReadResponse = { special_key: "special_value" };
 * const mockCollection = {
 *   read: jest
 *     .fn<() => Promise<CollectionReadResponse>>()
 *     .mockResolvedValue(mockReadResponse),
 * };
 * const mockFalcon = {
 *   collection: jest.fn().mockReturnValue(mockCollection),
 * };
 * ```
 */
export const FalconApi = jest.fn();
