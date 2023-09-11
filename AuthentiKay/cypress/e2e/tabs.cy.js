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
});

