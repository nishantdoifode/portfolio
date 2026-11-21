// Typing effect
const typingText = document.querySelector(".typing-text");
const textArray = ["Frontend Developer", "UI/UX Enthusiast", "Web Designer"];
let index = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[index].length) {
    typingText.textContent += textArray[index].charAt(charIndex);
    charIndex++;
    setTimeout(type, 100);
  } else {
    setTimeout(erase, 2000);
  }
}

function erase() {
  if (charIndex > 0) {
    typingText.textContent = textArray[index].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, 50);
  } else {
    index = (index + 1) % textArray.length;
    setTimeout(type, 500);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(type, 500);

  // Dark/Light toggle
  const themeToggle = document.getElementById("theme-toggle");
  const icon = themeToggle.querySelector("i");

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    icon.classList.toggle("fa-moon");
    icon.classList.toggle("fa-sun");
  });


  // GSAP animations
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray(".reveal").forEach((el, i) => {
    gsap.from(el, {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 90%",
        toggleActions: "restart none none none"
      }
    });
  });
});

gsap.utils.toArray(".section").forEach((el) => {
  gsap.from(el.querySelectorAll("h2, p, .cards, .card"), {
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.2,
    scrollTrigger: {
      trigger: el,
      start: "top 80%",
    },
  });
});
gsap.from(".resume-btn", {
  opacity: 0,
  y: 30,
  duration: 1,
  delay: 0.7,
  ease: "power3.out"
});
// Animate skill bars when in view
gsap.utils.toArray(".progress").forEach((bar) => {
  const width = bar.style.width;
  bar.style.width = "0";
  gsap.to(bar, {
    width: width,
    duration: 1,
    ease: "power2.out",
    scrollTrigger: {
      trigger: bar,
      start: "top 90%",
      toggleActions: "play none none none",
    },
  });
});
gsap.from(".contact-wrapper", {
  scrollTrigger: ".contact-wrapper",
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power2.out"
});
gsap.from(".card", {
  scrollTrigger: ".cards",
  y: 50,
  opacity: 0,
  duration: 1,
  stagger: 0.2
});
const cards = document.querySelectorAll('.card');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const modalImg = document.querySelector('.modal-img');
const modalTitle = document.querySelector('.modal-content h2');
const modalDesc = document.querySelector('.modal-content p');
const closeModal = document.querySelector('.close-modal');

let lastOpenedCard = null;

cards.forEach(card => {
  card.addEventListener('click', () => {
   
    if (lastOpenedCard === card && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
      lastOpenedCard = null;
      return;
    }

    const imgSrc = card.querySelector('img').src;
    const title = card.querySelector('h3').textContent;
    const desc = card.getAttribute('data-description') || 'Project details here';

    modalImg.src = imgSrc;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;

    modal.classList.remove('hidden');
    lastOpenedCard = card;
  });
});

closeModal.addEventListener('click', () => {
  modal.classList.add('hidden');
  lastOpenedCard = null;
});

