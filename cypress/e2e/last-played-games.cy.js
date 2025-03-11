describe('Last Played Games Page', () => {
  beforeEach(() => {
    // Create fixtures directory and sample data if it doesn't exist
    cy.writeFile('cypress/fixtures/last_played_games.json', {
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
    }, { log: false });
  });

  it('should display games list container when visiting directly', () => {
    // Intercept the API call
    cy.intercept('GET', '**/last_played_games.json', {
      fixture: 'last_played_games.json'
    }).as('getGames');
    
    // Visit the page directly
    cy.visit('/#/last-played-games');
    cy.waitForAppReady();
    
    // Wait for container to be visible
    cy.get('.LastPlayedGamesPage', { timeout: 10000 }).should('be.visible');
    cy.get('.GamesListContainer', { timeout: 10000 }).should('be.visible');
  });

  it('should display games or skeletons while loading', () => {
    // Intercept but with a delay to ensure we see skeletons
    cy.intercept('GET', '**/last_played_games.json', {
      fixture: 'last_played_games.json',
      delay: 500  // Add a slight delay
    }).as('getGamesDelayed');
    
    cy.visit('/#/last-played-games');
    cy.waitForAppReady();
    
    // Either game items or skeletons should be visible
    cy.get('.GamesListContainer', { timeout: 10000 }).should('be.visible')
      .then(($container) => {
        if ($container.find('.GameItem').length > 0) {
          cy.get('.GameItem').should('have.length.at.least', 1);
        } else {
          cy.get('.GameItemSkeleton').should('have.length.at.least', 1);
        }
      });
    
    // Wait for data to load
    cy.wait('@getGamesDelayed');
  });

  it('should have game images and names when loaded', () => {
    // Intercept the API call
    cy.intercept('GET', '**/last_played_games.json', {
      fixture: 'last_played_games.json'
    }).as('getGames');
    
    cy.visit('/#/last-played-games');
    cy.waitForAppReady();
    
    // Wait for the API call to complete
    cy.wait('@getGames');
    
    // Now the container should be visible with game items
    cy.get('.GamesListContainer', { timeout: 10000 }).should('be.visible');
    
    // Check that we have the expected game items
    cy.get('.GameItem', { timeout: 10000 }).should('have.length', 2);
    cy.contains('Test Game 1').should('be.visible');
    cy.contains('Test Game 2').should('be.visible');
    
    // Check most played icon
    cy.get('.GameItem').first().find('.MostPlayedTag').should('be.visible');
  });

  it('should navigate to last played games page from projects page', () => {
    // Intercept the API call
    cy.intercept('GET', '**/last_played_games.json', {
      fixture: 'last_played_games.json'
    }).as('getGames');
    
    // Start at projects page
    cy.visit('/');
    cy.waitForAppReady();
    
    // Navigate to last played games
    cy.contains('Last played').click();
    
    // Wait for the API call to complete
    cy.wait('@getGames');
    
    // Container should be visible
    cy.get('.GamesListContainer', { timeout: 10000 }).should('be.visible');
    cy.get('.GameItem').should('have.length', 2);
  });
});
