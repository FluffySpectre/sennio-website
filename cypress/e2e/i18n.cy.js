describe('Internationalization', () => {
  it('should display English content by default', () => {
    cy.visit('/');
    cy.waitForAppReady();

    // Check the title contains English text
    cy.contains('Projects').should('be.visible');
    cy.contains('Last played').should('be.visible');
    cy.contains('More projects on GitHub').should('be.visible');
  });

  it('should display German content when language is set to German', () => {
    // Set language to German via localStorage before visiting
    cy.window().then(win => {
      win.localStorage.setItem('i18nextLng', 'de');
    });

    // Visit page with German already set
    cy.visit('/');
    cy.waitForAppReady();

    // Check German translations are shown
    cy.contains('Projekte').should('be.visible');
    cy.contains('Zuletzt gespielt').should('be.visible');
    cy.contains('Weitere Projekte bei GitHub').should('be.visible');
  });

  it('should maintain language across page navigation', () => {
    // Set language to German
    cy.window().then(win => {
      win.localStorage.setItem('i18nextLng', 'de');
    });

    cy.visit('/');
    cy.waitForAppReady();

    // Navigate to another page
    cy.contains('Zuletzt gespielt').click();

    // Should still have German text
    cy.contains('Zuletzt gespielt').should('be.visible');

    // Navigate back
    cy.contains('Projekte').click();

    // Still German
    cy.contains('Projekte').should('be.visible');
    cy.contains('Weitere Projekte bei GitHub').should('be.visible');
  });
});
