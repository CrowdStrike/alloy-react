import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom/jest-globals";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  CollectionDeleteResponse,
  CollectionReadResponse,
  CollectionWriteResponse,
} from "../../lib";
import { useFoundry } from "../../lib/foundry-context";
import { CollectionEditor } from "./CollectionEditor";

jest.mock("../../lib/foundry-context");
jest.mock("@crowdstrike/foundry-js");

const mockObject = {
  special_key: "baz",
};

const mockResources = [
  {
    object_key: "key-name",
    last_modified_time: "2021-01-01T00:00:00Z",
    namespace: "abc123",
    collection_name: "col-name",
    schema_version: "v1.0",
  },
];

/** Type into the collection editor fields */
function typeInputs(colName: string, objName: string, objValue: string | null) {
  fireEvent.change(screen.getByLabelText("Collection name"), {
    target: { value: colName },
  });
  fireEvent.change(screen.getByLabelText("Object name"), {
    target: { value: objName },
  });
  if (objValue)
    fireEvent.change(screen.getByLabelText("Object value"), {
      target: { value: objValue },
    });
}

describe("CollectionEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("is empty and enabled by default", () => {
    // just need to ensure isInitialized = true so the editor renders
    (useFoundry as jest.Mock).mockReturnValue({
      isInitialized: true,
      falcon: jest.fn(),
    });

    render(<CollectionEditor />);

    ["Collection name", "Object name", "Object value"].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeEnabled();
      expect(screen.getByLabelText(label)).toHaveValue("");
    });

    ["Load Object", "Save", "Delete"].forEach((name) => {
      expect(screen.getByRole("button", { name })).toBeEnabled();
    });
  });

  test("can load an object", async () => {
    const mockCollection = {
      read: jest
        .fn<() => Promise<CollectionReadResponse>>()
        .mockResolvedValue(mockObject),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (useFoundry as jest.Mock).mockReturnValue({
      falcon: mockFalcon,
      isInitialized: true,
    });

    render(<CollectionEditor />);
    typeInputs("col-name", "obj-name", null);
    // button clicks require await/async to resolve promise from falcon.collection.read()
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Load Object" }));
    });

    expect(mockFalcon.collection).toHaveBeenCalledWith({
      collection: "col-name",
    });
    expect(mockCollection.read).toHaveBeenCalledWith("obj-name");
    expect(screen.getByLabelText("Object value")).toHaveValue(
      JSON.stringify(mockObject, null, 2)
    );
  });

  test("can save an object", async () => {
    const mockCollection = {
      write: jest
        .fn<() => Promise<CollectionWriteResponse>>()
        .mockResolvedValue({
          resources: mockResources,
        }),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (useFoundry as jest.Mock).mockReturnValue({
      falcon: mockFalcon,
      isInitialized: true,
    });

    render(<CollectionEditor />);
    const newValue = { value: "obj-value" };
    typeInputs("col-name", "obj-name", JSON.stringify(newValue));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Save" }));
    });

    expect(mockFalcon.collection).toHaveBeenCalledWith({
      collection: "col-name",
    });
    expect(mockCollection.write).toHaveBeenCalledWith("obj-name", newValue);
  });

  test("can delete an object", async () => {
    const mockCollection = {
      delete: jest
        .fn<() => Promise<CollectionDeleteResponse>>()
        .mockResolvedValue({
          resources: mockResources,
        }),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (useFoundry as jest.Mock).mockReturnValue({
      falcon: mockFalcon,
      isInitialized: true,
    });

    render(<CollectionEditor />);
    typeInputs("col-name", "obj-name", null);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    });

    expect(mockFalcon.collection).toHaveBeenCalledWith({
      collection: "col-name",
    });
    expect(mockCollection.delete).toHaveBeenCalledWith("obj-name");
  });

  test("can auto-load a locked object", async () => {
    const mockCollection = {
      read: jest
        .fn<() => Promise<CollectionReadResponse>>()
        .mockResolvedValue(mockObject),
    };
    const mockFalcon = {
      collection: jest.fn().mockReturnValue(mockCollection),
    };
    (useFoundry as jest.Mock).mockReturnValue({
      falcon: mockFalcon,
      isInitialized: true,
    });

    // await/async to ensure load-on-render completes
    await act(async () => {
      render(
        <CollectionEditor
          collectionNameDefault="col-name"
          collectionNameEditable={false}
          objectNameDefault="obj-name"
          objectNameEditable={false}
          loadObjectValue={true}
          loadButtonVisible={false}
          deleteButtonVisible={false}
        />
      );
    });

    const colName = screen.getByLabelText("Collection name");
    expect(colName).toBeDisabled();
    expect(colName).toHaveValue("col-name");
    const objName = screen.getByLabelText("Object name");
    expect(objName).toBeDisabled();
    expect(objName).toHaveValue("obj-name");
    const objValue = screen.getByLabelText("Object value");
    expect(objValue).toBeEnabled();
    expect(objValue).toHaveValue(JSON.stringify(mockObject, null, 2));

    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    ["Load Object", "Delete"].forEach((name) => {
      expect(screen.queryByRole("button", { name })).not.toBeInTheDocument();
    });
  });
});
