describe('Dashboard', () => {
  beforeEach(() => {
    cy.visit('/dashboard.html');
    // Spy on console.log
    cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });
  });

  it("Should show the dashboard content when signed in", () => { 
    cy.visit("/dashboard.html");
    cy.get('[data-test="dashboard-content"]').should("exist");
    cy.url().should("include", "dashboard.html"); 
  });

  it("Should display welcoming message of Welcome, test" , () => {
    cy.get('[data-test="welcome-message"]').should("have.text", "Welcome, test")
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

  it("Should change the welcoming message to Welcome, test after changing the name", () => {
    cy.get('[data-tab="settingsTab"]').click();
    cy.get('[data-test="display-name-input"]').type('test');
    cy.get('[data-test="generalInfo-btn"]').click()
    cy.contains('[data-test="welcome-message"]', "Welcome, test").should("exist");
  })

  it("Should not be able to change the email as you'll need to type in your password to reauth", () => {
    cy.get('[data-tab="settingsTab"]').click();
    cy.get('[data-test="email-input"]')
    cy.get('[data-test="email-input"]').type('test@example.com');
    cy.get('[data-test="generalInfo-btn"]').click()
  })

  it("Should able to change the email once it reauths with password confirmed", () => {
    cy.get('[data-tab="settingsTab"]').click();
    cy.get('[data-test="email-input"]').type('test@example.com');
    cy.get('[data-test="general-password-input"]').type('Password!12');
    cy.get('[data-test="generalInfo-btn"]').click()
  })
  it("This current month should have 5 changes as we just updated our email ", () => {
    cy.contains('[data-test="number-of-changes"]', "5").should("exist")
  })

});