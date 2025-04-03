import { Panel } from "@patternfly/react-core";
import { ReactNode } from "react";

import { PatternflyShim } from "../PatterflyShim";
import "./ConsoleExtension.css";

interface ConsoleExtensionProps {
  /** Children to display within the extension. */
  children: ReactNode;
}

/**
 * Represents a Foundry UI extension. Pass any children you'd like.
 */
export function ConsoleExtension({ children }: ConsoleExtensionProps) {
  return (
    <PatternflyShim>
      <Panel className="alloy-main">{children}</Panel>
    </PatternflyShim>
  );
}
