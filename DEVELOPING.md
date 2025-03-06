# Developer docs

## Release process

1. Bump version in `package.json` and then `npm install`
1. Commit the `package.json` and `package-lock.json` ("chore: prep vX.Y.Z")
1. Create a GitHub release:
   - Allow GitHub to auto-create a matching tag in the format `vX.Y.Z`
   - Generate release notes from previous PR's, and review them for quality
1. GitHub Actions will publish to NPM
