// JS scripts placed here

const slider = document.querySelector(".slider");
const slideContainer = document.getElementById("slideContainer");
const slides = document.querySelectorAll(".slides img");
const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

let index = 0;
let autoSlideInterval = 3000; // ms
let autoSlideTimer = null;
let isPaused = false;

// compute slide width dynamically (handles responsive sizing)
function slideWidth() {
  return slides[0] ? slides[0].clientWidth : 0;
}

function updatePosition() {
  slideContainer.style.transform = `translateX(${-index * slideWidth()}px)`;
}

// show a given slide index (wraps around)
function showSlide(i, {resetTimer = true} = {}) {
  index = ((i % slides.length) + slides.length) % slides.length; // safe modulo
  updatePosition();

  if (resetTimer) {
    restartAutoSlide();
  }
}

// next / prev handlers
function nextSlide() { showSlide(index + 1); }
function prevSlide() { showSlide(index - 1); }

// Auto slide
function startAutoSlide() {
  if (autoSlideTimer) return;
  autoSlideTimer = setInterval(() => {
    if (!isPaused) nextSlide();
  }, autoSlideInterval);
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

function restartAutoSlide() {
  stopAutoSlide();
  startAutoSlide();
}

// Pause while user hovers, focuses, or interacts
slider.addEventListener("mouseenter", () => { isPaused = true; });
slider.addEventListener("mouseleave", () => { isPaused = false; });

// Buttons - always visible; clicking resets timer (so user can control)
btnNext.addEventListener("click", (e) => {
  e.preventDefault();
  isPaused = true;
  nextSlide();
  // give user a short window of manual control before resuming
  setTimeout(() => { isPaused = false; }, 1200);
});

btnPrev.addEventListener("click", (e) => {
  e.preventDefault();
  isPaused = true;
  prevSlide();
  setTimeout(() => { isPaused = false; }, 1200);
});

// Keyboard support (Left / Right)
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    isPaused = true;
    prevSlide();
    setTimeout(() => { isPaused = false; }, 800);
  } else if (e.key === "ArrowRight") {
    isPaused = true;
    nextSlide();
    setTimeout(() => { isPaused = false; }, 800);
  }
});

// Recompute position when window resizes (keeps the current slide centered)
window.addEventListener("resize", updatePosition);

// Basic touch / swipe support for mobile
let touchStartX = null;
let touchStartTime = null;
const swipeThreshold = 50; // px
const swipeTime = 500; // ms

slider.addEventListener("touchstart", (e) => {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX;
    touchStartTime = Date.now();
    isPaused = true;
  }
});

slider.addEventListener("touchmove", (e) => {
  // prevent accidental scroll when dragging horizontally
  // we won't preventDefault globally to avoid breaking page scroll
});

slider.addEventListener("touchend", (e) => {
  if (touchStartX === null) {
    isPaused = false;
    return;
  }
  const touchEndX = (e.changedTouches && e.changedTouches[0].clientX) || null;
  const dt = Date.now() - touchStartTime;
  if (touchEndX !== null) {
    const dx = touchEndX - touchStartX;
    if (Math.abs(dx) > swipeThreshold && dt < swipeTime) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  }
  touchStartX = null;
  touchStartTime = null;
  // small delay before resuming auto
  setTimeout(() => { isPaused = false; }, 800);
});

// ensure buttons remain on top & visible (if your CSS inadvertently hides them)
btnNext.style.zIndex = 50;
btnPrev.style.zIndex = 50;

// initialize
updatePosition();
startAutoSlide();
