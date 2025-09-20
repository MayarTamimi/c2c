const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  preset: 'ts-jest',
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  setupFiles: ['dotenv/config'],
   testPathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/src/__tests__/helpers/" 
  ],
  clearMocks: true
};