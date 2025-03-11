describe("Mobile Menu", () => {
  beforeEach(() => {
    cy.viewport(375, 667); // iPhone 8 size
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should toggle mobile menu when hamburger is clicked", () => {
    // Menu should be hidden initially
    cy.get(".NavBar").should("have.class", "Hide");

    // Click hamburger menu
    cy.get(".HamburgerMenu").click();

    // Menu should be visible
    cy.get(".NavBar").should("not.have.class", "Hide");

    // Links should be visible
    cy.get(".NavBarLink").should("be.visible");

    // Click hamburger again to hide
    cy.get(".HamburgerMenu").click();

    // Menu should be hidden
    cy.get(".NavBar").should("have.class", "Hide");
  });

  it("should close menu after clicking a link", () => {
    // Open menu
    cy.get(".HamburgerMenu").click();

    // Click a navigation link
    cy.contains("Last played").click();

    // Menu should be hidden
    cy.get(".NavBar").should("have.class", "Hide");

    // Should be on last played games page
    cy.url().should("include", "/last-played-games");
  });
});
