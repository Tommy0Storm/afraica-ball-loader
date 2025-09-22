/**
 * Background Effects
 * Creates sophisticated background animations and effects
 */

export function initializeBackgroundEffects() {
  initializeGradientShift()
  initializeFloatingElements()
  initializeScrollBasedEffects()
}

/**
 * Initialize gradient color shifting
 */
function initializeGradientShift() {
  const hero = document.querySelector('.hero')
  if (!hero) return
  
  let hue = 0
  
  setInterval(() => {
    hue = (hue + 0.5) % 360
    const color1 = `hsl(${hue}, 70%, 30%)`
    const color2 = `hsl(${(hue + 60) % 360}, 50%, 20%)`
    
    hero.style.background = `
      radial-gradient(circle at 30% 40%, ${color1}15 0%, transparent 45%),
      radial-gradient(circle at 75% 80%, ${color2}10 0%, transparent 50%),
      var(--color-dark)
    `
  }, 100)
}

/**
 * Initialize floating elements
 */
function initializeFloatingElements() {
  const floatingElements = document.querySelectorAll('.animate-float')
  
  floatingElements.forEach((element, index) => {
    element.style.animationDelay = `${index * 0.5}s`
    element.style.animationDuration = `${6 + Math.random() * 4}s`
  })
}

/**
 * Initialize scroll-based effects
 */
function initializeScrollBasedEffects() {
  const sections = document.querySelectorAll('.section')
  
  window.addEventListener('scroll', () => {
    const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
    
    // Update background gradient based on scroll
    document.documentElement.style.setProperty(
      '--scroll-gradient', 
      `linear-gradient(180deg, hsl(${scrollPercent * 360}, 20%, 5%) 0%, var(--color-dark) 100%)`
    )
    
    // Parallax effect for sections
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect()
      const inView = rect.top < window.innerHeight && rect.bottom > 0
      
      if (inView) {
        const scrollOffset = (window.innerHeight - rect.top) / window.innerHeight
        const transform = `translateY(${scrollOffset * 20}px)`
        
        const backgroundElements = section.querySelectorAll('.section::before')
        backgroundElements.forEach(el => {
          el.style.transform = transform
        })
      }
    })
  })
}

/**
 * Initialize cursor effects
 */
export function initializeCursorEffects() {
  const cursor = document.createElement('div')
  cursor.className = 'custom-cursor'
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    background: var(--color-cherry);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    mix-blend-mode: difference;
    transition: all 0.1s ease;
    opacity: 0;
  `
  
  document.body.appendChild(cursor)
  
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX - 10 + 'px'
    cursor.style.top = e.clientY - 10 + 'px'
    cursor.style.opacity = '0.7'
  })
  
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0'
  })
  
  // Enhance cursor on interactive elements
  const interactiveElements = document.querySelectorAll('a, button, .card, .btn')
  
  interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)'
      cursor.style.background = 'var(--color-cherry-400)'
    })
    
    element.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)'
      cursor.style.background = 'var(--color-cherry)'
    })
  })
}