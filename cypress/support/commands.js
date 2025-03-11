// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: "element"}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: "optional"}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import "@testing-library/cypress/add-commands";

// Wait for animation to complete
Cypress.Commands.add("waitForAnimation", (selector = "body") => {
  return cy.get(selector)
    .should("not.have.class", "FadeIn")
    .should("not.have.class", "FadeOut")
    .should("not.have.class", "FadeAndFlyIn")
    .should("not.have.class", "FadeAndFlyOut");
});

// Wait for the loading screen to disappear
Cypress.Commands.add("waitForAppReady", () => {
  cy.get(".FakeLoadingScreen", { timeout: 10000 }) // Wait for the loading screen to appear
    .should("exist") 
    .and("have.class", "FadeOut"); // Ensure it starts fading out

  cy.get(".FakeLoadingScreen", { timeout: 10000 }).should("not.exist"); // Wait until it"s gone
});
