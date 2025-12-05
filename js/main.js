// JS scripts placed here
// script.js — robust infinite carousel

const slider = document.querySelector(".slider");
const slideContainer = document.getElementById("slideContainer");

// initial set of images (real slides)
let realSlides = Array.from(slideContainer.querySelectorAll("img"));
if (realSlides.length === 0) {
  console.warn("No slides found inside #slideContainer");
}

const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

let autoSlideInterval = 3000;
let autoSlideTimer = null;
let index = 1; // will start on the first real slide after clones
let allSlides = []; // will contain clones + real slides
let slideW = 0;
let isTransitioning = false;

// ----- Helpers -----
function computeSlideWidth() {
  // ensure there's at least one slide
  const ref = allSlides[0] || slideContainer.querySelector("img");
  slideW = ref ? ref.clientWidth : 0;
  return slideW;
}

function setPosition(animate = true) {
  if (!slideW) computeSlideWidth();
  if (animate) {
    slideContainer.style.transition = "transform 0.5s ease";
  } else {
    slideContainer.style.transition = "none";
  }
  slideContainer.style.transform = `translateX(${-index * slideW}px)`;
}

function refreshAllSlidesNodeList() {
  allSlides = Array.from(slideContainer.querySelectorAll("img"));
}

// ----- Clone slides for seamless looping -----
function setupClones() {
  // remove any existing clones (in case of re-init)
  const existingFirstClone = slideContainer.querySelector("#first-clone");
  const existingLastClone = slideContainer.querySelector("#last-clone");
  if (existingFirstClone) existingFirstClone.remove();
  if (existingLastClone) existingLastClone.remove();

  // refresh the real slides list
  realSlides = Array.from(slideContainer.querySelectorAll("img"));

  if (realSlides.length === 0) return;

  const firstClone = realSlides[0].cloneNode(true);
  const lastClone = realSlides[realSlides.length - 1].cloneNode(true);
  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  // append/prepend clones
  slideContainer.appendChild(firstClone);
  slideContainer.insertBefore(lastClone, slideContainer.firstChild);

  // refresh NodeList
  refreshAllSlidesNodeList();
}

// ----- Next / Prev -----
function nextSlide() {
  if (isTransitioning) return;
  index++;
  isTransitioning = true;
  setPosition(true);
}

function prevSlide() {
  if (isTransitioning) return;
  index--;
  isTransitioning = true;
  setPosition(true);
}

// ----- Transition handling to snap when on clones -----
slideContainer.addEventListener("transitionend", () => {
  // ensure we have slides
  if (!allSlides.length) return;

  // if we're on the first-clone (which sits at the end), jump to real first
  if (allSlides[index] && allSlides[index].id === "first-clone") {
    // disable animation, move to index 1 (first real slide)
    index = 1;
    setPosition(false);
  }

  // if we're on the last-clone (which sits at the start), jump to real last
  if (allSlides[index] && allSlides[index].id === "last-clone") {
    index = allSlides.length - 2;
    setPosition(false);
  }

  isTransitioning = false;
});

// ----- Auto slide control -----
function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(() => {
    nextSlide();
  }, autoSlideInterval);
}

function stopAutoSlide() {
  if (autoSlideTimer) {
    clearInterval(autoSlideTimer);
    autoSlideTimer = null;
  }
}

// pause auto on hover
if (slider) {
  slider.addEventListener("mouseenter", stopAutoSlide);
  slider.addEventListener("mouseleave", startAutoSlide);
}

// ----- Buttons & Keyboard -----
// keep arrows always visible — button handlers:
if (btnNext) {
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();
    stopAutoSlide();
    nextSlide();
    // restart auto after short delay
    setTimeout(startAutoSlide, 1200);
  });
}

if (btnPrev) {
  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();
    stopAutoSlide();
    prevSlide();
    setTimeout(startAutoSlide, 1200);
  });
}

// keyboard arrows
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    stopAutoSlide();
    nextSlide();
    setTimeout(startAutoSlide, 800);
  } else if (e.key === "ArrowLeft") {
    stopAutoSlide();
    prevSlide();
    setTimeout(startAutoSlide, 800);
  }
});

// ----- Resize handling -----
window.addEventListener("resize", () => {
  // recompute slide width and reset position without animation
  computeSlideWidth();
  setPosition(false);
});

// ----- Touch / swipe (basic) -----
let touchStartX = null;
let touchStartTime = null;
const swipeThreshold = 50; // px
const swipeTime = 500; // ms

if (slider) {
  slider.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      touchStartX = e.touches[0].clientX;
      touchStartTime = Date.now();
      stopAutoSlide();
    }
  });

  slider.addEventListener("touchend", (e) => {
    if (touchStartX === null) {
      startAutoSlide();
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
    setTimeout(startAutoSlide, 600);
  });
}

// ----- Initialization -----
// Wait until images load so widths are correct. If images already cached, "load" may not fire for them,
// so we also fallback to a small timeout if needed.
function initCarousel() {
  if (!slideContainer) return;

  setupClones();
  refreshAllSlidesNodeList();

  // start at the first real slide (index 1 because of prepended last-clone)
  index = 1;

  // compute width after images are (probably) laid out
  computeSlideWidth();
  setPosition(false);

  // safety: if widths are zero (images not yet ready), try again shortly
  if (!slideW) {
    setTimeout(() => {
      computeSlideWidth();
      setPosition(false);
    }, 100);
  }

  startAutoSlide();
}

// If all images are loaded, init now; otherwise wait for window load
if (document.readyState === "complete") {
  initCarousel();
} else {
  window.addEventListener("load", initCarousel);
}
