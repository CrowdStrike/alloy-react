import {
  Masthead,
  MastheadBrand,
  MastheadMain,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSidebar,
  PageSidebarBody,
  Title,
} from "@patternfly/react-core";
import { ReactElement, ReactNode } from "react";
import {
  HashRouter,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import { PatternflyShim } from "../PatterflyShim";

interface ConsolePageProps {
  /** For single pages, pass in children components. */
  children?: ReactNode;
  /** Title of the page to display in the masthead. */
  title: string;
  /** For multi-pages, pass in routes to generate navigation structure. */
  routes?: ConsolePageRoute[];
}

interface ConsolePageRoute {
  /**
   * Path of the route e.g. `/home`. This path can be used to configure Falcon navigation directly
   * to this route.
   */
  path: string;
  /** Title to display in the navigation (will not automatically be added as a heading in the page.) */
  title: string;
  /** The element to render when the route is active. */
  element: ReactElement;
}

/**
 * Represents a full Foundry UI page using the {@link https://www.patternfly.org/components/page|PatternFly Page}
 * component. A `ConsolePage` may be a single page (in this case, just pass child `<PageSection>`s)
 * or contain its own navigation structure (in this case, pass in `routes` where each `element` contains
 * `<PageSection>`s).
 */
export function ConsolePage({ children, title, routes }: ConsolePageProps) {
  return (
    <PatternflyShim>
      <HashRouter>
        <ConsolePageLayout title={title} routes={routes}>
          {children}
        </ConsolePageLayout>
      </HashRouter>
    </PatternflyShim>
  );
}

/**
 * Internal component representing the layout of a `ConsolePage`, but without a router. This is
 * exclusively for testing -- app builders should just use `ConsolePage`.
 */
export function ConsolePageLayout({
  children,
  title,
  routes,
}: ConsolePageProps) {
  const hasRoutes = routes !== undefined;

  const masthead = (
    <Masthead>
      <MastheadMain>
        <MastheadBrand>
          <Title headingLevel="h2">{title}</Title>
        </MastheadBrand>
      </MastheadMain>
    </Masthead>
  );

  // useLocation can only be used inside of a Router, so we created this separate ConsolePageLayout component
  const location = useLocation();
  const sidebar = hasRoutes ? (
    <PageSidebar>
      <PageSidebarBody>
        <Nav>
          <NavList>
            {routes.map((r) => {
              return (
                <NavItem isActive={r.path === location.pathname} key={r.path}>
                  <NavLink to={r.path}>{r.title}</NavLink>
                </NavItem>
              );
            })}
          </NavList>
        </Nav>
      </PageSidebarBody>
    </PageSidebar>
  ) : null;

  return (
    <Page masthead={masthead} sidebar={sidebar}>
      {children}
      {hasRoutes && (
        <Routes>
          {routes.map((r) => {
            return <Route path={r.path} element={r.element} key={r.path} />;
          })}
        </Routes>
      )}
    </Page>
  );
}
