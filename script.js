function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
  
  
}
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Optional: Remember theme across refresh using localStorage
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.classList.add('dark-mode');
  themeToggleBtn.textContent = '☀️ Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    themeToggleBtn.textContent = '☀️ Light Mode';
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggleBtn.textContent = '🌙 Dark Mode';
    localStorage.setItem('theme', 'light');
  }
});
