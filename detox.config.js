/**
 * Basic Detox configuration for Expo managed workflow.
 */
module.exports = {
  testRunner: 'jest',
  runnerConfig: 'e2e/jest.config.js',
  apps: {
    'ios.sim.debug': {
      type: 'ios.simulator',
      binaryPath: 'bin/Exponent.app',
      build: 'echo "Build is handled by Expo EAS/preview"',
    },
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 14' },
    },
  },
  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.sim.debug',
    },
  },
};
