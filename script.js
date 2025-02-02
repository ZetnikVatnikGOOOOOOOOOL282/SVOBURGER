document.addEventListener("DOMContentLoaded", () => {
    const countryLinks = document.querySelectorAll(".country ul li a");
    countryLinks.forEach(link => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        alert(`Вы выбрали: ${event.target.textContent}`);
      });
    });
  
    document.addEventListener("click", (event) => {
      const countries = document.querySelectorAll(".country");
      countries.forEach((country) => {
        const dropdown = country.querySelector(".dropdown");
        if (dropdown) {
          if (country.contains(event.target)) {
            dropdown.style.display = "block";
          } else {
            dropdown.style.display = "none";
          }
        }
      });
    });
  
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const sliderItems = document.querySelectorAll('.slider-item');

if (slider && prevBtn && nextBtn && sliderItems.length > 0) {
  let currentIndex = 0;
  const totalSlides = sliderItems.length;
  const slideInterval = 5000; 
  const transitionDuration = 800; 
  const firstClone = sliderItems[0].cloneNode(true);
  const lastClone = sliderItems[totalSlides - 1].cloneNode(true);

  slider.appendChild(firstClone);
  slider.prepend(lastClone);

  const sliderItemsUpdated = document.querySelectorAll('.slider-item');
  const slideWidth = sliderItemsUpdated[0].clientWidth;

  slider.style.transform = `translateX(-${slideWidth}px)`;

  let currentPosition = -slideWidth;
  let isTransitioning = false; 

  function updateSliderPosition() {
    slider.style.transition = `transform ${transitionDuration}ms ease`;
    slider.style.transform = `translateX(${currentPosition}px)`;
  }

  function goToNextSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentIndex >= totalSlides - 1) {
      currentIndex = 0;
      currentPosition = -slideWidth;
      setTimeout(() => {
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${currentPosition}px)`;
        isTransitioning = false;
      }, transitionDuration);
    } else {
      currentIndex++;
      currentPosition -= slideWidth;
      setTimeout(() => {
        isTransitioning = false;
      }, transitionDuration);
    }
    updateSliderPosition();
  }

  function goToPrevSlide() {
    if (isTransitioning) return;
    isTransitioning = true;

    if (currentIndex <= 0) {
      currentIndex = totalSlides - 1;
      currentPosition = -(totalSlides * slideWidth);
      setTimeout(() => {
        slider.style.transition = 'none';
        slider.style.transform = `translateX(${currentPosition}px)`;
        isTransitioning = false;
      }, transitionDuration);
    } else {
      currentIndex--;
      currentPosition += slideWidth;
      setTimeout(() => {
        isTransitioning = false;
      }, transitionDuration);
    }
    updateSliderPosition();
  }

  let autoSlideInterval = setInterval(goToNextSlide, slideInterval);

  nextBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    clearInterval(autoSlideInterval);
    goToNextSlide();
    autoSlideInterval = setInterval(goToNextSlide, slideInterval);
  });

  prevBtn.addEventListener('click', () => {
    if (isTransitioning) return;
    clearInterval(autoSlideInterval);
    goToPrevSlide();
    autoSlideInterval = setInterval(goToNextSlide, slideInterval);
  });

  const sliderContainer = document.querySelector('.slider-container');
  sliderContainer.addEventListener('mouseover', () => {
    clearInterval(autoSlideInterval);
  });

  sliderContainer.addEventListener('mouseout', () => {
    autoSlideInterval = setInterval(goToNextSlide, slideInterval);
  });

  window.addEventListener('resize', () => {
    const updatedSlideWidth = sliderItemsUpdated[0].clientWidth;
    currentPosition = -(currentIndex + 1) * updatedSlideWidth;
    slider.style.transform = `translateX(${currentPosition}px)`;
  });

  slider.addEventListener('transitionend', () => {
    isTransitioning = false;
  });
}
  
    const searchInput = document.getElementById('search-input');
    const countrySections = document.querySelectorAll('.country');
  
    if (searchInput) {
      function filterContent() {
        const query = searchInput.value.toLowerCase();
  
        countrySections.forEach(section => {
          const countryName = section.querySelector('h3').textContent.toLowerCase();
          const countryContent = section.textContent.toLowerCase();
          if (countryName.includes(query) || countryContent.includes(query)) {
            section.style.display = '';
          } else {
            section.style.display = 'none';
          }
        });
      }
  
      searchInput.addEventListener('input', filterContent);
    }
  });