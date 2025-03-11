describe("Internationalization", () => {
  // Helper function to detect language
  function detectLanguage() {
    return cy.window().then((win) => {
      return win.i18n.language;
    });
  }

  // Helper to set language explicitly
  function setLanguage(lang) {
    return cy.window().then((win) => {
      win.i18n.changeLanguage(lang);
    });
  }

  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should display English content by default", () => {
    // Check the title contains English text
    cy.contains("Projects").should("be.visible");
    cy.contains("Last played").should("be.visible");
    cy.contains("More projects on GitHub").should("be.visible");
  });

  it("should switch to German and display German content", () => {
    // Set language to German
    setLanguage("de");

    // Check German translations are shown
    cy.contains("Projekte").should("be.visible");
    cy.contains("Zuletzt gespielt").should("be.visible");
    cy.contains("Weitere Projekte bei GitHub").should("be.visible");
  });

  it("should maintain language across page navigation", () => {
    // Set language to German
    setLanguage("de");

    // Navigate to another page
    cy.contains("Zuletzt gespielt").click();

    // Language should still be German
    detectLanguage().should("eq", "de");

    // Navigate back
    cy.contains("Projekte").click();

    // Still German
    detectLanguage().should("eq", "de");
  });
});
