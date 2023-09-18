// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('checkPasswordHint', (email, password, hintValidations) => {
    cy.get('[data-test="test-email-input"]').type(email);
    cy.get('[data-test="test-password-input"]').type(password);
    // Checking if the password hint messages are displayed correctly
    cy.get('[data-test="test-hint-characters"]').should(hintValidations.characters ? "have.class" : "not.have.class", "valid-hint");
    cy.get('[data-test="test-hint-uppercase"]').should(hintValidations.uppercase ? "have.class" : "not.have.class", "valid-hint");
    cy.get('[data-test="test-hint-lowercase"]').should(hintValidations.lowercase ? "have.class" : "not.have.class", "valid-hint");
    cy.get('[data-test="test-hint-specialCh"]').should(hintValidations.specialCh ? "have.class" : "not.have.class", "valid-hint");
})

Cypress.Commands.add('checkSignIn', (email, password) => {
    cy.get('[data-test="test-signIn-email-input"]').type(email);
    cy.get('[data-test="test-signIn-password-input"]').type(password);
})