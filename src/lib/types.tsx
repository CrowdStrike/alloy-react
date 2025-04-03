interface ApiResponse {
  meta?: {
    /** Query execution time, as a decimal. */
    query_time: number;
    /** Backing CrowdStrike API. */
    powered_by: string;
    /** Trace for debugging. */
    trace_id: string;
  };
  /** Errors returned by the API call */
  errors?: {
    code: number;
    message: string;
  }[];
}

/**
 * Returned by `falcon.collection().read()`. A successful read contains only the object data following
 * its schema. An unsuccessful read will contain the `meta` and `errors` keys. Example:
 *
 * ```
 * falcon
 *   .collection({ collection: "foo" })
 *   .read("bar")
 *   .then((r: CollectionReadResponse) => {
 *     if (r.errors && r.errors.length > 0) {
 *       setError(r.errors[0].message);
 *     } else {
 *       setValue(r);
 *     }});
 * ```
 */
export interface CollectionReadResponse extends ApiResponse {
  /** Arbitrary data matching the collection's schema. */
  [key: string]: any;
}

/**
 * Internal common response between write and delete.
 */
interface CollectionModifyResponse extends ApiResponse {
  /** A single element array containing metadata about the modified object. */
  resources: {
    /** Container the app ID. */
    namespace: string;
    /** Collection name. */
    collection_name: string;
    /** Object key. */
    object_key: string;
    /** Object last modified datetime, e.g. `2025-03-25T13:49:16.146417292Z`. */
    last_modified_time: string;
    /** Collection schema version, e.g. `v2.0`. */
    schema_version: string;
  }[];
}

/**
 * Returned by `falcon.collection().write()`. See {@link CollectionReadResponse} for an example.
 */
export interface CollectionWriteResponse extends CollectionModifyResponse {}

/**
 * Returned by `falcon.collection().delete()`. See {@link CollectionReadResponse} for an example.
 */
export interface CollectionDeleteResponse extends CollectionModifyResponse {}
