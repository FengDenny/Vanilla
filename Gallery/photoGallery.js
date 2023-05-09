const photoGallery = {
    photos: [],
    galleryGrid: document.querySelector(".gallery-grid"),
    endpoint:"https://jsonplaceholder.typicode.com/photos" ,
    init() {
      this.fetchPhotos();
    },
    fetchPhotos() {
      fetch(`${this.endpoint}?_limit=52`)
        .then(response => response.json())
        .then(data => {
          this.photos = data;
          this.createMasonry();
        })
        .catch(error => console.error(error));
    },
    createPhotoGallery(photo) {
      const { title, thumbnailUrl } = photo;
      const html = `
      <div class="photo" data-title="${title}" data-thumbnail="${thumbnailUrl}">
      <img src="${thumbnailUrl}" alt="${title}">
      <div class="title-overlay">
          <p>${title}</p>
        </div>
    </div>`;
      return html;
    },
    createMasonry() {
      this.photos.forEach((photo) => {
        const gallery = this.createPhotoGallery(photo);
        this.galleryGrid.insertAdjacentHTML("beforeend", gallery);
      });
    },
  };
  
  photoGallery.init();
  