# Social Dummies

## HTML5

- Written using appropriate markup for our `hero`  and `posts` section 

## CSS3 

- CSS is used and written to help `socials.js` to toggle between `visible` and `not-visible` class to create animations 

- CSS is also used and written to create the necessary UI layout

**Font** 

***Google Font used***

```css
--header-font: 'Sigmar', cursive;
--description-font: 'Nunito', sans-serif;
```

## JavaScript (ES6) 

- The main part of this `social.js` is to deep dive into `Fetch API` to access `JSONPlaceholder` dummy data of `posts` and `comments` routes.

- Using the returned fetched request, we would display the data inside  `card` class using `createCardContent()` method


```js
   function createCardContent(posts){
        const {title, body, id} = posts
        const html =  `<div class="card" data-id="${id}" data-title="${title}" data-body="${body}">
        <div class="card-header">
            <h2 class="description-text-white">${title}</h2>
            <p class="description-text">${body}</p>
        </div>
        <div class="card-btn">
            <button id="view-comments" class="card-btn-view">View Comments</button>
        </div>
        <div id="comments"></div>
    </div>
     `
    return html
}
```


### IIFE

- `social.js` uses `Immediately Invoked Function Expression` (IIFE) to create closures and private scope for `socialsPost` object. 

- We are using and defining `social` as an `IIFE`, so that It can be `immediately invoked` to help us generate closures at the start. This will help us to `encapsulate` the function and all the variables within it. So that, it will only contain private state variables and not be exposed to the global scope.  

> IIFE example usage

```js
const socialsPost = (function() {
  // function definitions here
  return {
    // object properties and methods here
  };
})();
```

### fetchAll()

> Fetch API example usage

```javascript
  async function fetchAll(){
      try{      
        this.showSpinner()
        const response = await fetch(this.allPosts)
        const posts = await response.json()
        // Iterate over each post and fetch comments
        for(let post of posts){
            // higher-order function
           const fetchComments = this.fetchComments(this.allPosts)
           const comments = await fetchComments(post.id, "comments")
            // Add the comments to the current post object
            post.comments = comments
        }
        this.posts = posts
        // Set the posts property and the lastPost property
        this.lastPost = this.cardContainer.lastElementChild
        // Slice the posts array and create the cards
        const startIndex = this.start
        const endIndex = this.start + this.limit
        const slicedPosts = this.posts.slice(startIndex, endIndex)
        this.start += this.limit
        this.createCard(slicedPosts)
        this.hideSpinner()
        this.fetching = false
    
      }catch(error){
        console.error(error)
      }
    }

```
- `fetchAll()` method is an asynchronous function which uses `async/await` to fetch data from `JSONPlaceholder API`, which includes `posts` and `comments` route. 

- `fetchAll()` uses `fetchComments` `currying` technique method to fetch `comments` for each post and adding the `comments` to the current `post` object. 

-  `fetchAll()` uses `createCard` method to create card element for each post, but only show the limit of `10` items. However, as we hit the final `10th` item, we will fetch more items using `Intersection Observer` 

- As we are fetching data, we initialize a `spinner` to let the user know, data is still being fetched

```js 
function showSpinner(){
    this.loadingItems.classList.add("spinner")
}
function hideSpinner(){
    this.loadingItems.classList.remove("spinner")
}

```

### fetchComments()

> Displaying the request example

```js

   function fetchComments(baseUrl){
        return async function(postId, params) {
            const response = await fetch(`${baseUrl}${postId}/${params}`)
            const comments = await response.json()
            return comments
        }
    }

```
- `fetchComments()` uses `currying` technique to help construct a `URL` endpoint to retrieve comments for a post based on each posts `postId`, returning a promise that resolves to an array of comments.

- Using the `currying` technique, we are partially applying the `baseUrl` parameter and return a new function that takes two extra parameters  `postId` and `params`.


#### createCard()

```js 

function createCard(posts){
    posts.forEach(function(post){
        const content = this.createCardContent(post)
        this.cardContainer.insertAdjacentHTML("beforeend", content)
    }.bind(this))

    this.lastPost = this.cardContainer.lastElementChild

    this.setupIntersectionObserver()

}

```
- `createCard` method created card elements for each post appending it to `cardContainer` method to create the `HTML` content for each card using `this.cardContainer.insertAdjacentHTML("beforeend", content)`

- `createCard` method is setting up  `Intersection Observer` to detect the last post in view, so that, it will trigger a `fetch` request for more data

- `createCard` method also  uses the `bind` method to bind `this` keyword to the function passed to forEach, allowing it to access the `createCardContent` method and `cardContainer` element.

### toggleComments()

```js
function toggleComments(e) {
    const button = e.target
    const card = button.closest(".card")
    const commentsSection = card.querySelector("#comments")

    if(commentsSection.children.length === 0){
        const postId = card.dataset.id
        const post = this.posts.find(p =>Number(p.id) === Number(postId))
    
        if(post.comments !== undefined){
            post.comments.forEach((comment) => {
                const html = `<div class="comment">
                <h2 class="comment-email description-text">${comment.email}</h2>
                <p class="comment-body description-text-white">${comment.body}</p>
            </div>`
            commentsSection.insertAdjacentHTML("beforeend", html)
            })
        }
    }

    commentsSection.classList.toggle("visible")
    if (commentsSection.classList.contains("visible")) {
         // Show the comments section with the slide-down animation
        commentsSection.classList.remove("not-visible")
    } else {

         // Hide the comments section with the slide-up animation
         commentsSection.classList.add("not-visible")
         commentsSection.addEventListener("animationend", function() {
             commentsSection.classList.remove("not-visible")
             commentsSection.textContent = "";
         }, { once: true });
    }
    button.textContent = commentsSection.classList.contains("visible") ? "Hide Comments" : "View Comments"
}
```
- `toggleComments` method will be called when we click on `View Comments` button on a post. It will then display or hide the comments section for that post. 

### IntersectionObserver

- Once we have displayed the first 10th items, as we scroll down to the last item inside `#card-container`, our `IntersectionObserver` will be called to showcase the next 10th items.

- `IntersectionObserver` is a better choice than to use `getBoundingClientRect()`, which can be slow and resource-intensive as it causes `overhead performances` by continuously checking for elements intersection regardless of viewports


> IntersectionObserver example usage
```js
function setupIntersectionObserver(){
    const options ={
        rootL:null,
        rootMargin:"0px",
        threshold:1.0
    }

    const observer = new IntersectionObserver((entries) => {

        if(entries[0].isIntersecting && !this.fetching){
            this.fetching = true
            this.showSpinner()
            this.fetchAll()
        }
    }, options)
    
    this.lastPost && observer.observe(this.lastPost)
}
```
### addCardButtonListener()

```js

function addCardButtonListener() {
    document.addEventListener("click", function(event){
        const button = event.target
        if(button.classList.contains("card-btn-view")) socialsPost.toggleComments(event)   
    })
}

```

-`addCardButtonListener` add a click event listener to the document and triggers `toggleComments` when `View Comments` buttons has been clicked

***Icon used***

**FontAwesome**
```html
<i class="fa-solid fa-circle-notch fa-xl"></i>
```