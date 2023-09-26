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
    updatePassword();
    tabClickHandler()
    logOut()
    auth.onAuthStateChanged((user) => {
      displayUserData(user)
      displayLastSignInStatus(user)
      displayMonthlyChanges(user)
      displayVerifiedEmailStatus(user)
      listenToUserProfileChanges(user.uid)
      saveUpdatedEmailAndDisplayName(user.uid)
      resetMonthlyChanges(user.uid)
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

function logOut(){
  const logoutBtn = document.getElementById("logoutBtn")
  logoutBtn.addEventListener("click", () => {
    auth.signOut().then(() => window.location.href ="/").catch((error) => console.log(error))
  })
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

  query.onSnapshot((querySnapshot) => {
    if(!querySnapshot.empty){
      const doc = querySnapshot.docs[0]
      const userData = doc.data()
      const changesCount = userData.changes || 0
      changesNumberElement.textContent = changesCount
      changesTitleElement.textContent = changesCount === 1 ? 'Change' : "Changes"
    }
  })

}

function displayUserData(user) {
    const userDisplayNameElement = document.getElementById("userDisplayName")
    function updateDisplayName(displayName) {
      userDisplayNameElement.textContent = displayName || "User";
      userDisplayNameElement.classList.remove("hidden");
    }
  
    if(user){
        const {displayName} = user
        updateDisplayName(displayName)
        const usersRef = db.collection("users");
        const query = usersRef.where("uid", "==", user.uid);
        query.onSnapshot((querySnapshot) => {
          if(!querySnapshot.empty){
            const doc = querySnapshot.docs[0]
            const {displayName} = doc.data()
            if(displayName !== userDisplayNameElement.textContent){
              updateDisplayName(displayName)
            }
          }
        })
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
  
  function updateEmailAndDisplayName(userId){

    return new Promise((resolve, reject) => {
        const displayNameInput = document.getElementById("displayName")
        const emailInput = document.getElementById("email")
        const usersRef = db.collection("users");
        const query = usersRef.where("uid", "==", userId);
        query.get().then((snapshot) => {
          if(!snapshot.empty){
            const doc = snapshot.docs[0]
            const user = doc.data()
            const updatePromises = []
            if(displayNameInput.value &&  user.displayName !== displayNameInput.value){
            const profileUpdatePromise =  auth.currentUser.updateProfile({
                displayName : displayNameInput.value
              }).then(() => {
                return doc.ref.update({displayName:displayNameInput.value})
              })
              updatePromises.push(profileUpdatePromise)
            }

            if( emailInput.value && user.email !== emailInput.value){
              const emailUpdatePromise = auth.currentUser.updateEmail(emailInput.value)
              .then(() => {
                return doc.ref.update({email:emailInput.value})
              })
              updatePromises.push(emailUpdatePromise)
            }

            const changesCount = updatePromises.length
            console.log(changesCount)
            if(changesCount > 0){
              updatePromises.push(incrementChangesField(doc.ref, changesCount))
            }
            
            Promise.all(updatePromises)
            .then(() => {
              console.log("Changed saved Sucessfully")
              resolve()
            })
            .catch((error) => {
              console.error("Error updating: ", error)
              reject(error)
            })
          } else{
            reject(new Error("User not found"))
          }
      })
    })
  }

  function saveUpdatedEmailAndDisplayName(userId){
    const generalInfoForm = document.getElementById("generalInfoForm")
    generalInfoForm.addEventListener("submit", function(e) {
      e.preventDefault();
      updateEmailAndDisplayName(userId)
      .then(() => console.log("Saved successfully"))
      .catch((error) => console.log(error.message))
    })
  }


  function updatePassword(){
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
    const securityinfoForm = document.getElementById("securityinfoForm");

    securityinfoForm.addEventListener("submit", function(e){
      e.preventDefault()
      const currentPassword = currentPasswordInput.value
      const newPassword = newPasswordInput.value
      const confirmNewPassword = confirmNewPasswordInput.value
      const user = auth.currentUser
      if (newPassword !== confirmNewPassword) {
        console.log("New password and confirm password must match.");
        return;
      }

      const credential =  firebase.auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      user.reauthenticateWithCredential(credential)
      .then(() => {
        return user.updatePassword(newPassword)
      })
      .then(() => {
        console.log("Password updated successfully")
        currentPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        console.log("Current password is incorrect")
      })

    })
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
  
  function incrementChangesField(docRef, changesCount) {
    return docRef.update({
      changes: firebase.firestore.FieldValue.increment(changesCount),
    });
  }

  function resetMonthlyChanges(userId) {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    console.log('Current Date:', currentDate);
    console.log('First Day of Month:', firstDayOfMonth);
  
    // Compare year, month, and date without considering time
    if (
      currentDate.getFullYear() === firstDayOfMonth.getFullYear() &&
      currentDate.getMonth() === firstDayOfMonth.getMonth() &&
      currentDate.getDate() === firstDayOfMonth.getDate()
    ) {
      const usersRef = db.collection('users');
      const query = usersRef.where("uid", "==", userId);
  
      query.get()
        .then((querySnapshot) => {
          const batch = db.batch();
          console.log('Query Snapshot:', querySnapshot.docs);
  
          querySnapshot.forEach((doc) => {
            const userRef = usersRef.doc(doc.id);
            batch.update(userRef, { changes: 0 });
          });
  
          return batch.commit();
        })
        .then(() => {
          console.log('Monthly changes reset successfully');
        })
        .catch((error) => {
          console.error('Error resetting monthly changes:', error);
        });
    }
  }
  
  

  // function testMonthlyChangesReset(userId) {
  //   // Define the date representing the first day of the month
  //   const originalDate = Date;
  //   const firstDayOfMonth = new Date();
  //   firstDayOfMonth.setDate(1);
  
  //   // Temporarily override the Date object
  //   Date = class extends originalDate {
  //     constructor() {
  //       super();
  //       if (arguments.length === 0) {
  //         return new originalDate(firstDayOfMonth);
  //       }
  //       return new originalDate(...arguments);
  //     }
  //   };
  
  //   // Call the resetMonthlyChanges function
  //   resetMonthlyChanges(userId);
  
  //   // Restore the original Date object
  //   Date = originalDate;
  // }
  
  // // Call the testing function
  // testMonthlyChangesReset("XL8xazpLdBOjLQU8OalxAeRTDmG3");