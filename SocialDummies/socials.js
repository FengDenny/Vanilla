const socialsPost = (function(){
    function init(){
        this.fetchAll()
    }
    async function fetchAll(){
      try{
        const response = await fetch(this.allPosts)
        const posts = await response.json()
        // Iterate over each post and fetch comments
        for (let post of posts){
            const commentsResponse = await fetch(`${this.allPosts}${post.id}/comments`)
            const comments = await commentsResponse.json()
             // Add the comments to the current post object
            post.comments = comments
        }
        const startIndex = this.start;
        const endIndex = this.start + this.limit;
        this.posts = posts.slice(startIndex, endIndex)
        this.start += this.limit
        this.createCard()
        this.hideSpinner()
        this.fetching = false

      }catch(error){
        console.error(error)
      }
    }

    function createCardContent(posts){
        const {title, body, id} = posts
        const html =  `<div class="card" data-id="${id}" data-title="${title}" data-body="${body}">
        <div>
            <h2 class="description-text-white">${title}</h2>
            <p class="description-text">${body}</p>
        </div>
        <div class="card-btn">
            <button id="view-comments" class="card-btn-view">View Comments</button>
        </div>
    </div>
     `
    return html
}

function createCard(){
    this.posts.forEach(function(post){
        const content = this.createCardContent(post)
        this.cardContainer.insertAdjacentHTML("beforeend", content)
    }.bind(this))

    this.lastPost = this.cardContainer.lastElementChild

    this.setupIntersectionObserver()

}

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

function showSpinner(){
    this.loadingItems.classList.add(" spinner")
}
function hideSpinner(){
    this.loadingItems.classList.remove("spinner")
}


return{
    posts:[],
    allPosts:"https://jsonplaceholder.typicode.com/posts/",
    cardContainer: document.querySelector("#card-container"),
    loadingItems: document.querySelector("#loading-items"),
    start:0,
    limit:10,
    fetching:false,
    lastPost: null,
    init,
    fetchAll,
    createCardContent,
    createCard,
    setupIntersectionObserver,
    showSpinner,
    hideSpinner
}

})()

socialsPost.init()