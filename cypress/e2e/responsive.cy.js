describe("Responsive Design", () => {
  it("should display correctly on desktop", () => {
    cy.viewport(1280, 800);
    cy.visit("/");
    cy.waitForAppReady();

    // Header should be visible with both title and avatar
    cy.get(".Header").should("be.visible");
    cy.get(".Avatar").should("be.visible");
    cy.get(".TitleText").should("be.visible");

    // Menu should be displayed horizontally
    cy.get(".NavBar").should("be.visible");
    // cy.get(".NavBarLink").should("be.visible");
    cy.get(".HamburgerMenu").should("not.be.visible");
  });

  it("should adapt to tablet size", () => {
    cy.viewport(768, 1024);
    cy.visit("/");
    cy.waitForAppReady();

    // Hamburger menu should be visible
    cy.get(".HamburgerMenu").should("be.visible");

    // Title text should be hidden
    cy.get(".TitleText").should("not.be.visible");

    // Mobile title should be visible
    cy.get(".PageTitleMobile").should("be.visible");

    // Menu should be hidden initially
    cy.get(".NavBar").should("have.class", "Hide");

    // Click hamburger to show menu
    cy.get(".HamburgerMenu").click();
    cy.get(".NavBar").should("not.have.class", "Hide");

    // Projects should wrap to fill width
    cy.get(".ProjectsContainer").should("be.visible");
  });

  it("should adapt to mobile size", () => {
    cy.viewport(375, 667); // iPhone 8 size
    cy.visit("/");
    cy.waitForAppReady();

    // Hamburger menu should be visible
    cy.get(".HamburgerMenu").should("be.visible");

    // Mobile header slots should be 33.3% width
    cy.get(".header-slot").should("be.visible");

    // Projects should stack vertically
    cy.get(".ProjectTile").should("be.visible");
  });
});
