import { jest } from "@jest/globals";

/**
 * Stub that enables `jest.mock("./foundry-context")` since we won't have an actual `FoundryProvider`
 * in a local test. Return a mock `FalconApi` (see `FalconApi` mock docs):

 *
 * ```javascript
 * (useFoundry as jest.Mock).mockReturnValue({
 *   isInitialized: true,
 *   falcon: mockFalcon,
 * });
 * ```
 */
export const useFoundry = jest.fn();
