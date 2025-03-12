<p align="center">
   <img src="https://raw.githubusercontent.com/CrowdStrike/falconpy/main/docs/asset/cs-logo.png" alt="CrowdStrike logo" width="500"/>
</p>

# alloy-react

_React + PatternFly building blocks for Foundry UI's_

This project is meant to make it much easier to start building robust UI's within Foundry applications, and is opinionated on the use of React.js and [PatternFly](https://www.patternfly.org/).

## Support

This repository is an open source project, not a CrowdStrike product. As such, it carries no formal support, expressed or implied.

## Quick Start

TODO after v0.0.1 publication

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

### `CollectionEditor`

Component that allows collection objects to be read, modified, and deleted as JSON. You can determine the extent to which an end user can modify collection name and object name to interact with, as well as which actions are available to the user.

Using the CollectionEditor doesn't _create_ collections. To do that, you need to define the collection in `manifest.yml`. See the Foundry docs.

**Basic collection editor**

In this example, the user has full control over the collection name and object name, as well as whether to load, save, or delete the object.

![The default, fully modifiable collection editor](docs/img/collection-editor-default.png)

```jsx
<CollectionEditor />
```

**Limited to one object**

In this example, the user can only interact with the object specified by the app author. The object value is loaded immediately on render and cannot be deleted. A default value is populated in the editor if the object doesn't exist yet. This is useful for allowing users to interact with "global settings" for the application.

![A limited collection editor](docs/img/collection-editor-limited.png)

```jsx
<CollectionEditor
  collectionNameDefault="config"
  collectionNameEditable={false}
  objectNameDefault="default"
  objectNameEditable={false}
  loadObjectValue={true}
  loadButtonVisible={false}
  deleteButtonVisible={false}
  objectValueDefault={{ special_key: "PLACEHOLDER" }}
/>
```

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
