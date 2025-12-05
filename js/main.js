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

.builtin-about {
}

.builtin-about-centered .aboutme {
    padding: 8px 16px 16px 16px;
}

.builtin-about .builtin-about-column {
    position: relative;
    padding-top: 8px;
    max-width: 700px;
    margin: 0 auto;
}

.builtin-about .builtin-breadcrumbs {
    width: 668px;
    margin: 0 auto;
}

.builtin-about-ltrt .builtin-breadcrumbs {
    width: 678px;
}

.builtin-about-ltrt .myphoto .pv-outer {
    padding-right: 40px;
    padding-bottom: 40px;
}

.builtin-contact {
}

.builtin-contact-middle {
    vertical-align: middle;
}

.builtin-contact-frame {
    padding: 40px 103px;
}

.builtin-contact-form {
    vertical-align: middle;
}

.builtin-contact .contactInfo TD {
    width: 246px;
    max-width: 246px;
    overflow: hidden;
    line-height: 18px;
}

.builtin-contact .contactInfo TD.label {
    width: 100px;
    line-height: 18px;
}

.builtin-contact-table {
    table-layout: fixed;
    border-collapse: collapse;
    width: 944px;
    margin: 0 auto;
}

.builtin-contact-info, .builtin-contact-form {
    padding: 40px 60px;
}

.builtin-contact .contactInfo {
    width: 294px;
    margin: 32px auto;
    position: relative;
}

.builtin-contact .contact-form {
    padding-top: 12px;
    width: 280px;
    margin: 0 auto;
    position: relative;
}

.contact-recaptcha .grecaptcha-badge {
    width: 256px;
    height: 60px;
    display: block;
    transition: right 0.3s ease 0s;
    position: fixed;
    bottom: 114px !important;
    box-shadow: grey 0px 0px 5px;
    border-radius: 2px;
    overflow: hidden;
    visibility: visible !important;
    z-index: 2;
}

.builtin-guestbook {
}

.builtin-guestbook .builtin-guestbook-column {
    position: relative;
    padding-top: 8px;
    max-width: 700px;
    margin: 0 auto;
}

.builtin-guestbook .builtin-breadcrumbs {
    width: 700px;
    margin: 0 auto;
}

.builtin-featured .pg {
    margin-top: 20px;
}

.builtin-recent .pg {
    margin-top: 20px;
}

.builtin-login {
}

.builtin-login .form-frame-bin {
    min-height: 455px;
}
