# Accordion

## HTML5

- Written using appropriate markup for our `hero` and `accordion` section

## CSS3 

- CSS is used and written to help `accordionClass.js` to add or remove `active` and adding necessary animations using `visible`

**Font** 

***Google Font used***

```
 --header-font: 'Braah One', sans-serif;
 --description-font: 'Work Sans', sans-serif;
```

## JavaScript (ES6) 

- JavaScript is written using `behavior delegation`, `closures`, and `currying`

> Closures and currying example usage

```
toggleActive: function(item) {
    return function() {
      const content = item.querySelector('.accordion-item-content');
      if (item.classList.contains('active')) {
        item.classList.remove('active');
        content.addEventListener('animationend', function() {
          content.classList.remove('visible');
        }, {once: true});
      } else {
        content.classList.add('visible');
        item.classList.add('active');
      }
    };
  }
```

> Behavior delegation example usage

```
 init: function() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(this.setupAccordion.bind(this));
  }
```

### **toggleClass.js**

`toggleClass.js` uses delegation behavior design pattern with closures and currying to help remove or add `active` and `visible` css when needed. 

> Behavior Delegation

<code>Behavior delegation</code> is used when the <code>init</code> function sets up event listeners for each accordion item by calling the <code>setupAccordion</code> function for each item found by <code>querySelectorAll</code>. The <code>setupAccordion</code>  function then adds event listeners to the open and close buttons for each accordion item.

> Closures

<code>Closure</code> is used when the <code>toggleActive</code> function returns another function that has access to the <code>item</code> parameter from the outer function's scope. This is because the returned function is created inside the <code>toggleActive</code> function, which creates a closure around its parameters and variables.

> Currying

<code>Currying</code> is also used in the <code>toggleActive</code> function, where it returns another function that is passed to the event listener. This allows us to pass additional arguments to the event listener function, which in this case is the <code>item</code> parameter.


***Icon used***

**FontAwesome**
```
<i class="fa-solid fa-angles-up"></i>
<i class="fa-solid fa-angles-down"></i>
```