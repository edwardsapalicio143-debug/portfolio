/* ==========================================================================
   Interactive Logic - Edward Sapalicio Portfolio
   ========================================================================== */

// --- Helper: Escape HTML to Prevent XSS ---
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

// --- Toast Notification System ---
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'success', duration = 4000) {
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = 'ℹ';
  if (type === 'success') icon = '✓';
  else if (type === 'error') icon = '✗';
  else if (type === 'warning') icon = '⚠';
  
  toast.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-message">${escapeHTML(message)}</span>
  `;
  
  toastContainer.appendChild(toast);
  
  // Slide out and remove
  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// --- Navigation Scroll Effects ---
function initNavigation() {
  const header = document.querySelector('.main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Header background fill on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Highlight current nav item on scroll using Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Mobile navigation drawer toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('open');
        navMenu.classList.remove('open');
      });
    });
  }
}

// --- Dynamic Greeting ---
function updateGreeting() {
  const greetingText = document.getElementById('dynamic-greeting');
  const greetingIcon = document.querySelector('.greeting-icon');
  if (!greetingText) return;
  
  const hour = new Date().getHours();
  let greet = '';
  let icon = '✨';

  if (hour < 5) { greet = 'Designing code in the night'; icon = '🦉'; }
  else if (hour < 12) { greet = 'Good morning'; icon = '🌅'; }
  else if (hour < 17) { greet = 'Good afternoon'; icon = '☀️'; }
  else { greet = 'Good evening'; icon = '🌇'; }
  
  greetingText.textContent = `${greet}, welcome to my portfolio`;
  if (greetingIcon) greetingIcon.textContent = icon;
}

// --- Event Handlers & Initializers ---
document.addEventListener('DOMContentLoaded', () => {
  // Initial greetings and navigation binding
  updateGreeting();
  initNavigation();

  // Contact form submission logic (simulated for static online hosting)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const messageInput = document.getElementById('contact-message');
      const submitBtn = document.getElementById('submit-message-btn');
      
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const message = messageInput.value.trim();
      
      if (!name || !email || !message) return;
      
      // Visual feedback: disabling submit button
      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Sending Message...';
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Clear form and trigger notification toast
      contactForm.reset();
      showToast(`Thank you, ${name}! Your message has been sent successfully.`, 'success');
    });
  }

  // --- Lightbox Image Viewer Logic ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeLightboxBtn = document.getElementById('close-lightbox-btn');
  const zoomableImages = document.querySelectorAll('.img-zoomable');

  if (lightboxModal && lightboxImg && lightboxCaption) {
    zoomableImages.forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxCaption.textContent = img.alt || 'Enlarged View';
        lightboxModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Disable scroll
      });
    });

    function closeLightbox() {
      lightboxModal.classList.add('hidden');
      document.body.style.overflow = ''; // Re-enable scroll
      setTimeout(() => {
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
      }, 300);
    }

    if (closeLightboxBtn) {
      closeLightboxBtn.addEventListener('click', closeLightbox);
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !lightboxModal.classList.contains('hidden')) {
        closeLightbox();
      }
    });
  }
});
