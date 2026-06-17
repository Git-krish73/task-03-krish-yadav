// ================================================
// script.js — Project 3: Interactive Web Elements
// DecodeLabs Batch 2026
//
// RULES FROM THE TRAINING KIT:
// - Use const by default, let only when value changes
// - Never use var
// - js- prefix = JavaScript hook classes
// - is- prefix = state classes (is-dark, is-open, etc.)
// - Use textContent, never innerHTML (security!)
// - Keep functions small and single-purpose
// - Every feature follows: INPUT → PROCESS → OUTPUT
// ================================================


// ================================================
// 1. DARK MODE TOGGLE
// INPUT:   User clicks the theme button
// PROCESS: Check current theme, flip it, save to localStorage
// OUTPUT:  Add/remove .is-dark on body, update button icon
// ================================================

// const = we never reassign this variable, just use it
const themeBtn   = document.querySelector('.js-theme-toggle');
const body       = document.body;

// Check if user had a saved preference from last visit
// localStorage persists data even after closing the browser
const savedTheme = localStorage.getItem('theme');

// Apply saved theme on page load
if (savedTheme === 'dark') {
  body.classList.add('is-dark');
  themeBtn.textContent = '☀️';
}

// The function that runs when the button is clicked
function toggleTheme() {
  // classList.toggle() adds the class if absent, removes if present
  body.classList.toggle('is-dark');

  // Check which state we're now in
  const isDark = body.classList.contains('is-dark');

  // OUTPUT: Update button icon
  themeBtn.textContent = isDark ? '☀️' : '🌙';

  // Save preference so it persists on next visit
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Wire up the event listener — INPUT phase
themeBtn.addEventListener('click', toggleTheme);


// ================================================
// 2. HAMBURGER MENU
// INPUT:   User clicks the hamburger button
// PROCESS: Toggle is-open class on the mobile menu
// OUTPUT:  Menu slides open or closed (CSS handles animation)
// ================================================

const hamburgerBtn = document.querySelector('.js-hamburger');
const mobileMenu   = document.querySelector('.js-mobile-menu');

function toggleMenu() {
  // Toggle the is-open class — CSS transition does the animation
  mobileMenu.classList.toggle('is-open');

  // Update aria-expanded for accessibility
  // This tells screen readers whether the menu is open
  const isOpen = mobileMenu.classList.contains('is-open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);

  // Change the icon ☰ → ✕ when open
  hamburgerBtn.textContent = isOpen ? '✕' : '☰';
}

hamburgerBtn.addEventListener('click', toggleMenu);

// Close menu when a nav link is clicked
// querySelectorAll returns a NodeList — we loop through it
const navLinks = document.querySelectorAll('.js-nav-link');

navLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    mobileMenu.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', false);
    hamburgerBtn.textContent = '☰';
  });
});


// ================================================
// 3. PROJECT FILTER
// INPUT:   User clicks a filter button
// PROCESS: Read the data-filter value, compare to each card's
//          data-category, show/hide accordingly
// OUTPUT:  Cards without matching category get .is-hidden
// ================================================

const filterBtns  = document.querySelectorAll('.js-filter');
const projectCards = document.querySelectorAll('.project-card');

function filterProjects(selectedFilter) {
  // Loop through every project card
  projectCards.forEach(function(card) {
    const cardCategory = card.getAttribute('data-category');

    // Show all if "all" selected, otherwise match category
    if (selectedFilter === 'all' || cardCategory === selectedFilter) {
      card.classList.remove('is-hidden'); // show
    } else {
      card.classList.add('is-hidden');    // hide
    }
  });
}

// Add click listener to each filter button
filterBtns.forEach(function(btn) {
  btn.addEventListener('click', function() {
    // Remove is-active from all buttons first
    filterBtns.forEach(function(b) {
      b.classList.remove('is-active');
    });

    // Add is-active to the clicked button
    btn.classList.add('is-active');

    // Get the filter value from data-filter attribute
    const filter = btn.getAttribute('data-filter');

    // Run the filter
    filterProjects(filter);
  });
});


// ================================================
// 4. CHARACTER COUNTER (live update)
// INPUT:   User types in the message textarea
// PROCESS: Count characters typed
// OUTPUT:  Update the counter text in real time
// ================================================

const messageInput = document.querySelector('#message');
const charCount    = document.querySelector('.js-char-count');
const maxChars     = 300;

// 'input' event fires every time the user types a character
messageInput.addEventListener('input', function() {
  const current = messageInput.value.length;

  // textContent is safe — never use innerHTML for user data!
  charCount.textContent = current + ' / ' + maxChars;

  // Turn counter red when close to limit
  if (current >= maxChars - 20) {
    charCount.style.color = '#e74c3c';
  } else {
    charCount.style.color = '';
  }
});


// ================================================
// 5. FORM VALIDATION
// INPUT:   User clicks "Send Message"
// PROCESS: Check each field — is it empty? Is email valid?
// OUTPUT:  Show error messages OR show success message
// ================================================

const submitBtn    = document.querySelector('.js-submit-btn');
const nameInput    = document.querySelector('#name');
const emailInput   = document.querySelector('#email');
const successMsg   = document.querySelector('.js-success');

// Helper: show an error on a field
// We use textContent (not innerHTML) — safe for user data
function showError(inputEl, errorId, message) {
  inputEl.classList.add('is-error');
  document.querySelector('#' + errorId).textContent = message;
}

// Helper: clear an error from a field
function clearError(inputEl, errorId) {
  inputEl.classList.remove('is-error');
  document.querySelector('#' + errorId).textContent = '';
}

// Validate email format using a regular expression
function isValidEmail(email) {
  return email.includes('@') && email.includes('.');
}

function validateForm() {
  // Track if everything is valid
  let isValid = true;

  // Clear all previous errors first
  clearError(nameInput, 'name-error');
  clearError(emailInput, 'email-error');
  clearError(messageInput, 'message-error');
  successMsg.classList.remove('is-visible');

  // Check name — trim() removes extra spaces
  if (nameInput.value.trim() === '') {
    showError(nameInput, 'name-error', 'Please enter your name.');
    isValid = false;
  }

  // Check email
  if (emailInput.value.trim() === '') {
    showError(emailInput, 'email-error', 'Please enter your email.');
    isValid = false;
  } else if (!isValidEmail(emailInput.value.trim())) {
    showError(emailInput, 'email-error', 'Please enter a valid email address.');
    isValid = false;
  }

  // Check message
  if (messageInput.value.trim() === '') {
    showError(messageInput, 'message-error', 'Please write a message.');
    isValid = false;
  }

  // If all checks passed, show success
  if (isValid) {
    successMsg.textContent = '✅ Message sent! I\'ll get back to you soon.';
    successMsg.classList.add('is-visible');

    // Clear the form fields
    nameInput.value    = '';
    emailInput.value   = '';
    messageInput.value = '';
    charCount.textContent = '0 / 300';
  }
}

submitBtn.addEventListener('click', validateForm);

// Also clear error styling when user starts typing again
nameInput.addEventListener('input', function() {
  clearError(nameInput, 'name-error');
});

emailInput.addEventListener('input', function() {
  clearError(emailInput, 'email-error');
});

messageInput.addEventListener('input', function() {
  clearError(messageInput, 'message-error');
});
