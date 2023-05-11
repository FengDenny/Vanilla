const photoGallery = (function() {
  function init() {
    this.fetchPhotos();
  }

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

  function createGallery() {
    this.photos.forEach(function(photo) {
      const gallery = this.createPhotoGallery(photo);
      this.galleryGrid.insertAdjacentHTML("beforeend", gallery);
    }.bind(this));
    this.lastPhoto = this.galleryGrid.lastElementChild
    this.setupIntersectionObserver();
  }

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

  return {
    photos: [],
    endpoint: "https://jsonplaceholder.typicode.com/photos",
    galleryGrid: document.querySelector(".gallery-grid"),
    start: 0,
    limit: 50,
    fetching: false,
    lastPhoto:null,
    init,
    fetchPhotos,
    createPhotoGallery,
    createGallery,
    setupIntersectionObserver
  };
})();

photoGallery.init();
