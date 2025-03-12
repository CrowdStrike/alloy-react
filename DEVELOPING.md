# Developer docs

## Creating new components

1. Develop a component in the alloy-quickstart project for fast iteration
1. Move component code to alloy-react, following the directory and export structure
   - **Important:** If your new component imports from alloy-react (e.g. `useFoundry`), be sure to update the imports to use the _local_ path (e.g. `... from "../../lib/foundry-context"`)
1. Follow _Modifying components_ below

## Modifying components

1. Create a local package with `npm pack`
1. In alloy-quickstart `ui`: `npm install --save ../path/to/crowdstrike-alloy-react-X.Y.Z.tgz`
1. Test the component changes in the quickstart app
1. Repeat pack and install steps as necessary
1. Merge and release the component changes
1. In alloy-quickstart `ui`: `npm install --save @crowdstrike/alloy-react`
1. Merge alloy-quickstart changes if necessary

## Release process

1. Bump versions in:
   - `package.json`: `version` and `consolePlugin.version`
   - `charts/Chart.yaml`
2. Create a GitHub release:
   - Allow GitHub to auto-create a matching tag in the format `vX.Y.Z`
   - Generate release notes from previous PR's, and review them for quality
3. Quay will automatically build the matching container image
