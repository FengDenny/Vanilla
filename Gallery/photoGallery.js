const photoGallery = (function() {
  function init() {
    this.fetchPhotos();
  }

  function fetchPhotos() {
    fetch(this.endpoint)
      .then(function(response) {
        return response.json();
      }.bind((this)))
      .then(function(data) {
        this.photos = data;
        this.createMasonry();
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

  function createMasonry() {
    this.photos.forEach(function(photo) {
      const gallery = this.createPhotoGallery(photo);
      this.galleryGrid.insertAdjacentHTML("beforeend", gallery);
    }.bind(this));
  }

  return {
    photos: [],
    endpoint:"https://jsonplaceholder.typicode.com/photos?_limit=50",
    galleryGrid: document.querySelector(".gallery-grid"),
    init,
    fetchPhotos,
    createPhotoGallery,
    createMasonry
  };
})();

photoGallery.init();
