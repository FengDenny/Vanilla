const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyAzHOhNGblzmGQN_PgMZ4y-_F_bDv7dtks",
  authDomain: "authentikay-8ef16.firebaseapp.com",
  projectId: "authentikay-8ef16",
  storageBucket: "authentikay-8ef16.appspot.com",
  messagingSenderId: "422742143184",
  appId: "1:422742143184:web:c94f526ed0e335e5e72ed5",
  measurementId: "G-QZ813FKHBB",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

register();
signIn();
resetPassword();
function register() {
  const registerEmail = document.getElementById("registerEmail");
  const registerPassword = document.getElementById("registerPassword");
  const registerForm = document.getElementById("registerTabForm");

  registerForm.addEventListener("submit", async (e) => {
    if (!isValidPassword(registerPassword.value)) {
      e.preventDefault();
      const error = { code: "auth/invalid-password" };
      errorCodeLookUp(error);
      registerEmail.value = "";
      registerPassword.value = "";
    } else {
      e.preventDefault();
      try {
        const result = await auth.createUserWithEmailAndPassword(
          registerEmail.value,
          registerPassword.value
        );
        const { email, uid, metadata } = result.user;
        const { creationTime, lastSignInTime } = metadata;
        const data = {
          displayName: email.split("@").shift(),
          email,
          uid,
          metadata: { creationTime, lastSignInTime },
        };
        await saveData(data);
        console.log(`${email} has successfully signed up`);
      } catch (error) {
        errorCodeLookUp(error);
        e.preventDefault();
      }
      registerEmail.value = "";
      registerPassword.value = "";
    }
  });
}

function signIn() {
  const signInEmail = document.getElementById("signInEmail");
  const signInPassword = document.getElementById("signInPassword");
  const signInForm = document.getElementById("signInTabForm");
  signInForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const result = await auth.signInWithEmailAndPassword(
        signInEmail.value,
        signInPassword.value
      );
      console.log(result.user);
      const { email } = result.user;
      if (result.user) console.log(`Welcome back, ${email}!`);
      signInEmail.value = "";
      signInPassword.value = "";
    } catch (error) {
      e.preventDefault();
      errorCodeLookUp(error);
      signInEmail.value = "";
      signInPassword.value = "";
    }
  });
}

function resetPassword() {
  const resetPasswordInputEmail = document.getElementById(
    "forgotPasswordEmail"
  );
  const forgotPasswordForm = document.getElementById("forgotPasswordTabForm");

  forgotPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const result = await auth.sendPasswordResetEmail(
        resetPasswordInputEmail.value
      );
      console.log(result);
      if (result === undefined) {
        console.log(
          `Password reset link has been sent to ${resetPasswordInputEmail.value}. Please check your email.`
        );
      }
      resetPasswordInputEmail.value = "";
    } catch (error) {
      e.preventDefault();
      errorCodeLookUp(error);
      resetPasswordInputEmail.value = "";
    }
  });
}

async function saveData(data) {
  try {
    await db.collection("users").add(data);
  } catch (error) {
    console.log(error.message);
  }
}

async function updateUserProfile(user, profile) {
  try {
    const { email, displayName } = profile;
    await user.updateProfile({
      displayName,
      email,
    });
  } catch (error) {
    console.log(error.message);
  }
}

function errorCodeLookUp(error) {
  const errorMessages = new Map([
    [
      "auth/email-already-in-use",
      "The email address is already in use by another account.",
    ],
    ["auth/invalid-email", "Please enter a valid email address."],
    ["auth/missing-password", "Password field cannot be blank."],
    ["auth/missing-email", "Email field cannot be blank."],
    ["auth/user-not-found", "This user has not been registered."],
    [
      "auth/invalid-password",
      "Password should be between 6 to 30 characters with one uppercase letter, lowercase letter, and a special character",
    ],[
      "auth/wrong-password",
      "Email or password is incorrect"
    ]
  ]);

  const errorMessage = errorMessages.get(error.code);
  if (errorMessage) console.log(errorMessage);
  else console.log("An error occurred: ", error.message);
}

function isValidPassword(password) {
  // Password complexity requirements:
  // - At least one uppercase letter
  // - At least one lowercase letter
  // - At least one special character
  // - Length between 6 and 30 characters
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}[\]:;<>,.?~]).{6,30}$/;
  return passwordRegex.test(password);
}
