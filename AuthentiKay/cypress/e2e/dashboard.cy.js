describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/');
    // Spy on console.log
    cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });
  });

  it("should return to homepage as the user is not yet authenticated", () => {
    cy.visit('/dashboard.html');
    cy.url().should("include", "/");
  });

  it("Should be able to sign in and navigate to dashboard.html", () => {
    cy.checkSignIn("test@example.com", "Password!12");
    cy.get('[data-test="signIn-btn"]').click();
    cy.wait(1000);
    cy.url().should("include", "dashboard.html");
  });

  it("Should show the dashboard content when signed in", () => { 
    cy.visit("/dashboard.html");
    cy.get('[data-test="dashboard-content"]').should("exist");
    cy.url().should("include", "dashboard.html"); 
  });

  it("Should display welcoming message of Welcome, test" , () => {
    cy.get('[data-test="welcome-message"]').should("contain.text", "Welcome, test")
  })

  it("Should initially show the Activity tab as active", () => {
    cy.get('[data-tab="activityTab"]').should("have.class", "active-tab");
    cy.get('[data-test="activity-tab-content"]').should("exist");
  });

  it("Should initially hide Settings tab as hidden then navigate to Settings Tab on click" , () => {
    cy.get('[data-test="settings-tab-content"]').should("have.class", "hidden");
    cy.get('[data-tab="settingsTab"]').click();
    cy.get('[data-test="settings-tab-content"]').should("exist");
  })

});