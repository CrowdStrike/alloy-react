/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    // don't try importing css as javascript: https://jestjs.io/docs/webpack#mocking-css-modules
    "\\.css$": "identity-obj-proxy",
  },
};
