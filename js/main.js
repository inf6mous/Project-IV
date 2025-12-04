// JS scripts placed here

const slideContainer = document.getElementById("slideContainer");
const slides = document.querySelectorAll(".slides img");
let index = 0;

function showSlide(i) {
  index = (i + slides.length) % slides.length;
  slideContainer.style.transform = `translateX(${-index * 600}px)`;
}

document.getElementById("next").addEventListener("click", () => {
  showSlide(index + 1);
});

document.getElementById("prev").addEventListener("click", () => {
  showSlide(index - 1);
});

