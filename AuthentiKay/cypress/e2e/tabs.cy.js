describe("Tab Navigation", () => {
  beforeEach(() => {
    cy.visit('/')
  })
  it("Clicking on Register tab should activate it and hide Sign In tab", () => {
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-tab="registerTab"]').should("have.css", "position", 'relative');
    cy.get('[data-test="signInForm"]').should("have.css", "display", "none")
  });

  it("Clicking on Sign In tab should activate it and hide Register tab", () => {
    cy.get('[data-tab="signInTab"]').should("have.css", "position", "relative")
    cy.get('[data-test="registerForm"]').should("have.css", "display", "none")
  })

  it("Clicking on Forgot password should activate it and hide all other tabs", () => {
    cy.get('[data-tab="forgotPasswordTab"]').click()
    cy.get('[data-test="forgotPasswordForm"]').should("be.visible")
  })

  it("Clicking Sign In link on Forgot password tab should return to Sign In tab", () => {
    cy.get('[data-tab="forgotPasswordTab"]').click()
    cy.get('[data-test="backToSignIn"]').click()
    cy.get('[data-tab="signInTab"]').should("be.visible")
  })

  it("Clicking Show hint label should show password hints and clicking show hint label again should hide it", () => {
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-test="test-show-hint"]').click()
    cy.get('[data-test="test-hint-items"]').should("be.visible")
    cy.get('[data-test="test-show-hint"]').click()
    cy.get('[data-test="test-hint-items"]').should("be.hidden")    
  })

  it("Clicking Show hint label should show 4 li elements containing their respected password hints and Font Awesome icon with classes fas fa-check hint-item ", () => {
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-test="test-show-hint"]').click()
    cy.get('[data-test="test-hint-items"]').should("be.visible")
    cy.get('[data-test="test-hint-items"]').find("li")
    .should(($li) => {
      expect($li).to.have.length(4)
      expect($li.eq(0)).to.contain("Between 6 and 30 characters")
      expect($li.eq(1)).to.contain("Contain at least one uppercase letter")
      expect($li.eq(2)).to.contain("Contain at least one lowercase letter")
      expect($li.eq(3)).to.contain("Contain at least one special character")
    })
    .find("i").should(($i) => {
      expect($i).to.have.length(4)

      const classes = $i.map((_, el) => {
        return Cypress.$(el).attr("class")
      })

      expect(classes.get()).to.deep.eq(
      [
      "fas fa-check hint-item invalid-hint", 
      "fas fa-check hint-item invalid-hint", 
      "fas fa-check hint-item invalid-hint", 
      "fas fa-check hint-item invalid-hint"
      ])
    })
    
  })
});

