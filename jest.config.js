module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',  // Usa jsdom para simular el DOM en pruebas de componentes
    roots: ['<rootDir>/src'],
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest'
    },
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1',  // Mapea la ruta para evitar problemas con imports en Ionic
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  };
  