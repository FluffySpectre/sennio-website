describe("Last Played Games Page", () => {
  it("should display games or skeletons while loading", () => {
    cy.visit("/last-played-games");
    cy.waitForAppReady();
    cy.get(".GamesListContainer").should("exist");

    // Either game items or skeletons should be visible
    cy.get("body").then(($body) => {
      if ($body.find(".GameItem").length > 0) {
        cy.get(".GameItem").should("have.length.at.least", 1);
      } else {
        cy.get(".GameItemSkeleton").should("have.length.at.least", 1);
      }
    });
  });

  it("should have game images and names when loaded", () => {
    // Intercept the API call to ensure we test with actual data
    cy.intercept("GET", "**/last_played_games.json", {
      fixture: "last_played_games.json",
    }).as("getGames");

    // Create fixtures directory and sample data
    cy.writeFile("cypress/fixtures/last_played_games.json", {
      lastPlayedGames: [
        {
          name: "Test Game 1",
          imageURL: "assets/images/empty_tile.png",
          playtimePercentage: 80,
          mostPlayedRecently: true
        },
        {
          name: "Test Game 2",
          imageURL: "assets/images/empty_tile.png",
          playtimePercentage: 20,
          mostPlayedRecently: false
        }
      ]
    });

    cy.visit("/last-played-games");
    cy.waitForAppReady();
    cy.wait("@getGames");

    cy.get(".GameItem").should("have.length", 2);
    cy.contains("Test Game 1").should("be.visible");
    cy.contains("Test Game 2").should("be.visible");

    // Check most played icon
    cy.get(".GameItem").first().find(".MostPlayedTag").should("be.visible");
  });
});
