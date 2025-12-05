/* eslint-disable import/no-extraneous-dependencies */
const detox = require('detox');
const config = require('../detox.config');
const adapter = require('detox/runners/jest/adapter');

jest.setTimeout(120000);

beforeAll(async () => {
  await detox.init(config, { initGlobals: true });
  await adapter.beforeAll();
});

afterAll(async () => {
  await adapter.afterAll();
  await detox.cleanup();
});

afterEach(async () => {
  await adapter.afterEach();
});
