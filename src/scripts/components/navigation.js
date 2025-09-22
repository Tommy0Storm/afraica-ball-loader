/**
 * Navigation Component
 * Handles navigation interactions and mobile menu
 */

export function initializeNavigation() {
  const header = document.getElementById('header')
  const navToggle = document.getElementById('nav-toggle')
  const navMobile = document.getElementById('nav-mobile')
  
  // Handle scroll effects on header
  handleScrollEffects(header)
  
  // Handle mobile menu toggle
  if (navToggle && navMobile) {
    handleMobileMenu(navToggle, navMobile)
  }
  
  // Handle active navigation states
  handleActiveNavigation()
}

function handleScrollEffects(header) {
  let lastScrollY = window.scrollY
  
  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY
    
    // Add/remove scrolled class
    if (currentScrollY > 100) {
      header.classList.add('header--scrolled')
    } else {
      header.classList.remove('header--scrolled')
    }
    
    // Hide/show header on scroll direction
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      header.classList.add('header--hidden')
    } else {
      header.classList.remove('header--hidden')
    }
    
    lastScrollY = currentScrollY
  })
}

function handleMobileMenu(navToggle, navMobile) {
  let isOpen = false
  
  navToggle.addEventListener('click', () => {
    isOpen = !isOpen
    
    navToggle.classList.toggle('nav__toggle--active', isOpen)
    navMobile.classList.toggle('nav__mobile--active', isOpen)
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : ''
  })
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (isOpen && !navToggle.contains(e.target) && !navMobile.contains(e.target)) {
      isOpen = false
      navToggle.classList.remove('nav__toggle--active')
      navMobile.classList.remove('nav__mobile--active')
      document.body.style.overflow = ''
    }
  })
  
  // Close menu when clicking on links
  const mobileLinks = navMobile.querySelectorAll('.nav__mobile-link')
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      isOpen = false
      navToggle.classList.remove('nav__toggle--active')
      navMobile.classList.remove('nav__mobile--active')
      document.body.style.overflow = ''
    })
  })
}

function handleActiveNavigation() {
  const navLinks = document.querySelectorAll('.nav__link, .nav__mobile-link')
  const sections = document.querySelectorAll('section[id]')
  
  window.addEventListener('scroll', () => {
    let current = ''
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop
      const sectionHeight = section.clientHeight
      
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id')
      }
    })
    
    navLinks.forEach(link => {
      link.classList.remove('nav__link--active')
      
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active')
      }
    })
  })
}