
function switchTab(tabID){
    const tabs = document.querySelectorAll(".tab")
    const forms = document.querySelectorAll("form")
    const activeForm = document.getElementById(`${tabID}Form`)
    const forgotPasswordTabHeader = document.getElementById("forgotPasswordTabHeader");

    tabs.forEach(tab => {
        tab.classList.toggle("active-tab", tab.getAttribute('data-tab') === tabID);
    })

    forms.forEach(form => form.classList.add("hidden"))
    activeForm.classList.remove("hidden")

    forgotPasswordTabHeader.classList.toggle("hidden", tabID !== "forgotPasswordTab");

}

function tabClickHandler(){
    const tabContainer = document.querySelector(".tab-container");
    const forgotPasswordTab = document.querySelector(".forgot-password-tab");
    const misclickTab = document.querySelector(".misclick-tab .tab");
    const signInTab = document.querySelector("[data-tab='signInTab']");
    const registerTab = document.querySelector("[data-tab='registerTab']");

    function handleToClick(id){
        switch(id){
            case "signInTab":
                signInTab.classList.remove("hidden")
                registerTab.classList.remove("hidden")
                switchTab(id)
                break;
            case "forgotPasswordTab":
                signInTab.classList.add("hidden")
                registerTab.classList.add("hidden")
                switchTab(id)
                break;
            default: 
                switchTab(id)
                break;
        }
    }

    function addListenerEvent(element){
        element.addEventListener("click", (e) => {
            const id = e.target.getAttribute("data-tab")
            handleToClick(id)
        })
    }
    addListenerEvent(tabContainer)
    addListenerEvent(misclickTab)
    addListenerEvent(forgotPasswordTab)
}

function showPasswordHint() {
    const showHintLabel = document.querySelector('.show-hint');
    const passwordHintContainer = document.querySelector('.password-hint-container');
    const hintItemsContainer = document.querySelector('.hint-items'); // Parent container for hint items
    const hintRegex = [
      /^.{6,30}$/, // Between 6 and 30 characters
      /[A-Z]/,     // Contain at least one uppercase letter
      /[a-z]/,     // Contain at least one lowercase letter
      /[!@#$%^&*()_+{}[\]:;<>,.?~]/, // Contain at least one special character
    ];
  
    function updateHintClasses() {
      const password = document.getElementById('registerPassword').value;
      hintItemsContainer.querySelectorAll('.hint-item').forEach((hintItem, index) => {
        const requirementsMet = hintRegex[index].test(password);
        hintItem.classList.toggle('invalid-hint', !requirementsMet);
        hintItem.classList.toggle('valid-hint', requirementsMet);
      });
    }
  
    showHintLabel.addEventListener('click', () => {
      passwordHintContainer.classList.toggle('show-password-container');
      if (passwordHintContainer.classList.contains('show-password-container')) {
        updateHintClasses(); 
        document.getElementById('registerPassword').addEventListener('input', updateHintClasses);
      } else {
        document.getElementById('registerPassword').removeEventListener('input', updateHintClasses);
      }
    });
  }
  


switchTab('signInTab');
tabClickHandler()
showPasswordHint()