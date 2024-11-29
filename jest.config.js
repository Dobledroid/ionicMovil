module.exports = {
  testEnvironment: 'jsdom', // Asegúrate de que Jest use jsdom
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',   // Transpila archivos .js, .jsx, .ts y .tsx con Babel
  },
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    'react-leaflet': '<rootDir>/__mocks__/react-leaflet.js',
    "^firebase/messaging$": "<rootDir>/__mocks__/firebase/messaging.js"

  },
  transformIgnorePatterns: [
    "/node_modules/(?!(react-leaflet|@react-leaflet/core|@babel/runtime)/)",
  ]
};
