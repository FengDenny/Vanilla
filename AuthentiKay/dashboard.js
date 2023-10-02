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
const activityLogMap  = new Map()


document.addEventListener("DOMContentLoaded", () => {
  updateCurrentPassword();
  tabClickHandler();
  logOut();
  auth.onAuthStateChanged((user) => {
    displayUserData(user);
    displayLastSignInStatus(user);
    displayMonthlyChanges(user);
    displayVerifiedEmailStatus(user);
    listenToUserProfileChanges(user.uid);
    saveUpdatedEmailAndDisplayName(user.uid);
    resetMonthlyChanges(user.uid);
    fetchAndPopulateActivityLog(user.uid);
  });
});

// Dashboard tabs
function tabClickHandler() {
  const dashboardTabs = document.querySelector("#dashboard-tabs");
  const tabs = dashboardTabs.querySelectorAll(".dashTab");
  const dashboardContent = document.querySelectorAll(".dashboard-content");

  function handleTabClicked(tabID) {
    dashboardContent.forEach((content) => {
      content.classList.toggle("hidden", content.id !== `${tabID}Dashboard`);
    });
    tabs.forEach((tab) => {
      tab.classList.toggle("active-tab", tab.getAttribute("data-tab") === tabID);
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      const tabID = e.target.getAttribute("data-tab");
      handleTabClicked(tabID);
    });
  });

  const defaultTabID = "activityTab";
  handleTabClicked(defaultTabID);
}

function logOut() {
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => (window.location.href = "/"))
      .catch((error) => console.log(error));
  });
}

// Activity Log Dashboard
function displayLastSignInStatus(user) {
  const lastUpdated = document.getElementById("last-updated");
  if (user) {
    const { lastLoginAt } = user.metadata;
    lastUpdated.textContent = convertTimeStamp(lastLoginAt);
  }
}

async function displayMonthlyChanges(user) {
  const monthHeading = document.getElementById("month");

  if (user) {
    const { lastLoginAt } = user.metadata;
    const getDate = dateExtraction(convertTimeStamp(lastLoginAt));
    const { currentDate, dateMonth, dateYear } = getDate;
    const formattedDateMonth = new Intl.DateTimeFormat("en-US", {
      month: "long",
    }).format(new Date(dateYear, dateMonth, 1));

    if (
      currentDate.getMonth() === dateMonth &&
      currentDate.getFullYear() === dateYear
    ) {
      monthHeading.textContent = "This month";
    } else {
      monthHeading.textContent = `${formattedDateMonth} ${dateYear}`;
    }
  }
}

// Function to add a new activity log row
function addActivityLogRow(change) {
  const activityTable = document.querySelector("#activityTable tbody");
  const row = document.createElement("tr");
  row.classList.add("column-data");

  const { timestamp, description, previousName, currentName, previousEmail, currentEmail } = change;

  if (timestamp === null) return;

  const textContentData = [
    convertFSTimestampToJSDate(timestamp),
    description,
    description === "Updated username" ? previousName : previousEmail,
    description === "Updated username" ? currentName : currentEmail,
  ];

  const elementID = [
    "date-column",
    "description-column",
    "current-column",
    "updated-column",
  ];

  for (let i = 0; i < textContentData.length; i++) {
    const cell = document.createElement("td");
    cell.id = elementID[i];
    cell.textContent = textContentData[i];
    row.appendChild(cell);
  }

  // Add the row to the table and keep a reference in the map
  activityTable.appendChild(row);
  activityLogMap.set(change.timestamp, row);
}

// Function to update an existing activity log row
function updateActivityLogRow(change) {
  const row = activityLogMap.get(change.timestamp);

  if (row) {
    const [_, description, previousName, currentName, previousEmail, currentEmail] = change;

    // Update the relevant cells in the row
    row.querySelector("#description-column").textContent = description;
    row.querySelector("#current-column").textContent = description === "Updated username" ? previousName : previousEmail;
    row.querySelector("#updated-column").textContent = description === "Updated username" ? currentName : currentEmail;
  }
}

