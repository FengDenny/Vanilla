# Gallery

## HTML5

- Written using appropriate markup  using `header` for header section of the page, and `main` for the main section

## CSS3 

- CSS is used and written to help display the dummy data gallery using `grid` syste. 
- Each photo displays their title with `title overlay` on `hover` using `transform`, `opacity` property, and `absolute` positioning 


**Font** 

***Google Font used***

```css
--header-font: 'Sigmar', cursive;
--description-font: 'Nunito', sans-serif;
```

## JavaScript (ES6) 

- The main part of this `photoGallery.js` is to deep dive into `Fetch API` to access `jsonplaceholder` dummy data.

- Using the returned `Promise` request, we would display the data inside  `gallery-grid` using `createGallery()` function

```js
galleryGrid: document.querySelector(".gallery-grid"),
```

### IIFE

- `photoGallery.js` uses `Immediately Invoked Function Expression` (IIFE) to create a closure. 

- We are using and defining `photoGallery` as an `IIFE`, so that It can be `immediately invoked` to help us generate a closure at the start. This will help us to `encapsulate` the function and all the variables within it. So that, it will only contain private state variables and not be exposed to the global scope.  

> IIFE example usage

```js
const photoGallery = (function() {
  // function definitions here
  return {
    // object properties and methods here
  };
})();
```

### fetchPhotos() 

> Fetch API example usage

```javascript
function fetchPhotos() {
    fetch(this.endpoint)
      .then(function(response){
        return response.json()
      })
      .then(function(data) {
        const startIndex = this.start;
        const endIndex = this.start + this.limit
        this.photos = data.slice(startIndex, endIndex)
        this.createGallery();
        this.start += this.limit;
        this.fetching = false;
      }.bind(this))
      .catch(function(error) {
        console.error(error);
      });
  }


```
- FetchPhotos() function is implemented using `higher-order function` as it takes a callback function as an `argument`, returning another function which is a `Promise`

- With the `bind` method help, we are ensuring that `this` keyword inside the second `.then()` will refer back to `PhotoGallery()` function. So that, it captures the `outer function scope` of `this.photos`, `this.createGallery` and etc.

### createGallery()

> Displaying the request example

```js

  function createGallery() {
    this.photos.forEach(function(photo) {
      const gallery = this.createPhotoGallery(photo);
      this.galleryGrid.insertAdjacentHTML("beforeend", gallery);
    }.bind(this));
    this.lastPhoto = this.galleryGrid.lastElementChild
    this.setupIntersectionObserver();
  }

```
- `createGallery()` function uses `closure` to create a new function scope `createPhotoGallery()` using `forEach` method during each iterations to generate an HTML string for each photo.

```js 

  function createPhotoGallery(photo) {
    const { title, thumbnailUrl } = photo;
    const html = `
      <div class="photo" data-title="${title}" data-thumbnail="${thumbnailUrl}">
        <img src="${thumbnailUrl}" alt="${title}">
        <div class="title-overlay">
          <p>${title}</p>
        </div>
      </div>`;
    return html;
  }

```

- With the `bind` method help, we are ensuring that `this` keyword inside `forEach` will refer back to `PhotoGallery()` function. So that, it captures the `outer function scope` of `this.photos`, `this.galleryGrid` and etc.


### IntersectionObserver

- Once we have displayed the first 50th items, as we scroll down to the last item inside `gallery-grid`, our `IntersectionObserver` will be called to showcase the next 50th items.

- `IntersectionObserver` is a better choice than to use `getBoundingClientRect()`, which can be slow and resource-intensive as it causes `overhead performances` by continuously checking for elements intersection regardless of viewports


> IntersectionObserver example usage
```js
  function setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    };
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.fetching) {
        this.fetching = true;
        this.fetchPhotos();
      }
    }, options);

    this.lastPhoto && observer.observe(this.lastPhoto);

  }
```

***Icon used***

**FontAwesome**

```html
<i class="fa-regular fa-moon fa-2xl "></i>
<i class="fa-regular fa-sun fa-2xl "></i>
```