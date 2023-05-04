# Theme Toggler

## HTML5

- Written using appropriate markup for our navbar using `nav` and hero section using `section`

## CSS3 

- CSS is used and written to help `toggleClass.js` to switch between `dark or light theme`

**Font** 

***Google Font used***

```
--header-font: 'Darumadrop One', cursive;
--description-font: 'Playfair Display', serif;
```

## JavaScript (ES6) 

- JavaScript is written in ES6 format using `arrow function` to lexical bind `this` with `themeToggler` object.

> Example Usage

```
themeToggler.lightThemeButton.addEventListener("click", () => {
    themeToggler.currentTheme = "lightTheme";
    themeToggler.themeToggler();
  });
  
  themeToggler.darkThemeButton.addEventListener("click", () => {
    themeToggler.currentTheme = "darkTheme";
    themeToggler.themeToggler();
  });
```

### **toggleClass.js**

Implemented using `classList` to return `DOMTokenList`, utilizing `instance methods` to toggle between dark/light theme.


### **toggleStyle.js**

Implemented using `style` to manipulate inline styling using `CSSStyleDeclaration` object to toggle between dark/light theme.


***Script used***

**FontAwesome**