async function fetchChangesData(userId, year, month) {
  try {
    const usersRef = db.collection("users");
    const querySnapshot = await usersRef.where("uid", "==", userId).get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const documentId = doc.id;
      const monthlyChangesRef = usersRef.doc(documentId)
        .collection("monthlyChanges")
        .doc(`${year}-${month}`);

      const [usernameChanges, emailChanges] = await Promise.all([
        fetchMonthlyChanges(monthlyChangesRef.collection("usernameChanges")),
        fetchMonthlyChanges(monthlyChangesRef.collection("emailChanges"))
      ]);

      return [...usernameChanges, ...emailChanges];
    } else {
      console.log("No document found with UID:", userId);
      return [];
    }
  } catch (error) {
    console.error("Error fetching changes data:", error);
    return [];
  }
}

async function fetchMonthlyChanges(collectionRef) {
  const snapshot = await collectionRef.get();
  return snapshot.docs.map((doc) => doc.data());
}

function populateActivityLog(changesData) {
  clearActivityLog();

  for (const change of changesData) {
    if (change) {
      addActivityLogRow(change);
    }
  }
}

async function fetchAndPopulateActivityLog(userId, callback) {
  try {
    const { currentYear, currentMonth } = fetchCurrentYearAndMonth();
    const changesData = await fetchChangesData(userId, currentYear, currentMonth);
    populateActivityLog(changesData);
    if (typeof callback === "function") {
      callback(); // Call the callback function to update the UI
    }
  } catch (error) {
    console.error("Error fetching and populating activity log:", error);
  }
}
function clearActivityLog() {
  const activityTable = document.querySelector("#activityTable tbody");
  const rows = activityTable.querySelectorAll("tr");
  for (let i = 1; i < rows.length; i++) {
    activityTable.removeChild(rows[i]);
  }
}

function monthlyChanges(userId, changes) {
  return new Promise((resolve, reject) => {
    const usersRef = db.collection("users");
    const query = usersRef.where("uid", "==", userId);

    let monthlyChangesListener = query.onSnapshot((querySnapshot) => {
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userDocRef = userDoc.ref;
        const { currentYear, currentMonth } = fetchCurrentYearAndMonth();
        const documentId = `${currentYear}-${currentMonth}`;
        const changesPromises = [];

        changes.forEach((change) => {
          let changeDocumentRef;
          let changeData;

          switch (change.description) {
            case "Updated username":
              changeDocumentRef = userDocRef
                .collection("monthlyChanges")
                .doc(documentId)
                .collection("usernameChanges")
                .doc();
              changeData = {
                description: change.description,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                previousName: change.previousName,
                currentName: change.currentName,
              };

              changesPromises.push(
                changeDocumentRef
                  .set(changeData)
                  .then(() => {
                    console.log("Username Document created successfully");
                  })
                  .catch((error) => {
                    console.error("Error creating document", error);
                  })
              );
              break;
            case "Updated email":
              changeDocumentRef = userDocRef
                .collection("monthlyChanges")
                .doc(documentId)
                .collection("emailChanges")
                .doc();
              changeData = {
                description: change.description,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                previousEmail: change.previousEmail,
                currentEmail: change.currentEmail,
              };

              changesPromises.push(
                changeDocumentRef
                  .set(changeData)
                  .then(() => {
                    console.log("Email Document created successfully");
                  })
                  .catch((error) => {
                    console.error("Error creating document", error);
                  })
              );
              break;
            default:
              break;
          }
        });

        // Wait for all changes to be saved and then resolve with the changes data
        Promise.all(changesPromises)
          .then(() => {
            resolve(changes);
          })
          .catch((error) => {
            reject(error);
          });

        console.log(typeof monthlyChangesListener);

        // After processing changes, detach the listener
        if (typeof monthlyChangesListener === "function") {
          monthlyChangesListener(); // This will remove the listener
        }
      } else {
        reject(new Error("User not found"));
      }
    });
  });
}


