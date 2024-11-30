module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  transform: {
    '^.+\\.(ts|mjs|html|js)$': 'ts-jest',  // Asegúrate de que los archivos .ts, .mjs, .html y .js sean procesados correctamente
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',  // Asegúrate de que esté apuntando a tu tsconfig.spec.json
    },
  },
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',  // Mapea los módulos correctamente
  },
};
