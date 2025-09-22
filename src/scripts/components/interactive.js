/**
 * Interactive Components
 * Handles premium interactive features like progress bars, counters, etc.
 */

export function initializeInteractiveComponents() {
  initializeProgressBars()
  initializeCounters()
  initializeCardHovers()
  initializeTiltEffects()
}

/**
 * Initialize animated progress bars
 */
function initializeProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar__fill')
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.style.width || '0%'
        entry.target.style.width = '0%'
        
        setTimeout(() => {
          entry.target.style.width = targetWidth
        }, 200)
        
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  
  progressBars.forEach(bar => observer.observe(bar))
}

/**
 * Initialize animated counters
 */
function initializeCounters() {
  const counters = document.querySelectorAll('[data-counter]')
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.5 })
  
  counters.forEach(counter => observer.observe(counter))
}

function animateCounter(element) {
  const target = parseInt(element.dataset.counter)
  const duration = 2000
  const increment = target / (duration / 16)
  let current = 0
  
  const timer = setInterval(() => {
    current += increment
    element.textContent = Math.floor(current)
    
    if (current >= target) {
      element.textContent = target
      clearInterval(timer)
    }
  }, 16)
}

/**
 * Initialize enhanced card hover effects
 */
function initializeCardHovers() {
  const cards = document.querySelectorAll('.card--interactive, .logo-card')
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-12px) scale(1.02)'
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)'
    })
  })
}

/**
 * Initialize 3D tilt effects for premium cards
 */
function initializeTiltEffects() {
  const tiltCards = document.querySelectorAll('.card--featured')
  
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = (y - centerY) / 10
      const rotateY = (centerX - x) / 10
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
    })
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
    })
  })
}

/**
 * Initialize typing animation for text elements
 */
export function initializeTypingAnimation(element, text, speed = 50) {
  let i = 0
  element.innerHTML = ''
  
  function typeWriter() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i)
      i++
      setTimeout(typeWriter, speed)
    }
  }
  
  typeWriter()
}

/**
 * Initialize magnetic button effects
 */
export function initializeMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary')
  
  buttons.forEach(button => {
    button.addEventListener('mousemove', (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translate(0px, 0px)'
    })
  })
}