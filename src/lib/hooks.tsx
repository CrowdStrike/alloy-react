import { useEffect, useState } from "react";
import { useFoundry } from "./foundry-context";
import { CollectionReadResponse } from "./types";

/** Query a collection object. This hook is useful to look up a well known value when a component
 * renders, for example a configuration value.
 *
 * Example:
 *
 * ```
 * const [config, configReady, configError] = useCollectionObject("config", "default");
 * useEffect(() => {
 *   if (!configReady) return;
 *   if (configError) return; // TODO: handle error
 *   // TODO: use config value
 * }, [configReady])
 * ```
 */
export function useCollectionObject(
  /** Collection name to query */
  collection: string,
  /** Object key to query */
  key: string
): [
  /** The object value, if exists, otherwise `null` */
  any,
  /** True when the query is complete (regardless of the result of the query, including error) */
  boolean,
  /** Error response message, if any, otherwise `null` */
  string | null
] {
  const { falcon, isInitialized } = useFoundry();
  const [value, setValue] = useState<object | null>(null);
  const [complete, setComplete] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (!isInitialized) return;
    falcon!
      .collection({ collection: collection })
      .read(key)
      .then((r: CollectionReadResponse) => {
        if (r.errors && r.errors.length > 0) {
          setError(r.errors[0].message);
        } else {
          setValue(r);
        }
        setComplete(true);
      });
  }, [isInitialized]);

  return [value, complete, error];
}
