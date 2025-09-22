/**
 * afrAIca Premium Website - Main JavaScript Entry Point
 * Enhanced with Nuclear Loading Experience - The Digital Awakening of Africa
 */

// Import utilities and components
import { initializeAnimations } from './animations/scrollAnimations.js'
import { initializeNavigation } from './components/navigation.js'
import { initializeInteractiveComponents, initializeMagneticButtons } from './components/interactive.js'
import { initializeBackgroundEffects, initializeCursorEffects } from './animations/backgroundEffects.js'
// Removed redBlinkerBackground import - using CSS-only red animation now
// No loader - direct load to main content
// Temporarily disable nuclear loading to prevent errors
// import './nuclearLoading.js';

// Optional: Enhanced continent tracing capabilities (disabled for now)
/*
let continentTracingEnabled = false
try {
  const { EnhancedNuclearLoading } = await import('./continentTracerAI.js')
  window.enhancedNuclearLoading = new EnhancedNuclearLoading()
  continentTracingEnabled = true
  console.log('🔍 Continent tracing module loaded')
} catch (error) {
  console.log('ℹ️  Continent tracing not available (optional feature)')
}
*/

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 afrAIca Premium Website Loading...')
  console.log('🌍 Initializing Continent Tracing Loader...')
  
  // Debug: Check if loading screen element exists
  const loadingElement = document.getElementById('loading-screen');
  console.log('Loading screen element:', loadingElement);
  
  // No loader - start main app directly to see content immediately
  console.log('🚀 Starting main app directly - no loading screen...');
  initializeMainApp();
  
  // Initialize CSS-only red background animation via the existing iframe
  console.log('🔴 Using CSS-only red background animation');
  
  // Hard-disable any legacy hero DOM particles if present
  try {
    const particlesContainer = document.getElementById('particles')
    if (particlesContainer) {
      particlesContainer.innerHTML = ''
      particlesContainer.style.display = 'none'
    }
    // Also hide any loader sub-particle containers if present (legacy markup)
    document.querySelectorAll('.particle-systems, .ambient-particles, .energy-particles, .neural-particles').forEach(el => {
      el.innerHTML = ''
      el.style.display = 'none'
    })
  } catch (error) {
    // Silently handle any DOM manipulation errors
  }
})

/**
 * Main application initialization - called after continent tracing completes
 */
function initializeMainApp() {
  console.log('🎯 Main Application Starting...')
  
  // Initialize all application components
  initializeAllComponents()
}/**
 * Initialize all application components
 */
function initializeAllComponents() {
  // Initialize navigation
  initializeNavigation()
  
  // Initialize scroll animations
  initializeAnimations()
  
  // Hero DOM particles disabled to keep background clean and remove white particles
  // (Red blinker background remains the standard animation site-wide.)
  
  // Initialize background effects
  initializeBackgroundEffects()
  
  // Initialize custom cursor (desktop only)
  if (window.innerWidth > 768) {
    initializeCursorEffects()
  }
  
  // Initialize interactive components
  initializeInteractiveComponents()
  
  // Initialize magnetic button effects
  initializeMagneticButtons()

  // Initialize About modal
  initializeAboutModal()

  // Initialize smooth scrolling
  initializeSmoothScrolling()

  console.log('✅ afrAIca Premium Website Fully Loaded!')
}

/**
 * Initialize smooth scrolling for navigation links
 */
function initializeSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach(link => {
    // Skip About links as they trigger modal instead
    if (link.id === 'about-link' || link.id === 'about-link-mobile') {
      return;
    }

    link.addEventListener('click', (e) => {
      e.preventDefault()

      const targetId = link.getAttribute('href').slice(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector('.header').offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        })
      }
    })
  })
}

/**
 * Utility function to check if element is in viewport
 */
export function isInViewport(element) {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= windowHeight &&
    rect.right <= windowWidth
  )
}

/**
 * Utility function for throttling function calls
 */
export function throttle(func, limit) {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Initialize About Modal Functionality
 */
function initializeAboutModal() {
  console.log('🔍 Initializing About Modal...');

  const modal = document.getElementById('about-modal');
  const aboutLink = document.getElementById('about-link');
  const aboutLinkMobile = document.getElementById('about-link-mobile');
  const closeBtn = document.getElementById('about-modal-close');
  const backdrop = modal?.querySelector('.modal__backdrop');
  const modalContactBtn = document.getElementById('modal-contact-btn');

  console.log('Modal elements found:', {
    modal: !!modal,
    aboutLink: !!aboutLink,
    aboutLinkMobile: !!aboutLinkMobile,
    closeBtn: !!closeBtn
  });

  if (!modal) {
    console.error('❌ About modal not found!');
    return;
  }

  // Open modal
  function openModal(e) {
    console.log('📖 Opening About modal...');
    e.preventDefault();
    e.stopPropagation();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    console.log('✖️ Closing About modal...');
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Event listeners
  if (aboutLink) {
    aboutLink.addEventListener('click', openModal);
    console.log('✅ Desktop About link listener added');
  }

  if (aboutLinkMobile) {
    aboutLinkMobile.addEventListener('click', openModal);
    console.log('✅ Mobile About link listener added');
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
    console.log('✅ Close button listener added');
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeModal);
    console.log('✅ Backdrop listener added');
  }

  // Handle modal contact button
  modalContactBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
    // Scroll to contact section after modal closes
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 400);
  });

  // Close modal with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  console.log('✅ About Modal initialized successfully');
}
