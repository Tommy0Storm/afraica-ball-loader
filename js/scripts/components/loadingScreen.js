/**
 * Loading Screen Component
 * Handles the premium loading experience with 15-second particle ball
 */

import { initializeLoadingBall } from '../components/loading-ball.js';

export function initializeLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')

  if (!loadingScreen) return

  // Check if we should show the particle ball loading
  const showParticleBall = !sessionStorage.getItem('afraica-loaded');

  if (showParticleBall) {
    // Redirect to particle ball loading page
    window.location.href = './src/loading-page.html';
    return;
  }

  // Fallback: show standard loading (for subsequent visits)
  animateLoadingText()
  animateLoadingProgress()

  // Hide loading screen after shorter delay for returning visitors
  setTimeout(() => {
    hideLoadingScreen()
  }, 1500)
}

function animateLoadingText() {
  const words = document.querySelectorAll('.loading-word')

  words.forEach((word, index) => {
    word.style.opacity = '0'
    word.style.transform = 'translateY(20px)'

    setTimeout(() => {
      word.style.transition = 'all 0.6s ease'
      word.style.opacity = '1'
      word.style.transform = 'translateY(0)'
    }, index * 200)
  })
}

function animateLoadingProgress() {
  const progressBar = document.querySelector('.loading-bar')

  if (progressBar) {
    progressBar.style.width = '0%'
    progressBar.style.transition = 'width 1.2s ease-out'

    setTimeout(() => {
      progressBar.style.width = '100%'
    }, 300)
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen')

  if (loadingScreen) {
    loadingScreen.classList.add('hidden')

    // Remove from DOM after transition
    setTimeout(() => {
      loadingScreen.remove()
    }, 500)
  }
}

// Mark that the full loading experience has been shown
export function markLoadingComplete() {
  sessionStorage.setItem('afraica-loaded', 'true');
}