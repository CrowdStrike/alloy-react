import { jest } from "@jest/globals";

// Mock the LocalData interface
export interface LocalData {
  [key: string]: any;
}

export const FalconApi = jest.fn();
