// scripts/utils.js

export function typeEffect(el, text, speed = 50) {
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text.charAt(i);
    i++;
    if (i > text.length) clearInterval(timer);
  }, speed);
}

export function randomFlicker(el) {
  el.style.opacity = Math.random() > 0.9 ? 0.8 : 1;
}
