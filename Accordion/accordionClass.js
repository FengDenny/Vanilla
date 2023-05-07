const Accordion = {
  init: function() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(this.setupAccordion.bind(this));
  },

  setupAccordion: function(item) {
    const openButton = item.querySelector('.accordion-open');
    const closeButton = item.querySelector('.accordion-close');
    openButton.addEventListener('click', this.toggleActive(item));
    closeButton.addEventListener('click', this.toggleActive(item));
  },

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
};

Accordion.init();
