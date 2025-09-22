/**
 * Premium Loader Orchestration System
 * Ultra-sophisticated loading experience coordinator
 */

import { gsap } from 'gsap';
import { ParticlesBackground } from './particles-bg.js';
import { ThreeScene } from './three-scene.js';
import { EnhancedBall } from './enhanced-ball.js';

export class PremiumLoader {
  constructor() {
    this.isInitialized = false;
    this.loadingStartTime = null;
    this.loadingDuration = 15000; // 15 seconds
    this.currentPhase = 0;
    this.phases = [];

    // Component instances
    this.particlesBackground = null;
    this.threeScene = null;
    this.enhancedBall = null;

    // UI elements
    this.progressBar = null;
    this.messages = [];
    this.currentMessageIndex = 0;

    // Animation timelines
    this.masterTimeline = null;
    this.messageTimeline = null;

    // Performance monitoring
    this.performanceMetrics = {
      loadStart: 0,
      componentsReady: 0,
      firstFrame: 0,
      totalLoadTime: 0
    };
  }

  async initialize() {
    try {
      console.log('🚀 Initializing Premium Loading Experience...');
      this.performanceMetrics.loadStart = performance.now();

      // Initialize all components in parallel for maximum performance
      await this.initializeComponents();

      // Setup UI elements
      this.setupUIElements();

      // Create animation phases
      this.createAnimationPhases();

      // Start the premium loading sequence
      this.startLoadingSequence();

      this.isInitialized = true;
      this.performanceMetrics.componentsReady = performance.now();

      console.log('✨ Premium Loading Experience initialized');
      console.log(`📊 Initialization time: ${this.performanceMetrics.componentsReady - this.performanceMetrics.loadStart}ms`);

    } catch (error) {
      console.error('❌ Failed to initialize Premium Loader:', error);
      // Graceful fallback
      this.handleInitializationError(error);
    }
  }

  async initializeComponents() {
    const initPromises = [];

    // Initialize background particles
    try {
      this.particlesBackground = new ParticlesBackground('particles-canvas');
      initPromises.push(this.particlesBackground.initialize());
    } catch (error) {
      console.warn('⚠️ Particles background failed, continuing without it:', error);
    }

    // Initialize Three.js scene
    try {
      this.threeScene = new ThreeScene('three-canvas');
      initPromises.push(this.threeScene.initialize());
    } catch (error) {
      console.warn('⚠️ Three.js scene failed, continuing without it:', error);
    }

    // Initialize enhanced ball (critical component)
    try {
      this.enhancedBall = new EnhancedBall('ball-canvas');
      initPromises.push(this.enhancedBall.initialize());
    } catch (error) {
      console.error('❌ Enhanced ball failed to initialize:', error);
      throw error; // Ball is critical, fail if it doesn't work
    }

    // Wait for all components to initialize
    await Promise.allSettled(initPromises);
  }

  setupUIElements() {
    this.progressBar = document.getElementById('neural-progress-bar');
    this.messages = Array.from(document.querySelectorAll('.message'));
    this.skipButton = document.getElementById('skip-button');

    if (!this.progressBar) {
      console.warn('⚠️ Progress bar element not found');
    }

    if (this.messages.length === 0) {
      console.warn('⚠️ No message elements found');
    }

    // Setup skip button
    if (this.skipButton) {
      this.skipButton.addEventListener('click', () => {
        this.skipToMainSite();
      });
    }
  }

  createAnimationPhases() {
    this.phases = [
      {
        name: 'Emergence',
        duration: 3000,
        messageIndex: 0,
        actions: [
          () => this.animateEmergence(),
          () => this.fadeInComponents(),
          () => this.startProgressBar()
        ]
      },
      {
        name: 'Recognition',
        duration: 2500,
        messageIndex: 1,
        actions: [
          () => this.animateLogoBuilding(),
          () => this.intensifyParticles(),
          () => this.enhanceLighting()
        ]
      },
      {
        name: 'Intelligence',
        duration: 4000,
        messageIndex: 2,
        actions: [
          () => this.demonstrateIntelligence(),
          () => this.activateDataStreams(),
          () => this.showHologramEffects()
        ]
      },
      {
        name: 'Optimization',
        duration: 3500,
        messageIndex: 3,
        actions: [
          () => this.optimizeAnimations(),
          () => this.synchronizeElements(),
          () => this.buildToClimax()
        ]
      },
      {
        name: 'Transformation',
        duration: 2000,
        messageIndex: 4,
        actions: [
          () => this.finalTransformation(),
          () => this.prepareTransition(),
          () => this.completeLoading()
        ]
      }
    ];
  }

