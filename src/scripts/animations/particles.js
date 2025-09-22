/**
 * Particle System for Hero Background
 * Creates animated particles for premium visual effect
 */

export function initializeParticles() {
  const particlesContainer = document.getElementById('particles')
  
  if (!particlesContainer) return
  
  const particleCount = window.innerWidth > 1200 ? 60 : 40
  const particles = []
  
  // Create particles with different types
  for (let i = 0; i < particleCount; i++) {
    createParticle(particlesContainer, particles, i)
  }
  
  // Animate particles
  animateParticles(particles)
  
  // Add mouse interaction
  addMouseInteraction(particles)
}

function createParticle(container, particles, index) {
  const particle = document.createElement('div')
  particle.className = 'particle'
  
  // Different particle types
  const type = index % 3
  const size = type === 0 ? Math.random() * 3 + 1 : type === 1 ? Math.random() * 2 + 2 : Math.random() * 4 + 1
  const x = Math.random() * window.innerWidth
  const y = Math.random() * window.innerHeight
  const opacity = Math.random() * 0.4 + 0.1
  
  // Different colors based on type
  const colors = ['var(--color-cherry)', 'rgba(255,255,255,0.3)', 'var(--color-cherry-400)']
  const color = colors[type]
  
  // Style the particle
  particle.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    background: ${color};
    border-radius: 50%;
    opacity: ${opacity};
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    transition: all 0.3s ease;
  `
  
  container.appendChild(particle)
  
  particles.push({
    element: particle,
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    size: size,
    opacity: opacity,
    originalOpacity: opacity,
    type: type
  })
}

function animateParticles(particles) {
  function animate() {
    particles.forEach(particle => {
      // Update position
      particle.x += particle.vx
      particle.y += particle.vy
      
      // Bounce off edges
      if (particle.x <= 0 || particle.x >= window.innerWidth) {
        particle.vx *= -1
      }
      if (particle.y <= 0 || particle.y >= window.innerHeight) {
        particle.vy *= -1
      }
      
      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(window.innerWidth, particle.x))
      particle.y = Math.max(0, Math.min(window.innerHeight, particle.y))
      
      // Update element position
      particle.element.style.left = particle.x + 'px'
      particle.element.style.top = particle.y + 'px'
    })
    
    requestAnimationFrame(animate)
  }
  
  animate()
}

function addMouseInteraction(particles) {
  let mouseX = 0
  let mouseY = 0
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    
    particles.forEach(particle => {
      const dx = mouseX - particle.x
      const dy = mouseY - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < 100) {
        const force = (100 - distance) / 100
        particle.element.style.opacity = Math.min(particle.originalOpacity + force * 0.5, 1)
        particle.element.style.transform = `scale(${1 + force * 0.5})`
      } else {
        particle.element.style.opacity = particle.originalOpacity
        particle.element.style.transform = 'scale(1)'
      }
    })
  })
}

// Handle window resize
window.addEventListener('resize', () => {
  const particlesContainer = document.getElementById('particles')
  if (particlesContainer && window.innerWidth <= 768) {
    particlesContainer.innerHTML = '' // Remove particles on mobile
  }
})