// Firestore listener to track changes in user profile
function listenToUserProfileChanges(userId) {
  const usersRef = db.collection("users");
  const query = usersRef.where("uid", "==", userId);
  const changesNumberElement = document.getElementById("changes-number");
  const changesTitleElement = document.getElementById("changes-title");

  query.onSnapshot(async (querySnapshot) => {
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const userData = doc.data();
      const changesCount = userData.changes || 0;
      changesNumberElement.textContent = changesCount;
      changesTitleElement.textContent =
        changesCount === 1 ? "Change" : "Changes";
    }
  });
}

function displayUserData(user) {
  const userDisplayNameElement = document.getElementById("userDisplayName");
  function updateDisplayName(displayName) {
    userDisplayNameElement.textContent = displayName || "User";
    userDisplayNameElement.classList.remove("hidden");
  }

  if (user) {
    const { displayName } = user;
    updateDisplayName(displayName);
    const usersRef = db.collection("users");
    const query = usersRef.where("uid", "==", user.uid);
    query.onSnapshot((querySnapshot) => {
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const { displayName } = doc.data();
        if (displayName !== userDisplayNameElement.textContent) {
          updateDisplayName(displayName);
        }
      }
    });
    window.history.replaceState(null, null, window.location.href);
  } else {
    userDisplayNameElement.textContent = "";
    userDisplayNameElement.classList.add("hidden");
    window.location.href = "/";
  }
}

// Account Settings
function displayVerifiedEmailStatus(user) {
  const emailVerification = document.getElementById("email-verified");
  if (user) {
    const { emailVerified } = user;
    emailVerification.textContent = emailVerified;
  }
}

function updateEmailAndDisplayName(userId) {
  return new Promise((resolve, reject) => {
    const displayNameInput = document.getElementById("displayName");
    const emailInput = document.getElementById("email");
    const generalInfoCurrentPasswordInput = document.getElementById(
      "generalInfoCurrentPassword"
    );
    const password = generalInfoCurrentPasswordInput.value;
    const user = auth.currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
    );

    const usersRef = db.collection("users");
    const query = usersRef.where("uid", "==", userId);

    query.get().then((snapshot) => {
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const userData = doc.data();
        const updatePromises = [];
        const changes = [];

        if (
          displayNameInput.value &&
          userData.displayName !== displayNameInput.value
        ) {
          const profileUpdatePromise = auth.currentUser
            .updateProfile({
              displayName: displayNameInput.value,
            })
            .then(() => {
              return doc.ref.update({
                displayName: displayNameInput.value,
              });
            });
          updatePromises.push(profileUpdatePromise);
          changes.push({
            description: "Updated username",
            previousName: user.displayName,
            currentName: displayNameInput.value,
          });
        }

        if (emailInput.value && userData.email !== emailInput.value) {
          // Only reauthenticate if email is being updated
          const emailUpdatePromise = auth.currentUser
            .reauthenticateWithCredential(credentials)
            .then(() => {
              return auth.currentUser.updateEmail(emailInput.value);
            })
            .then(() => {
              return doc.ref.update({ email: emailInput.value });
            });
          updatePromises.push(emailUpdatePromise);
          changes.push({
            description: "Updated email",
            previousEmail: user.email,
            currentEmail: emailInput.value,
          });
        }

        const changesCount = updatePromises.length;
        console.log(changesCount);
        if (changesCount > 0) {
          updatePromises.push(incrementChangesField(doc.ref, changesCount));
        }

        Promise.all(updatePromises)
          .then(() => {
            displayNameInput.value = "";
            emailInput.value = "";
            generalInfoCurrentPasswordInput.value = "";
            console.log("Changes saved successfully");
            resolve(changes);
          })
          .catch((error) => {
            console.error("Error updating: ", error);
            reject(error);
          });
      } else {
        reject(new Error("User not found"));
      }
    });
  });
}