  startLoadingSequence() {
    this.loadingStartTime = Date.now();
    this.masterTimeline = gsap.timeline();

    // Create master timeline with all phases
    let currentTime = 0;

    this.phases.forEach((phase, index) => {
      this.masterTimeline.call(() => {
        console.log(`🎭 Phase ${index + 1}: ${phase.name}`);
        this.currentPhase = index;
        this.updateMessage(phase.messageIndex);
        phase.actions.forEach(action => action());
      }, [], currentTime / 1000);

      currentTime += phase.duration;
    });

    // Start message cycling
    this.startMessageCycling();

    // Monitor loading progress
    this.monitorProgress();
  }

  startMessageCycling() {
    this.messageTimeline = gsap.timeline({ repeat: -1 });

    this.messages.forEach((message, index) => {
      if (index === 0) return; // First message is already active

      this.messageTimeline
        .to(this.messages[this.currentMessageIndex], {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out"
        }, index * 3)
        .set(this.messages[this.currentMessageIndex], { zIndex: 1 })
        .set(message, { zIndex: 2 })
        .to(message, {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => {
            this.currentMessageIndex = index;
          }
        }, index * 3 + 0.4);
    });
  }

  updateMessage(messageIndex) {
    if (this.messages[messageIndex]) {
      this.messages.forEach(msg => msg.classList.remove('active'));
      this.messages[messageIndex].classList.add('active');
      this.currentMessageIndex = messageIndex;
    }
  }

