const themeToggler =  {
    darkTheme: {
        "darkTheme": " #212F3D",
        "lightTheme": "#F0F3F4",
        "darkThemeDescription": "#7189a3",
    }, 
    lightTheme: {
        "lightTheme": "#F0F3F4",
        "darkTheme": " #212F3D",
        "lightThemeDescription": "#3d4d5e",
    },
 
    body: document.querySelector('body'),
    lightThemeButton: document.getElementById("toggle-light"),
    darkThemeButton: document.getElementById("toggle-dark"),
    headingTheme: document.getElementById("toggle-heading"),
    descriptionTheme:document.getElementById("toggle-description"),
    currentTheme: "lightTheme",
    themeToggler: function() {
        const theme = this.currentTheme === "lightTheme" ? this.lightTheme : this.darkTheme;
        this.body.style.backgroundColor = theme[(this.currentTheme === "lightTheme" ? "light" : "dark") + "Theme"];

        // hero heading
        this.headingTheme.style.setProperty("lightTheme", this.lightTheme["lightTheme"]);
        this.headingTheme.style.setProperty("darkTheme", this.darkTheme["darkTheme"]);
        this.headingTheme.style.color = theme[(this.currentTheme === 'lightTheme' ? 'dark' : 'light') + 'Theme'];

        // hero description
        this.descriptionTheme.style.setProperty("lightThemeDescription", this.lightTheme["lightThemeDescription"]);
        this.descriptionTheme.style.setProperty("darkThemeDescription", this.darkTheme["darkThemeDescription"]);
        this.descriptionTheme.style.color = theme[(this.currentTheme === 'lightTheme' ? 'light' : 'dark') + 'ThemeDescription'];

        // theme toggle buttons
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
    themeToggler.body.style.backgroundColor = themeToggler[currentTheme][(currentTheme === "lightTheme" ? "light" : "dark") + "Theme"];
    themeToggler.headingTheme.style.color = themeToggler[currentTheme][(currentTheme === "lightTheme" ? "dark" : "light") + "Theme"];
    themeToggler.descriptionTheme.style.color = themeToggler[currentTheme][ (currentTheme === "lightTheme" ? "light" : "dark") + "ThemeDescription"];
}

currentTheme();
