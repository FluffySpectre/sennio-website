const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 800,

    defaultBrowser: "chrome",
  },
});
