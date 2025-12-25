module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test/setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: ["<rootDir>/src/**/*.test.jsx", "<rootDir>/src/**/*.test.js"],
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { presets: ["@babel/preset-env", "@babel/preset-react"] }],
  },

  collectCoverage: true,
  collectCoverageFrom: [
    "src/store/**/*.{js,jsx}",
    "src/hooks/**/*.{js,jsx}",
    "src/apis/**/*.{js,jsx}",
    "src/apis/request/**/*.{js,jsx}",
    "!src/store/store.js" // nếu khó test file setup store
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