  monitorProgress() {
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - this.loadingStartTime;
      const progress = Math.min(elapsed / this.loadingDuration, 1);

      // Update progress bar
      if (this.progressBar) {
        gsap.to(this.progressBar, {
          width: `${progress * 100}%`,
          duration: 0.5,
          ease: "power2.out"
        });
      }

      // Complete loading when exactly 15 seconds have passed
      if (elapsed >= this.loadingDuration) {
        clearInterval(progressInterval);
        this.transitionToMainSite();
      }
    }, 50); // More frequent updates for precision

    // Store interval reference for cleanup
    this.progressInterval = progressInterval;
  }

  // Phase Animation Methods
  animateEmergence() {
    // Fade in from black
    gsap.fromTo(document.getElementById('premium-loader'), {
      opacity: 0
    }, {
      opacity: 1,
      duration: 2,
      ease: "power2.out"
    });

    // Animate logo appearance
    const logo = document.querySelector('.logo-main');
    if (logo) {
      gsap.fromTo(logo, {
        scale: 0.8,
        opacity: 0,
        rotationY: -90
      }, {
        scale: 1,
        opacity: 1,
        rotationY: 0,
        duration: 2.5,
        ease: "back.out(1.7)"
      });
    }
  }

  fadeInComponents() {
    // Fade in particle background
    if (this.particlesBackground && this.particlesBackground.isReady()) {
      gsap.fromTo('#particles-canvas', {
        opacity: 0
      }, {
        opacity: 1,
        duration: 2,
        ease: "power2.out"
      });
    }

    // Fade in Three.js scene
    if (this.threeScene && this.threeScene.isReady()) {
      gsap.fromTo('#three-canvas', {
        opacity: 0
      }, {
        opacity: 0.7,
        duration: 2.5,
        ease: "power2.out"
      });
    }
  }

  startProgressBar() {
    if (this.progressBar) {
      gsap.fromTo(this.progressBar, {
        width: '0%'
      }, {
        width: '20%',
        duration: 2.5,
        ease: "power2.out"
      });
    }
  }

  animateLogoBuilding() {
    const aiElement = document.querySelector('.logo-ai');
    if (aiElement) {
      // Special animation for AI part
      gsap.to(aiElement, {
        textShadow: '0 0 40px rgba(200, 16, 46, 0.9)',
        duration: 1.5,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      });
    }
  }

  intensifyParticles() {
    if (this.particlesBackground && this.particlesBackground.isReady()) {
      // Increase particle activity
      const container = this.particlesBackground.getContainer();
      if (container && container.particles) {
        container.particles.array.forEach(particle => {
          particle.velocity.x *= 1.2;
          particle.velocity.y *= 1.2;
        });
      }
    }
  }

  enhanceLighting() {
    if (this.threeScene && this.threeScene.isReady()) {
      gsap.to(this.threeScene, {
        lightIntensity: 0.8,
        duration: 2,
        ease: "power2.out",
        onUpdate: () => {
          this.threeScene.setIntensity(this.threeScene.lightIntensity);
        }
      });
    }
  }

  demonstrateIntelligence() {
    // Show advanced ball behaviors
    if (this.enhancedBall && this.enhancedBall.isReady()) {
      // Increase electromagnetic field activity
      gsap.to(this.enhancedBall, {
        duration: 3,
        ease: "power2.inOut",
        onUpdate: () => {
          // Enhanced effects happen automatically in the ball
        }
      });
    }
  }

  activateDataStreams() {
    // Data streams are handled by the enhanced ball
    console.log('🌊 Data streams activated');
  }

  showHologramEffects() {
    // Hologram effects are handled by the enhanced ball
    console.log('🔮 Hologram effects activated');
  }

  optimizeAnimations() {
    // Synchronize all animations
    if (this.enhancedBall) {
      gsap.to(this.enhancedBall, {
        rigidity: 0.4,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }

  synchronizeElements() {
    // Synchronize all components
    const elements = ['#particles-canvas', '#three-canvas', '#ball-canvas'];

    elements.forEach((selector, index) => {
      gsap.to(selector, {
        filter: 'brightness(1.1) contrast(1.05)',
        duration: 1,
        delay: index * 0.2,
        ease: "power2.out"
      });
    });
  }

  buildToClimax() {
    // Build intensity to maximum
    if (this.threeScene) {
      this.threeScene.setIntensity(1.0);
    }
  }

  finalTransformation() {
    // Final animation before transition
    const logo = document.querySelector('.logo-main');
    if (logo) {
      gsap.to(logo, {
        scale: 1.05,
        duration: 1,
        ease: "power2.inOut",
        yoyo: true,
        repeat: 1
      });
    }
  }

  prepareTransition() {
    // Prepare for smooth transition
    console.log('🎬 Preparing transition to main site');
  }

  completeLoading() {
    // Mark loading as complete
    sessionStorage.setItem('afraica-loaded', 'true');
    this.performanceMetrics.totalLoadTime = performance.now() - this.performanceMetrics.loadStart;

    console.log('✅ Premium loading experience completed');
    console.log(`📊 Total loading time: ${this.performanceMetrics.totalLoadTime}ms`);
  }

  skipToMainSite() {
    console.log('⏭️ Skipping to main site...');

    // Stop all animations immediately
    if (this.masterTimeline) this.masterTimeline.kill();
    if (this.messageTimeline) this.messageTimeline.kill();
    if (this.progressInterval) clearInterval(this.progressInterval);

    // Quick transition
    this.transitionToMainSite(true);
  }

  transitionToMainSite(isSkipped = false) {
    const loader = document.getElementById('premium-loader');

    // Complete loading marker
    this.completeLoading();

    if (loader) {
      const duration = isSkipped ? 0.6 : 1.2;

      gsap.to(loader, {
        opacity: 0,
        scale: isSkipped ? 1.05 : 1.1,
        duration: duration,
        ease: "power2.inOut",
        onComplete: () => {
          window.location.href = '../index.html';
        }
      });
    } else {
      // Fallback
      window.location.href = '../index.html';
    }
  }

  handleInitializationError(error) {
    console.error('🚨 Premium loader initialization failed:', error);

    // Show simple fallback loading
    const loader = document.getElementById('premium-loader');
    if (loader) {
      loader.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; color: white; font-family: 'Google Sans', sans-serif;">
          <h1 style="font-size: 4rem; margin-bottom: 2rem;">afr<span style="color: #C8102E;">AI</span>ca</h1>
          <p style="font-size: 1.2rem; opacity: 0.8;">Loading...</p>
        </div>
      `;
    }

    // Still redirect after 15 seconds
    setTimeout(() => {
      this.transitionToMainSite();
    }, 15000);
  }

  // Control methods
  pause() {
    if (this.masterTimeline) this.masterTimeline.pause();
    if (this.messageTimeline) this.messageTimeline.pause();
    if (this.particlesBackground) this.particlesBackground.pause();
    if (this.threeScene) this.threeScene.pause();
    if (this.enhancedBall) this.enhancedBall.pause();
  }

  resume() {
    if (this.masterTimeline) this.masterTimeline.resume();
    if (this.messageTimeline) this.messageTimeline.resume();
    if (this.particlesBackground) this.particlesBackground.resume();
    if (this.threeScene) this.threeScene.resume();
    if (this.enhancedBall) this.enhancedBall.resume();
  }

  // Cleanup
  cleanup() {
    console.log('🧹 Cleaning up Premium Loader...');

    // Kill timelines and intervals
    if (this.masterTimeline) this.masterTimeline.kill();
    if (this.messageTimeline) this.messageTimeline.kill();
    if (this.progressInterval) clearInterval(this.progressInterval);

    // Cleanup components
    if (this.particlesBackground) this.particlesBackground.destroy();
    if (this.threeScene) this.threeScene.destroy();
    if (this.enhancedBall) this.enhancedBall.destroy();

    // Remove event listeners
    if (this.skipButton) {
      this.skipButton.removeEventListener('click', this.skipToMainSite);
    }

    // Clear references
    this.particlesBackground = null;
    this.threeScene = null;
    this.enhancedBall = null;
    this.progressBar = null;
    this.skipButton = null;
    this.messages = [];

    this.isInitialized = false;
  }

  // Get performance metrics
  getPerformanceMetrics() {
    return { ...this.performanceMetrics };
  }

  // Check if ready
  isReady() {
    return this.isInitialized;
  }
}