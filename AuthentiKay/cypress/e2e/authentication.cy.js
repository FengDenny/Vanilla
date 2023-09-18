describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/')
     // Spy on console.log
     cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });
  })
  it("Should not register as the password does not adhere to password of uppercase/ special character requirements and should output the requirement on the console for now", () => {
    const hintValidations = {
      characters: true, // Valid
      uppercase: false, // Invalid
      lowercase: true, // Valid
      specialCh: false, // Invalid
    };
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-test="test-show-hint"]').click()
    cy.checkPasswordHint("test@example.com", "password122", hintValidations);
    cy.get('[data-test ="register-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "Password should be between 6 to 30 characters with one uppercase letter, lowercase letter, and a special character");
  });
  it("Should not register as the password does not adhere to password of characters / lowercase character requirements and should output the requirement on the console for now", () => {
    const hintValidations = {
      characters: false, // Invalid
      uppercase: true, // valid
      lowercase: false, // Invalid
      specialCh: true, // valid
    };
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-test="test-show-hint"]').click()
    cy.checkPasswordHint("test@example.com", "PP!12", hintValidations);
    cy.get('[data-test ="register-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "Password should be between 6 to 30 characters with one uppercase letter, lowercase letter, and a special character");
  });

  // it("Should register as the password adhere to password requirements and should output signup successfully with the email on the console for now", () => {
  //   const hintValidations = {
  //     characters: true, 
  //     uppercase: true,
  //     lowercase: true,
  //     specialCh: true, 
  //   };
  //   cy.get('[data-tab="registerTab"]').click();
  //   cy.get('[data-test="test-show-hint"]').click()
  //   cy.checkPasswordHint("test@example.com", "Password!12", hintValidations);
  //   cy.get('[data-test="register-btn"]').click()
  //   cy.get("@consoleLog").should("be.calledWith", "test@example.com has successfully signed up");
  // });
  it("Should not register as the email already sigend up and should output The email address is already in use by another account to the console for now", () => {
    const hintValidations = {
      characters: true, 
      uppercase: true,
      lowercase: true,
      specialCh: true, 
    };
    cy.get('[data-tab="registerTab"]').click();
    cy.get('[data-test="test-show-hint"]').click()
    cy.checkPasswordHint("test@example.com", "Password!12", hintValidations);
    cy.get('[data-test="register-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "The email address is already in use by another account.");
  });

 
  it("Should not be able to sign in as the password is incorrect", () => {
    cy.checkSignIn("test@example.com", "Password12");
    cy.get('[data-test="signIn-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "Email or password is incorrect");
  });

    
  it("Should not be able to sign in as the email has not been registered yet", () => {
    cy.checkSignIn("tes@example.com", "Password!12");
    cy.get('[data-test="signIn-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "This user has not been registered.");
  });

 it("Should be able to sign in and should output Welcome back, ${email} to the console for now", () => {
    cy.checkSignIn("test@example.com", "Password!12");
    cy.get('[data-test="signIn-btn"]').click()
    cy.get("@consoleLog").should("be.calledWith", "Welcome back, test@example.com!");
  });

  it("Should send a email to recover password and console log password link has been sent to the provided email", () => {
    cy.get('[data-tab="forgotPasswordTab"]').click()
    cy.get('[data-test="test-forgot-password"]').type("test@example.com")
    cy.get('[test-data="password-recovery-button"]').click()
    cy.get("@consoleLog").should("be.calledWith", "Password reset link has been sent to test@example.com. Please check your email.");
  });

  it("Should not be able to send a email to recover password as email has not been registered and should display to the console This user has not been registered.", () => {
    cy.get('[data-tab="forgotPasswordTab"]').click()
    cy.get('[data-test="test-forgot-password"]').type("tes@example.com")
    cy.get('[test-data="password-recovery-button"]').click()
    cy.get("@consoleLog").should("be.calledWith", "This user has not been registered.");
  });


})