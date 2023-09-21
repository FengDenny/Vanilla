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

  
  document.addEventListener("DOMContentLoaded", () => {
    auth.onAuthStateChanged((user) => {
      displayUserData(user)
      displayLastSignInStatus(user)
    });
  });


  function displayLastSignInStatus(user){
    const lastSignIn = document.getElementById("last-sign-in")
    if(user){
      const {lastLoginAt} = user.metadata
      lastSignIn.textContent = convertTimeStamp(lastLoginAt)
    }

  }
  
  // You can retrieve and display user data from localStorage
function displayUserData(user) {
    const userDisplayNameElement = document.getElementById("userDisplayName")
    if(user){
        const {displayName} = user
        userDisplayNameElement.textContent =displayName || "User"
        userDisplayNameElement.classList.remove("hidden")
        window.history.replaceState(null, null, window.location.href);
    }else{
        userDisplayNameElement.textContent=""
        userDisplayNameElement.classList.add("hidden")
        window.location.href = "/";
    }
  }

  function convertTimeStamp(string){
    const timestamp = parseInt(string, 10)
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
  
