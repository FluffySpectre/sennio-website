describe("Navigation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.waitForAppReady();
  });

  it("should navigate to projects page by default", () => {
    cy.url().should("include", "/projects");
    cy.contains("Projects").should("exist");
  });

  it("should navigate to last played games page", () => {
    cy.contains("Last played").click();
    cy.url().should("include", "/last-played-games");
    cy.get(".GamesListContainer").should("exist");
  });

  it("should navigate to impressum page", () => {
    cy.get(".Footer").contains("Legal Notice").click();
    cy.url().should("include", "/impressum");
    cy.contains("Impressum").should("be.visible");
  });

  it("should open GitHub link in new tab", () => {
    cy.get(".header-link")
      .first()
      .should("have.attr", "href", "https://github.com/FluffySpectre")
      .should("have.attr", "target", "_blank");
  });

  it("should open itch.io link in new tab", () => {
    cy.get(".header-link")
      .eq(1)
      .should("have.attr", "href", "https://sennio.itch.io")
      .should("have.attr", "target", "_blank");
  });
});
