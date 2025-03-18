interface CanError {
  /** Errors returned by the API call */
  errors?: {
    code: number;
    message: string;
  }[];
}

/**
 * Returned by `falcon.collection().read()`. Example:
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
export interface CollectionReadResponse extends CanError {
  /** Arbitrary data matching the collection's schema */
  [key: string]: any;
}
