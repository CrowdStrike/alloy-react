import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { renderHook, waitFor } from "@testing-library/react";
import { useFoundry } from "./foundry-context";
import { useCollectionObject } from "./hooks";
import { CollectionReadResponse } from "./types";

jest.mock("./foundry-context");
jest.mock("@crowdstrike/foundry-js");

describe("useCollectionObject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns object when read succeeds", async () => {
    // mock falcon api collection response
    const mockReadResponse = { special_key: "special_value" };
    const mockCollection = {
      read: jest
        .fn<() => Promise<CollectionReadResponse>>()
        .mockResolvedValue(mockReadResponse),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // mock useFoundry to use mock falcon api
    (useFoundry as jest.Mock).mockReturnValue({
      isInitialized: true,
      falcon: mockFalcon,
    });

    const { result } = renderHook(() =>
      useCollectionObject("test-collection", "test-key")
    );

    // wait for ready
    await waitFor(() => {
      expect(result.current[1]).toBe(true);
    });

    // ensure falcon api called correctly
    expect(mockFalcon.collection).toHaveBeenCalledWith({
      collection: "test-collection",
    });
    expect(mockCollection.read).toHaveBeenCalledWith("test-key");

    // ensure response contains value
    expect(result.current[0]).toEqual(mockReadResponse); // value
    expect(result.current[1]).toBe(true); // complete
    expect(result.current[2]).toBe(null); // error
  });

  test("returns error when read fails", async () => {
    // mock falcon api collection response
    const errorMessage = "error_message";
    const mockReadResponse = { errors: [{ code: 500, message: errorMessage }] };
    const mockCollection = {
      read: jest
        .fn<() => Promise<CollectionReadResponse>>()
        .mockResolvedValue(mockReadResponse),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };

    // mock useFoundry to use mock falcon api
    (useFoundry as jest.Mock).mockReturnValue({
      isInitialized: true,
      falcon: mockFalcon,
    });

    const { result } = renderHook(() =>
      useCollectionObject("test-collection", "test-key")
    );

    // wait for ready
    await waitFor(() => {
      expect(result.current[1]).toBe(true);
    });

    // ensure response contains value
    expect(result.current[0]).toEqual(null); // value
    expect(result.current[1]).toBe(true); // complete
    expect(result.current[2]).toBe(errorMessage); // error
  });
});
