'use strict';

//-----------------------------------*\
// #NAVIGATION
//\*-----------------------------------*/

const navLinks = document.querySelectorAll('[data-nav-link]');
const sections = document.querySelectorAll('[data-page]');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navMenu = document.getElementById('nav-menu');
const header = document.getElementById('header');

// Mobile menu toggle
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.add('show');
    document.body.style.overflow = 'hidden';
  });
}

if (navClose) {
  navClose.addEventListener('click', () => {
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (navMenu.classList.contains('show') && 
      !navMenu.contains(e.target) && 
      !navToggle.contains(e.target)) {
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  }
});

//-----------------------------------*\
// #PAGE NAVIGATION
//\*-----------------------------------*/

function showPage(pageId) {
  sections.forEach(section => {
    section.classList.remove('active');
  });
  
  const targetSection = document.querySelector(`[data-page="${pageId}"]`);
  if (targetSection) {
    targetSection.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Navigation active state
function updateActiveNav() {
  const scrollY = window.pageYOffset;
  
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 100;
    const sectionId = section.getAttribute('id');
    
    if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Smooth scroll for navigation links
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    const pageId = targetId.substring(1); // Remove the #
    
    // Show the target section
    showPage(pageId);
    
    // Update active nav link
    navLinks.forEach(navLink => {
      navLink.classList.remove('active');
    });
    link.classList.add('active');
    
    // Update URL hash
    window.history.pushState(null, null, targetId);
  });
});

// Handle hash navigation on load
window.addEventListener('load', () => {
  const hash = window.location.hash;
  if (hash) {
    const pageId = hash.substring(1);
    showPage(pageId);
    
    // Update nav links
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === hash) {
        link.classList.add('active');
      }
    });
  }
});

//-----------------------------------*\
// #HEADER SCROLL EFFECT
//\*-----------------------------------*/

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
  
  updateActiveNav();
  lastScroll = currentScroll;
});

//-----------------------------------*\
// #SCROLL ANIMATIONS
//\*-----------------------------------*/

const animateOnScroll = () => {
  const elements = document.querySelectorAll('[data-animate]');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  elements.forEach(element => {
    observer.observe(element);
  });
};

// Initialize scroll animations
window.addEventListener('load', animateOnScroll);

//-----------------------------------*\
// #SCROLL TO TOP BUTTON
//\*-----------------------------------*/

const scrollTopBtn = document.getElementById('scroll-top');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

//-----------------------------------*\
// #STAGGERED ANIMATIONS
//\*-----------------------------------*/

const staggerAnimation = (elements, delay = 100) => {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('animate');
    }, index * delay);
  });
};

// Apply staggered animation to timeline items
const timelineItems = document.querySelectorAll('.timeline__item');
if (timelineItems.length > 0) {
  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const visibleItems = Array.from(timelineItems).filter(item => {
          const rect = item.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
        staggerAnimation(visibleItems, 150);
        timelineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  // Observe the timeline container
  const timelineContainer = document.querySelector('.timeline');
  if (timelineContainer) {
    timelineObserver.observe(timelineContainer);
  }
}

// Apply staggered animation to publication cards
const publicationCards = document.querySelectorAll('.publication-card');
if (publicationCards.length > 0) {
  const publicationsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const visibleCards = Array.from(publicationCards).filter(card => {
          const rect = card.getBoundingClientRect();
          return rect.top < window.innerHeight && rect.bottom > 0;
        });
        staggerAnimation(visibleCards, 100);
        publicationsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const publicationsContainer = document.querySelector('.publications');
  if (publicationsContainer) {
    publicationsObserver.observe(publicationsContainer);
  }
}

//-----------------------------------*\
// #KEYBOARD NAVIGATION
//\*-----------------------------------*/

document.addEventListener('keydown', (e) => {
  // Close mobile menu on Escape
  if (e.key === 'Escape' && navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    document.body.style.overflow = '';
  }
});

//-----------------------------------*\
// #PERFORMANCE OPTIMIZATION
//\*-----------------------------------*/

// Throttle scroll events
let ticking = false;

function onScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

// Lazy load images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}


