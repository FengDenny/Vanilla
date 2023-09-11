
function switchTab(tabID){
    const tabs = document.querySelectorAll(".tab")
    const forms = document.querySelectorAll("form")
    const activeForm = document.getElementById(`${tabID}Form`)
    const forgotPasswordTabHeader = document.getElementById("forgotPasswordTabHeader")

    if(tabID === "forgotPasswordTab") forgotPasswordTabHeader.classList.remove("hidden")
    else forgotPasswordTabHeader.classList.add("hidden")

    tabs.forEach(tab => {
        if(tab.getAttribute('data-tab') === tabID) tab.classList.add("active-tab");
        else tab.classList.remove("active-tab");
    })

    forms.forEach(form => form.classList.add("hidden"))
    activeForm.classList.remove("hidden")
}

function tabClickHandler(){
    const tabContainer = document.querySelector(".tab-container");
    const forgotPasswordTab = document.querySelector(".forgot-password-tab");
    const misclickTab = document.querySelector(".misclick-tab .tab");
    const signInTab = document.querySelector("[data-tab='signInTab']");
    const registerTab = document.querySelector("[data-tab='registerTab']");
    tabContainer.addEventListener("click", (e) =>{
        if(e.target.classList.contains("tab")){
            const tabID = e.target.getAttribute('data-tab')
            switchTab(tabID)
        }
    })

    forgotPasswordTab.addEventListener("click", (e) => {
        const tabID = e.target.getAttribute('data-tab');
        signInTab.classList.add("hidden")
        registerTab.classList.add("hidden")
        switchTab(tabID);
    })

    misclickTab.addEventListener("click", () => {
        const tabID = misclickTab.getAttribute('data-tab');
        signInTab.classList.remove("hidden");
        registerTab.classList.remove("hidden")
        switchTab(tabID);
    });

}

switchTab('signInTab');
tabClickHandler()