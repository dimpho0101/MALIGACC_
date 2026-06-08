// Navigation active link updater
document.addEventListener('DOMContentLoaded', function() {
  updateActiveNavLink();
  setupFormHandling();
});

function updateActiveNavLink() {
  const links = document.querySelectorAll('.nav-links a');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Form handling
function setupFormHandling() {
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit(this);
    });
  }
}

function handleFormSubmit(form) {
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  };

  // Validate form
  if (!data.name || !data.email || !data.subject || !data.message) {
    showNotification('Please fill in all fields', 'error');
    return;
  }

  // Validate email
  if (!isValidEmail(data.email)) {
    showNotification('Please enter a valid email address', 'error');
    return;
  }

  // Show success message
  showNotification('Thank you! We will contact you soon.', 'success');
  form.reset();

  // In a real application, you would send this data to a server
  console.log('Form submitted:', data);
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function showNotification(message, type) {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 2rem;
    border-radius: 8px;
    background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    font-weight: 600;
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
