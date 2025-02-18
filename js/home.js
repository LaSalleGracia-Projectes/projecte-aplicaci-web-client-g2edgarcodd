document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '1';
  const searchBtn = document.querySelector('.search-btn');
  const searchOverlay = document.getElementById('searchOverlay');
  searchBtn.addEventListener('click', () => {
    searchOverlay.classList.toggle('active');
  });
  let slider = document.getElementById('slider');
  let slides = document.querySelectorAll('.slide');
  let currentIndex = 0;
  const totalSlides = slides.length;
  function showNextSlide(){
    currentIndex = (currentIndex + 1) % totalSlides;
    slider.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
  }
  setInterval(showNextSlide, 3000);
  const movieImages = document.querySelectorAll('.movie-image');
  movieImages.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded');
      });
    }
  });
  const favoriteIcons = document.querySelectorAll('.favorite-icon');
  favoriteIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      icon.classList.toggle('active');
      icon.classList.add('beat');
      icon.addEventListener('animationend', () => {
        icon.classList.remove('beat');
      }, { once: true });
    });
  });
});

// Espera a que el DOM cargue
document.addEventListener('DOMContentLoaded', () => {
  // Flechas
  const arrowLeft = document.getElementById('arrowLeft');
  const arrowRight = document.getElementById('arrowRight');
  const top10Slider = document.getElementById('top10Slider');
  
  // Para un slider básico horizontal, podrías mover con translateX:
  let currentIndex = 0;
  const itemWidth = 200; // Ancho aproximado de cada item (card + gap)
  const visibleItems = 5; // Cuántos items deseas mostrar a la vez (ajusta a tu layout)

  arrowLeft.addEventListener('click', () => {
    currentIndex = Math.max(currentIndex - 1, 0);
    top10Slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  });

  arrowRight.addEventListener('click', () => {
    // Máximo: (cantidad de items - visibleItems)
    const maxIndex = top10Slider.children.length - visibleItems;
    currentIndex = Math.min(currentIndex + 1, maxIndex);
    top10Slider.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
  });

  // Bookmark toggle
  const bookmarks = document.querySelectorAll('.bookmark-icon');
  bookmarks.forEach(icon => {
    icon.addEventListener('click', () => {
      const active = icon.getAttribute('data-active') === 'true';
      icon.setAttribute('data-active', !active);
    });
  });
});
