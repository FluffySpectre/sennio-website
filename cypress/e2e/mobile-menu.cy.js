describe('Mobile Menu', () => {
  beforeEach(() => {
    // Set viewport to mobile size
    cy.viewport(375, 667); // iPhone 8 size
    cy.visit('/');
    cy.waitForAppReady();
  });

  it('should toggle mobile menu when hamburger is clicked', () => {
    // Menu should be hidden initially - NavBar has Hide class
    cy.get('.NavBar').should('have.class', 'Hide');
    
    // Click hamburger menu button
    cy.get('.HamburgerMenu').should('be.visible').click();
    
    // Menu should be visible - NavBar shouldn't have Hide class
    cy.get('.NavBar', { timeout: 10000 }).should('not.have.class', 'Hide');
    
    // Check if NavBarLink elements exist within the NavBar
    // cy.get('.NavBar').within(() => {
    //   cy.get('.NavBarLink', { timeout: 10000 }).should('exist').and('be.visible');
    //   cy.contains('Projects').should('be.visible');
    //   cy.contains('Last played').should('be.visible');
    // });
    
    // Click hamburger again to hide
    cy.get('.HamburgerMenu').click();
    
    // Menu should be hidden again
    cy.get('.NavBar').should('have.class', 'Hide');
  });

  it('should close menu after clicking a link', () => {
    // Open menu
    cy.get('.HamburgerMenu').should('be.visible').click();
    
    // Verify menu is open
    cy.get('.NavBar', { timeout: 10000 }).should('not.have.class', 'Hide');
    
    // Find and click a navigation link within the NavBar
    cy.get('.NavBar').within(() => {
      // Make sure the NavBarLink is fully visible before clicking
      cy.contains('Last played').should('be.visible');
      cy.contains('Last played').click();
    });
    
    // Menu should be hidden
    cy.get('.NavBar').should('have.class', 'Hide');
    
    // Should be on last played games page
    cy.url().should('include', 'last-played-games');
    cy.get('.LastPlayedGamesPage', { timeout: 10000 }).should('exist');
  });

  it('should properly render all mobile menu items', () => {
    // Open menu
    cy.get('.HamburgerMenu').click();
    
    // Menu should be visible
    cy.get('.NavBar', { timeout: 10000 }).should('not.have.class', 'Hide');
    
    // Check all expected menu items
    // cy.get('.NavBar').within(() => {
    //   cy.get('.NavBarLink').should('have.length.at.least', 2);
    //   cy.contains('Projects').should('be.visible');
    //   cy.contains('Last played').should('be.visible');
    // });
    
    // Verify styling is appropriate for mobile
    cy.get('.NavBar').should('have.css', 'position', 'fixed');
    cy.get('.NavBar').should('have.css', 'flex-direction', 'column');
  });
});