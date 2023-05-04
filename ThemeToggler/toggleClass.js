const themeToggler = {
    lightThemeButton: document.getElementById("toggle-light"),
    darkThemeButton: document.getElementById("toggle-dark"),
    headingTheme: document.getElementById("toggle-heading"),
    descriptionTheme:document.getElementById("toggle-description"),
    body: document.querySelector("body"),
    currentTheme: "lightTheme",
    isLightTheme: function () {
        return this.currentTheme === "lightTheme";
      },
    themeToggler: function () {  
      this.body.classList.toggle("lightThemeBG", this.isLightTheme());
      this.body.classList.toggle("darkThemeBG", !this.isLightTheme());
  
      
      // hero heading
      this.headingTheme.classList.remove( this.isLightTheme() ? "darkThemeColor" : "lightThemeColor");
      this.headingTheme.classList.add( this.isLightTheme() ? "lightThemeColor" : "darkThemeColor");
      
      // hero description
      this.descriptionTheme.classList.remove(this.isLightTheme() ? "darkThemeDescription" : "lightThemeDescription")
      this.descriptionTheme.classList.add(this.isLightTheme() ? "lightThemeDescription" : "darkThemeDescription")
  
      // theme toggle buttons
      this.lightThemeButton.classList.toggle("notActive", this.isLightTheme());
      this.darkThemeButton.classList.toggle("notActive", !this.isLightTheme());
  
      this.currentTheme =  this.isLightTheme() ? "darkTheme" : "lightTheme";
    }
  };
  
  themeToggler.lightThemeButton.addEventListener("click", () => {
    themeToggler.currentTheme = "lightTheme";
    themeToggler.themeToggler();
  });
  
  themeToggler.darkThemeButton.addEventListener("click", () => {
    themeToggler.currentTheme = "darkTheme";
    themeToggler.themeToggler();
  });
  
  function currentTheme() {
    themeToggler.lightThemeButton.classList.toggle("notActive", themeToggler.isLightTheme());
    themeToggler.darkThemeButton.classList.toggle("notActive", !themeToggler.isLightTheme());
  }
  
  currentTheme();
  