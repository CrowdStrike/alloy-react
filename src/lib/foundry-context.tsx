import FalconApi, { LocalData } from "@crowdstrike/foundry-js";
import { createContext, useContext, useEffect, useState } from "react";

interface IFoundryContext {
  falcon: FalconApi<LocalData> | undefined;
  data: LocalData | undefined;
  isInitialized: boolean;
}

const FoundryContext = createContext<IFoundryContext>({
  falcon: undefined,
  data: undefined,
  isInitialized: false,
});

export function FoundryProvider({ children }: { children: React.ReactNode }) {
  const [falcon] = useState(() => new FalconApi());
  const [data, setData] = useState<LocalData>();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    falcon.connect().then(() => {
      if (isMounted) {
        setIsInitialized(falcon.isConnected);
        setData(falcon.data);
        falcon.events.on("data", setData);
      }
    });

    return () => {
      // cleanup function on unrender
      isMounted = false;
      falcon.events.off("data", setData);
    };
  }, [falcon]);

  return (
    <FoundryContext.Provider value={{ falcon, data, isInitialized }}>
      {children}
    </FoundryContext.Provider>
  );
}

export function useFoundry() {
  const context = useContext(FoundryContext);
  if (context === undefined) {
    throw new Error("useFoundry must be used within a FoundryProvider");
  }
  return context;
}
