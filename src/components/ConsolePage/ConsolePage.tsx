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
  children?: ReactNode;
  title: string;
  routes?: ConsolePageRoute[];
}

interface ConsolePageRoute {
  path: string;
  title: string;
  element: ReactElement;
}

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

// exported for testing so we can wrap in a testable MemoryRouter, but not beyond that
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
