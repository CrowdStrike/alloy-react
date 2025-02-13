import { Panel } from "@patternfly/react-core";
import { ReactNode } from "react";

import { PatternflyShim } from "../PatterflyShim";
import "./ConsoleExtension.css";

interface ConsoleExtensionProps {
  children?: ReactNode;
}

export function ConsoleExtension({ children }: ConsoleExtensionProps) {
  return (
    <PatternflyShim>
      <Panel className="alloy-main">{children}</Panel>
    </PatternflyShim>
  );
}