function saveUpdatedEmailAndDisplayName(userId) {
  const generalInfoForm = document.getElementById("generalInfoForm");

  generalInfoForm.addEventListener("submit", function (e) {
    e.preventDefault();

    updateEmailAndDisplayName(userId)
      .then((changes) => {
        console.log(changes);
        if (changes && changes.length > 0) {
          monthlyChanges(userId, changes).then(() => {
            // Update the activity log UI
            fetchAndPopulateActivityLog(userId, () => {
              console.log("Activity log updated after changes.");
            });

            console.log("Saved successfully");
          });
        }
      })
      .catch((error) => console.log(error.message));
  });
}


function updateCurrentPassword() {
  const currentPasswordInput = document.getElementById("currentPassword");
  const newPasswordInput = document.getElementById("newPassword");
  const confirmNewPasswordInput = document.getElementById("confirmNewPassword");
  const securityinfoForm = document.getElementById("securityinfoForm");

  securityinfoForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const currentPassword = currentPasswordInput.value;
    const newPassword = newPasswordInput.value;
    const confirmNewPassword = confirmNewPasswordInput.value;
    const user = auth.currentUser;
    if (newPassword !== confirmNewPassword) {
      console.log("New password and confirm password must match.");
      return;
    }

    const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    user
      .reauthenticateWithCredential(credential)
      .then(() => {
        return user.updatePassword(newPassword);
      })
      .then(() => {
        console.log("Password updated successfully");
        currentPasswordInput.value = "";
        newPasswordInput.value = "";
        confirmNewPasswordInput.value = "";
      })
      .catch((error) => {
        console.error("Error updating password:", error);
        console.log("Current password is incorrect");
      });
  });
}

// Helpers
function fetchCurrentYearAndMonth() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  return { currentYear, currentMonth };
}

function convertFSTimestampToJSDate(timestamp) {
  const date = new Date(
    timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
  );
  // const formattedDate = convertTimeStamp(date.getTime()) // date + time
  const formattedDate = date.toLocaleDateString();
  return formattedDate;
}

function convertTimeStamp(string) {
  const timestamp = parseInt(string, 10);
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function dateExtraction(date) {
  const currentDate = new Date();
  const dataDate = new Date(date);
  const dateMonth = dataDate.getMonth();
  const dateYear = dataDate.getFullYear();
  return { currentDate, dateMonth, dateYear };
}

function incrementChangesField(docRef, changesCount) {
  return docRef.update({
    changes: firebase.firestore.FieldValue.increment(changesCount),
  });
}

function resetMonthlyChanges(userId) {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  console.log("Current Date:", currentDate);
  console.log("First Day of Month:", firstDayOfMonth);

  const lastResetDate = localStorage.getItem("lastMonthlyResetDate")

  if(lastResetDate !== null){
    console.log("Monthly reset already performed this month.");
    return;
  }

  if (
    currentDate.getFullYear() === firstDayOfMonth.getFullYear() &&
    currentDate.getMonth() === firstDayOfMonth.getMonth() &&
    currentDate.getDate() === firstDayOfMonth.getDate()
  ) {
    const usersRef = db.collection("users");
    const query = usersRef.where("uid", "==", userId);

    query
      .get()
      .then((querySnapshot) => {
        const batch = db.batch();
        console.log("Query Snapshot:", querySnapshot.docs);

        querySnapshot.forEach((doc) => {
          const userRef = usersRef.doc(doc.id);
          batch.update(userRef, { changes: 0 });
        });

        return batch.commit();
      })
      .then(() => {
        console.log("Monthly changes reset successfully");
        localStorage.setItem("lastMonthlyResetDate", currentDate.toISOString());
      })
      .catch((error) => {
        console.error("Error resetting monthly changes:", error);
      });
  }
}
