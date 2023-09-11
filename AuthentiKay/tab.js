
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

switchTab('signInTab');
tabClickHandler()