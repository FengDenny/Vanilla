const themeToggler =  {
    darkTheme:{
        "--darkTheme":" #212F3D",
        "--lightTheme":"#F0F3F4"
    }, 
    lightTheme:{
        "--lightTheme":"#F0F3F4",
        "--darkTheme":" #212F3D"
    },
    lightThemeButton: document.querySelector("#toggle-light"),
    darkThemeButton : document.querySelector("#toggle-dark"),
    currentTheme:"lightTheme",
    themeToggler: function() {
        const body = document.querySelector('body');
        body.classList.toggle('darkThemeBG');
        const toggleColor = document.querySelectorAll('.darkThemeColor, .lightThemeColor');
        
        if(this.currentTheme === "lightTheme"){
            body.style.setProperty("--lightTheme", this.lightTheme['--lightTheme'])
            toggleColor.forEach(element => {
                element.style.color = this.lightTheme['--darkTheme']
                element.style.backgroundColor = this.lightTheme['--lightTheme']
            })
            this.lightThemeButton.style.display = "none"
            this.darkThemeButton.style.display = "block"
        }else{
            body.style.setProperty("--darkTheme", this.lightTheme['--darkTheme'])
            toggleColor.forEach(element => {
                element.style.color = this.lightTheme['--lightTheme']
                element.style.backgroundColor = this.lightTheme['--darkTheme']
            })
            this.lightThemeButton.style.display = "block"
            this.darkThemeButton.style.display = "none"
        }
        this.currentTheme = this.currentTheme === "lighTheme" ? "darkTheme" : "lightTheme"
    }

}

themeToggler.lightThemeButton.addEventListener("click", () =>{
    themeToggler.currentTheme = "lightTheme"
    themeToggler.themeToggler()
})


themeToggler.darkThemeButton.addEventListener("click", ()=>{
    themeToggler.currentTheme = "darkTheme"
    themeToggler.themeToggler()
})

function currentTheme() {
    const currentTheme = themeToggler.currentTheme;
    if (currentTheme === 'lightTheme') {
        themeToggler.lightThemeButton.style.display ="none"
        themeToggler.darkThemeButton.style.display ="block"
    } else {
        themeToggler.lightThemeButton.style.display="block"
        themeToggler.darkThemeButton.style.display = "none"
    }
  }
  
  currentTheme();