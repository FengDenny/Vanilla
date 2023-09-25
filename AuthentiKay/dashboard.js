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
  let previousUser = null

  document.addEventListener("DOMContentLoaded", () => { 
    tabClickHandler()
    auth.onAuthStateChanged((user) => {
      displayUserData(user)
      displayLastSignInStatus(user)
      displayMonthlyChanges(user)
      displayVerifiedEmailStatus(user)
      listenToUserProfileChanges(user.uid)
    });
  });

// Dashboard tabs
function tabClickHandler(){
  // Parent container for dasbboard tab items
  const dashboardTabs = document.querySelector('#dashboard-tabs'); 
  const tabs = dashboardTabs.querySelectorAll(".dashTab")
  const dashboardContent = document.querySelectorAll(".dashboard-content")

  function handleTabClicked(tabID){
    dashboardContent.forEach(content  => {
      if(content.id === `${tabID}Dashboard`) content.classList.remove("hidden")
      else content.classList.add("hidden")
    })  
    tabs.forEach(tab => {
    if(tab.getAttribute("data-tab") === tabID) tab.classList.add("active-tab")
    else tab.classList.remove("active-tab")
    addEventListener(tab)
    })
  }
  
  function addEventListener(element){
    element.addEventListener("click", (e) => {
      const tabID = e.target.getAttribute("data-tab")
      handleTabClicked(tabID)
    })
  }
  // const defaultTabID = 'activityTab';
  const defaultTabID = 'settingsTab';
  handleTabClicked(defaultTabID);
}
  
// Activity Log Dashboard
  function displayLastSignInStatus(user){
    const lastSignIn = document.getElementById("last-sign-in")
    if(user){
      const {lastLoginAt} = user.metadata
      lastSignIn.textContent = convertTimeStamp(lastLoginAt)
    }
  }

  function displayMonthlyChanges(user){
    const monthHeading = document.getElementById('month')
    if(user){
      const {lastLoginAt} = user.metadata
      console.log(user)
      const getDate = dateExtraction(convertTimeStamp(lastLoginAt))
     const {currentDate, dateMonth, dateYear} = getDate
       // Format the month for display (add 1 to account for 0-indexed months)
       const formattedDateMonth = new Intl.DateTimeFormat('en-US', {
        month: 'long',
      }).format(new Date(dateYear, dateMonth, 1));
      if(
        currentDate.getMonth() === dateMonth && 
        currentDate.getFullYear() === dateYear
      ){
        monthHeading.textContent = "This month"
      }else{
        monthHeading.textContent = `${formattedDateMonth} ${dateYear}`;
      }
    }
    
  }

// Firestore listener to track changes in user profile
function listenToUserProfileChanges(userId) {
  const usersRef = db.collection("users");
  const query = usersRef.where("uid", "==", userId);
  const changesNumberElement = document.getElementById('changes-number');
  const changesTitleElement = document.getElementById('changes-title');

  query.get().then((querySnapshot) => {
    if (!querySnapshot.empty) {
      // Get the first document from the query (there should be only one)
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      // Compare the new data with the previous user data
      if (previousUser) {
        let changeCount = 0;
        for (const field in userData) {
          if (userData[field] !== previousUser[field])  changeCount++;
          
        }
        changesNumberElement.textContent = changeCount;
        changesTitleElement.textContent = changeCount === 1 ? 'Change' : 'Changes';
      } else {
        changesNumberElement.textContent = 0;
        changesTitleElement.textContent = 'Change';
      }

      // Update the previousUser reference
      previousUser = { ...userData };
    }
  });
}

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

  // Account Settings
  function displayVerifiedEmailStatus(user){
    const emailVerification = document.getElementById("email-verified")
    if(user){
      const {emailVerified} = user
      emailVerification.textContent = emailVerified
    }
  }

  // Helpers
  function convertTimeStamp(string){
    const timestamp = parseInt(string, 10)
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  function dateExtraction(date){
    const currentDate = new Date()
    const dataDate = new Date(date)
    const dateMonth = dataDate.getMonth()
    const dateYear = dataDate.getFullYear()
    return {currentDate, dateMonth, dateYear}
  }
  
