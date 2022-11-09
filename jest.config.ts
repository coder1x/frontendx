import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  collectCoverage: true,
  // "coverageReporters": ["html"],
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', 'src'],
  preset: './jest.preset.ts',
  name: 'frontendx',
  verbose: true,
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  // collectCoverageFrom: ["src/**/{!(*.d.ts),}.{ts,js,.tsx,.jsx}"],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  roots: ['<rootDir>/src'],
};
export default config;
