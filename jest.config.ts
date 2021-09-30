export default {
  roots: ['<rootDir>/src'],

  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  coverageProvider: 'v8',
}
