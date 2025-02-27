<p align="center">
   <img src="https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/cs-logo.png" alt="CrowdStrike logo" width="500"/>
</p>

# alloy-react

_React + PatternFly building blocks for Foundry UI's_

This project is meant to make it much easier to start building robust UI's within Foundry applications, and is opinionated on the use of React.js and [PatternFly](https://www.patternfly.org/).

## Support

This repository is an open source project, not a CrowdStrike product. As such, it carries no formal support, expressed or implied.

## Getting Started

If you have an existing Foundry app where you want to use Alloy's React bindings, you can `npm install --save @crowdstrike/alloy-react`. Then refer to the reference below.

However, if you're just getting started, you're better off cloning the [alloy-quickstart](https://github.com/CrowdStrike/alloy-quickstart) app, which contains Alloy's opinionated project structure and a few examples. You can still come back here and use the reference as you build.

## Component Reference

### `ConsoleExtension`

Represents what Foundry refer to as a "UI extension." This component provides base styling needed for the extension (e.g. PatternFly base CSS, padding to match other Falcon detail panes, etc.). Normally, you'll wrap all your extension content with a `<ConsoleExtension>` in App.tsx:

```jsx
// App.tsx
return (
  <ConsoleExtension>
    <Title headingLevel="h1">Hello, extension</Title>
```

### `ConsolePage`

Represents what Foundry refers to as a "UI page." This component provides base styling needed for the UI page, including a [PatternFly <Page>](https://www.patternfly.org/components/page) with masthead and optional sidebar. A `ConsolePage` may be a single, simple page; or it can be a full multi-page application with its own routing system.

To create a simple page:

```jsx
// App.tsx
return (
  <ConsolePage title="App Title">
    <PageSection>
      <Title headingLevel="h3">Single Page</Title>
```

To create a multi-page application with a sidebar:

```jsx
const routes = [
  {
    title: "Home",
    path: "/home",
    element: <Home />,
  },
  // ... snip: more routes ...
];

return <ConsolePage title="App Title" routes={routes} />;
```

> [!TIP]
> When you create Falcon navigation links for this multi-page application, make sure the `navigation.links[].path` in `manifest.yml` match the `path` provided in the `routes` attribute.

## API Reference

### Foundry context: `FoundryProvider` and `useFoundry`

Alloy provides a React-ified wrapper of the foundry-js `FalconApi` and `data` objects via a React context. The context provider `<FoundryProvider>` should wrap your entire `<App />` in `index.tsx`:

```jsx
// index.tsx
root.render(
  <React.StrictMode>
    <FoundryProvider>
      <App />
    </FoundryProvider>
  </React.StrictMode>
);
```

With this provider in place, you can use the custom hook `useFoundry()` to get the values of this context, which includes: `falcon`, `data`, and `isInitialized`:

```jsx
// App.tsx
const { data, isInitialized } = useFoundry();

if (!isInitialized) {
  return null;
}

return (
  <ConsoleExtension>
    Detection ID: {data!.detection.composite_id}
  </ConsoleExtension>
);
```

> [!IMPORTANT]
> Note that the `data` object returned by `useFoundry()` is a React state object, which the Foundry provider correctly updates via a `falcon.events.on('data')` event handler. Do not use the `falcon.data` object, since it will not correctly re-render your UI when a data event occurs.
