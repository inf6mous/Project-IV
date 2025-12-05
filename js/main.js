const slideContainer = document.getElementById("slideContainer");
let slides = Array.from(slideContainer.children);

const btnNext = document.getElementById("next");
const btnPrev = document.getElementById("prev");

let index = 1;

// Clone first & last slides
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.className = "clone";
lastClone.className = "clone";

// Insert clones
slideContainer.appendChild(firstClone);
slideContainer.insertBefore(lastClone, slides[0]);

// Refresh slide list
slides = Array.from(slideContainer.children);

function slideWidth() {
  return slides[0].clientWidth;
}

function setPosition(animated = true) {
  slideContainer.style.transition = animated ? "transform 0.5s ease" : "none";
  slideContainer.style.transform = `translateX(${-index * slideWidth()}px)`;
}

window.addEventListener("resize", () => setPosition(false));

// Button events
btnNext.addEventListener("click", () => {
  index++;
  setPosition(true);
});

btnPrev.addEventListener("click", () => {
  index--;
  setPosition(true);
});

// Infinite-loop snap
slideContainer.addEventListener("transitionend", () => {
  if (slides[index].classList.contains("clone")) {
    if (slides[index] === firstClone) {
      index = 1; // jump to first real slide
    } else if (slides[index] === lastClone) {
      index = slides.length - 2; // jump to last real slide
    }
    setPosition(false);
  }
});

// Initialize
window.onload = () => {
  setPosition(false);
};

