const themeToggler =  {
    darkTheme: {
        "--darkTheme": " #212F3D",
        "--lightTheme": "#F0F3F4"
    }, 
    lightTheme: {
        "--lightTheme": "#F0F3F4",
        "--darkTheme": " #212F3D"
    },
    body: document.querySelector('body'),
    lightThemeButton: document.getElementById("toggle-light"),
    darkThemeButton: document.getElementById("toggle-dark"),
    headingTheme: document.getElementById("toggle-heading"),
    toggleColor: document.querySelectorAll('.darkThemeColor, .lightThemeColor'),
    currentTheme: "lightTheme",
    themeToggler: function() {
        const theme = this.currentTheme === "lightTheme" ? this.lightTheme : this.darkTheme;
        this.body.style.backgroundColor = theme["--" + (this.currentTheme === "lightTheme" ? "light" : "dark") + "Theme"];
        this.headingTheme.style.setProperty("--lightTheme", this.lightTheme["--lightTheme"]);
        this.headingTheme.style.setProperty("--darkTheme", this.darkTheme["--darkTheme"]);
        this.headingTheme.style.color = theme['--' + (this.currentTheme === 'lightTheme' ? 'dark' : 'light') + 'Theme'];
        this.toggleColor.forEach(element => {
            element.style.color = theme['--darkTheme'];
            element.style.backgroundColor = theme['--lightTheme'];
        });
        this.lightThemeButton.style.display = this.currentTheme === "lightTheme" ? "none" : "block";
        this.darkThemeButton.style.display = this.currentTheme === "lightTheme" ? "block" : "none";
        this.currentTheme = this.currentTheme === "lightTheme" ? "darkTheme" : "lightTheme";
    }
};

themeToggler.lightThemeButton.addEventListener("click", () =>{
    themeToggler.currentTheme = "lightTheme";
    themeToggler.themeToggler();
});

themeToggler.darkThemeButton.addEventListener("click", ()=>{
    themeToggler.currentTheme = "darkTheme";
    themeToggler.themeToggler();
});

function currentTheme() {
    const currentTheme = themeToggler.currentTheme;
    themeToggler.lightThemeButton.style.display = currentTheme === 'lightTheme' ? "none" : "block";
    themeToggler.darkThemeButton.style.display = currentTheme === 'lightTheme' ? "block" : "none";
    themeToggler.body.style.backgroundColor = themeToggler[currentTheme]["--" + (currentTheme === "lightTheme" ? "light" : "dark") + "Theme"];
    themeToggler.headingTheme.style.color = themeToggler[currentTheme]["--" + (currentTheme === "lightTheme" ? "dark" : "light") + "Theme"];
}

currentTheme();
