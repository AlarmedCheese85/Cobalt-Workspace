// scripts/theme-toggle.js

document.addEventListener('DOMContentLoaded', () => {
  const selector = document.getElementById('theme');
  const savedTheme = localStorage.getItem('theme') || 'green';
  
  document.body.setAttribute('data-theme', savedTheme);
  selector.value = savedTheme;

  selector.addEventListener('change', () => {
    const newTheme = selector.value;
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
});
