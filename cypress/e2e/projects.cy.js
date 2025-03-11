describe("Projects Page", () => {
  beforeEach(() => {
    cy.visit("/projects");
    cy.waitForAppReady();
  });

  it("should display project tiles", () => {
    cy.get(".ProjectTile").should("have.length.greaterThan", 5);
  });

  it("should display project name and description on tiles", () => {
    cy.get(".ProjectTile").first().within(() => {
      cy.get(".ProjectTitle").should("be.visible");
      cy.get(".ProjectDescription").should("be.visible");
    });
  });

  // it("should hover and show project details on hover", () => {
  //   const firstProject = cy.get(".ProjectTile").first();

  //   // Check initial state
  //   firstProject.find(".ProjectLabel").should("be.visible");

  //   // Hover and check changes
  //   firstProject.trigger("mouseenter");
  //   firstProject.find(".ProjectLabel").should("have.class", "Show");

  //   // Mouse leave and check it returns to normal
  //   firstProject.trigger("mouseleave");
  //   firstProject.find(".ProjectLabel").should("not.have.class", "Show");
  // });

  it("should open project details when clicked", () => {
    // Click the first project
    cy.get(".ProjectTile").first().click();

    // Project detail page should appear
    cy.get(".ProjectPage").should("be.visible");
    cy.get(".PageContainer").should("be.visible");
    cy.get(".ProjectPageTitle").should("be.visible");

    // Close button should work
    cy.get(".ProjectPageCloseX").click();
    cy.get(".PageContainer").should("have.class", "FadeAndFlyOut");
  });

  it("should display GitHub link tile", () => {
    cy.contains("More projects on GitHub").should("be.visible");
  });

  it("should show tech tags in project details", () => {
    cy.get(".ProjectTile").first().click();
    cy.get(".TechTagsContainer").should("be.visible");
    cy.get(".TechTag").should("have.length.at.least", 1);
    cy.get(".ProjectPageCloseX").click();
  });
});
