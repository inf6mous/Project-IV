// JS scripts placed here
// TRUE INFINITE CAROUSEL

const slider = document.querySelector(".slider");
const slideContainer = document.getElementById("slideContainer");
const slides = document.querySelectorAll(".slides img");
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

let index = 1; // Start on the FIRST real slide
let autoSlideInterval = 3000;
let autoSlideTimer = null;

// Clone first and last slides for seamless looping
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

slideContainer.appendChild(firstClone);
slideContainer.insertBefore(lastClone, slides[0]);

let allSlides = document.querySelectorAll(".slides img");

// Set initial position
function slideWidth() {
  return allSlides[0].clientWidth;
}

function setPosition() {
  slideContainer.style.transform = `translateX(${-index * slideWidth()}px)`;
}

window.addEventListener("resize", setPosition);

// Go to next slide
function nextSlide() {
  if (index >= allSlides.length - 1) return;
  index++;
  slideContainer.style.transition = "transform 0.5s ease";
  setPosition();
}

// Go to previous slide
function prevSlide() {
  if (index <= 0) return;
  index--;
  slideContainer.style.transition = "transform 0.5s ease";
  setPosition();
}

// Loop back when hitting clones
slideContainer.addEventListener("transitionend", () => {
  if (allSlides[index].id === "first-clone") {
    slideContainer.style.transition = "none";
    index = 1;
    setPosition();
  }

  if (allSlides[index].id === "last-clone") {
    slideContainer.style.transition = "none";
    index = allSlides.length - 2;
    setPosition();
  }
});

// Buttons
btnNext.addEventListener("click", nextSlide);
btnPrev.addEventListener("click", prevSlide);

// Auto-slide
function startAutoSlide() {
  autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
}
function stopAutoSlide() {
  clearInterval(autoSlideTimer);
}
slider.addEventListener("mouseenter", stopAutoSlide);
slider.addEventListener("mouseleave", startAutoSlide);

// Start
setPosition();
startAutoSlide();
