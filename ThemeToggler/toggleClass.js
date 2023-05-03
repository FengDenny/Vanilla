const themeToggler = {
    darkTheme: {
      "--darkTheme": "#212F3D",
      "--lightTheme": "#F0F3F4"
    },
    lightTheme: {
      "--lightTheme": "#F0F3F4",
      "--darkTheme": "#212F3D"
    },
    body: document.querySelector("body"),
    lightThemeButton: document.querySelector("#toggle-light"),
    darkThemeButton: document.querySelector("#toggle-dark"),
    headingTheme: document.getElementById("toggle-heading"),
    toggleColor: document.querySelectorAll(".darkThemeColor, .lightThemeColor"),
    currentTheme: "lightTheme",
    isLightTheme: function () {
        return this.currentTheme === "lightTheme";
      },
    themeToggler: function () {  
      this.body.classList.toggle("lightThemeBG", this.isLightTheme());
      this.body.classList.toggle("darkThemeBG", !this.isLightTheme());
  
      this.headingTheme.classList.remove( this.isLightTheme() ? "darkThemeColor" : "lightThemeColor");
      this.headingTheme.classList.add( this.isLightTheme() ? "lightThemeColor" : "darkThemeColor");
  
      this.toggleColor.forEach(element => {
        element.classList.remove( this.isLightTheme() ? "darkThemeColor" : "lightThemeColor");
        element.classList.add( this.isLightTheme() ? "lightThemeColor" : "darkThemeColor");
      });
  
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
  