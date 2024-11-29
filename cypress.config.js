const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Implementa los controladores de eventos de Node aquí
    },
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}", // Define el patrón de archivos de prueba
    defaultCommandTimeout: 300000,
    pageLoadTimeout: 300000,
    video: false,
    supportFile: false,
    baseUrl: "http://localhost:8100", 
  },
});
