import {
  Alert,
  AlertActionCloseButton,
  Button,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Spinner,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
import { useEffect, useState } from "react";
import { useFoundry } from "../../lib/foundry-context";

import "./collection-editor.css";

type AlertVariant = "custom" | "info" | "warning" | "success" | "danger";

interface CollectionEditorProps {
  /** Default collection name to display. */
  collectionNameDefault?: string;
  /** Whether collection name is editable (use with `collectionNameDefault`). */
  collectionNameEditable?: boolean;
  /** Default object name to display. */
  objectNameDefault?: string;
  /** Whether object name is editable (use with `collectionNameDefault`). */
  objectNameEditable?: boolean;
  /** Whether to load the object value on render (requires `collectionNameDefault` and `objectNameDefault`). */
  loadObjectValue?: boolean;
  /**
   * Default object value to display if, when an object is loaded, it doesn't exist in the collection.
   * This includes cases where collection and/or object name are editable and user loads the object
   * manually, and when the value is loaded automatically on render via `loadObjectValue`
   */
  objectValueDefault?: object;
  /** Whether the load button is visible. */
  loadButtonVisible?: boolean;
  /** Whether the save button is visible. */
  saveButtonVisible?: boolean;
  /** Whether the delete button is visible. */
  deleteButtonVisible?: boolean;
}

/**
 * Provides a basic JSON editor to interact with collection objects.
 */
export function CollectionEditor({
  collectionNameDefault = "",
  collectionNameEditable = true,
  objectNameDefault = "",
  objectNameEditable = true,
  objectValueDefault = {},
  loadObjectValue = false,
  loadButtonVisible = true,
  saveButtonVisible = true,
  deleteButtonVisible = true,
}: CollectionEditorProps) {
  const { falcon, isInitialized } = useFoundry();

  const [collectionName, setCollectionName] = useState(collectionNameDefault);
  const [objectName, setObjectName] = useState(objectNameDefault);
  const [objectValue, setObjectValue] = useState("");

  const [loading, setLoading] = useState(false);
  const [alertTitle, setAlertTitle] = useState<null | string>(null);
  const [alertText, setAlertText] = useState<null | string>(null);
  const [alertVariant, setAlertVariant] = useState<AlertVariant>("info");
  function setAlert(title: string, text: string | null, variant: AlertVariant) {
    setAlertTitle(title);
    setAlertText(text);
    setAlertVariant(variant);
  }

  // load object value on render
  useEffect(() => {
    if (
      loadObjectValue &&
      collectionNameDefault.length > 0 &&
      objectNameDefault.length > 0
    ) {
      handleLoad();
    }
  }, [loadObjectValue, collectionNameDefault, objectNameDefault]);

  if (!isInitialized) return null;

  function handleLoad() {
    setLoading(true);
    falcon!
      .collection({ collection: collectionName })
      .read(objectName)
      .then((r: any) => {
        setLoading(false);
        if (r.errors && r.errors.length > 0) {
          const msg = r.errors[0].message as string;
          if (msg.indexOf("object not found") >= 0) {
            setAlert(
              "Object not found",
              "No object by that name exists, but you can still save a new object with that name",
              "info"
            );
            setObjectValue(JSON.stringify(objectValueDefault, null, 2));
          } else if (msg.indexOf("collection not found") >= 0) {
            setAlert(
              "Collection not found",
              "No collection exists with that name, check your spelling and app configuration",
              "warning"
            );
          } else {
            setAlert("Error occurred", r.errors[0].message, "danger");
          }
        } else {
          setAlert(
            "Object loaded",
            "You can make changes and save it, or you can delete it",
            "success"
          );
          setObjectValue(JSON.stringify(r, null, 2));
        }
      });
  }

  function handleSave() {
    setLoading(true);
    falcon!
      .collection({ collection: collectionName })
      .write(objectName, JSON.parse(objectValue))
      .then((r: any) => {
        setLoading(false);
        if (r.errors && r.errors.length > 0) {
          setAlert("Error occurred", r.errors[0].message, "danger");
        } else {
          setAlert(
            "Object saved",
            `Saved at ${r.resources[0].last_modified_time}`,
            "success"
          );
        }
      });
  }

  function handleDelete() {
    setLoading(true);
    falcon!
      .collection({ collection: collectionName })
      .delete(objectName)
      .then((r: any) => {
        setLoading(false);
        if (r.errors && r.errors.length > 0) {
          setAlert("Error occurred", r.errors[0].message, "danger");
        } else {
          setAlert("Object deleted", null, "success");
        }
      });
  }

  return (
    <>
      {alertTitle && (
        <Alert
          variant={alertVariant}
          title={alertTitle}
          actionClose={
            <AlertActionCloseButton onClose={() => setAlertTitle(null)} />
          }
        >
          {alertText}
        </Alert>
      )}
      <Form>
        <Grid hasGutter>
          <GridItem span={4}>
            <FormGroup label="Collection name" fieldId="collection-name">
              <TextInput
                value={collectionName}
                onChange={(_, v) => {
                  setCollectionName(v);
                }}
                isDisabled={loading || !collectionNameEditable}
                id="collection-name"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label="Object name" fieldId="object-name">
              <TextInput
                value={objectName}
                onChange={(_, v) => {
                  setObjectName(v);
                }}
                isDisabled={loading || !objectNameEditable}
                id="object-name"
              />
            </FormGroup>
          </GridItem>
          <GridItem span={4}>
            <FormGroup label=" ">
              {loadButtonVisible && (
                <Button
                  variant="secondary"
                  onClick={handleLoad}
                  isDisabled={loading}
                  className="alloy-ce-btn"
                >
                  Load Object
                </Button>
              )}
              {saveButtonVisible && (
                <Button
                  variant="secondary"
                  onClick={handleSave}
                  isDisabled={loading}
                  className="alloy-ce-btn"
                >
                  Save
                </Button>
              )}
              {deleteButtonVisible && (
                <Button
                  variant="secondary"
                  onClick={handleDelete}
                  isDanger
                  isDisabled={loading}
                  className="alloy-ce-btn"
                >
                  Delete
                </Button>
              )}
              {loading && <Spinner size="lg" />}
            </FormGroup>
          </GridItem>
          <GridItem span={12}>
            <FormGroup label="Object value" fieldId="object-value">
              <TextArea
                autoResize
                value={objectValue}
                onChange={(_, v) => {
                  setObjectValue(v);
                }}
                isDisabled={loading}
                style={{ fontFamily: "monospace" }}
                id="object-value"
              />
            </FormGroup>
          </GridItem>
        </Grid>
      </Form>
    </>
  );
}
