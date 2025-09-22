/**
 * Scroll Animations
 * Handles intersection observer based animations
 */

export function initializeAnimations() {
  // Initialize scroll reveal animations
  initializeScrollReveal()
  
  // Initialize parallax effects
  initializeParallax()
}

function initializeScrollReveal() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed')
        
        // For staggered animations
        if (entry.target.hasAttribute('data-stagger')) {
          const children = entry.target.children
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('revealed')
            }, index * 100)
          })
        }
      }
    })
  }, observerOptions)
  
  // Observe elements with animation classes
  const animatedElements = document.querySelectorAll(`
    .animate-fade-up,
    .animate-scale,
    .animate-slide-left,
    .animate-slide-right,
    .scroll-reveal
  `)
  
  animatedElements.forEach(el => {
    observer.observe(el)
  })
}

function initializeParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]')
  
  if (parallaxElements.length === 0) return
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset
    const rate = scrolled * -0.5
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.parallax || 0.5
      const yPos = -(scrolled * speed)
      element.style.transform = `translateY(${yPos}px)`
    })
  })
}

/**
 * Animate elements when they come into view
 */
export function animateOnScroll(elements, animationClass = 'animate-fade-up') {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(animationClass)
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  })
  
  elements.forEach(element => {
    observer.observe(element)
  })
}