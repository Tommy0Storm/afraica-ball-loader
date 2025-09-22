/**
 * Enhanced Premium Stress Ball
 * Ultra-sophisticated particle ball with physics, breathing, and electromagnetic effects
 */

import { gsap } from 'gsap';

export class EnhancedBall {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrameId = null;
    this.isInitialized = false;

    // Enhanced physics parameters
    this.PARTICLE_COUNT = 15000;
    this.PARTICLE_COLORS = [
      { r: 255, g: 255, b: 255 }, // White
      { r: 222, g: 49, b: 99 },   // Cherry Red (#DE3163)
      { r: 75, g: 85, b: 99 }     // Slate Gray
    ];
    this.MOUSE_RADIUS = 120;
    this.REPULSION_STRENGTH = 6;
    this.rigidity = 0.3;
    this.PARTICLE_FRICTION = 0.94;

    // Premium effects
    this.breathingScale = 1.0;
    this.targetBreathingScale = 1.0;
    this.electromagneticField = [];
    this.hologramIntensity = 0.0;
    this.dataStreams = [];

    // Mouse and interaction
    this.mouse = { x: null, y: null };
    this.isDragging = false;
    this.lastMouseX = null;
    this.lastMouseY = null;

    // Rotation and positioning
    this.rotationX = 0;
    this.rotationY = 0;
    this.targetRotationX = 0;
    this.targetRotationY = 0;

    // Premium background effects
    this.stars = [];
    this.shootingStars = [];
    this.parallaxX = 0;
    this.parallaxY = 0;
    this.targetParallaxX = 0;
    this.targetParallaxY = 0;
    this.PARALLAX_STRENGTH = 0.015;

    // Performance optimization
    this.time = 0;
  }

  async initialize() {
    try {
      this.canvas = document.getElementById(this.canvasId);
      if (!this.canvas) {
        throw new Error(`Canvas element #${this.canvasId} not found`);
      }

      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) {
        throw new Error("Could not get canvas context");
      }

      // Setup canvas
      this.setupCanvas();

      // Create enhanced particle system
      this.createEnhancedParticles();

      // Create premium effects
      this.createElectromagneticField();
      this.createDataStreams();
      this.createPremiumStars();

      // Setup interactions
      this.setupInteractions();

      // Start premium animation loop
      this.startPremiumAnimation();

      // Initialize breathing animation
      this.initBreathingEffect();

      this.isInitialized = true;
      console.log('✨ Enhanced Premium Ball initialized');

    } catch (error) {
      console.error('❌ Failed to initialize enhanced ball:', error);
      throw error;
    }
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Premium canvas settings
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
  }

  createEnhancedParticles() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    // Create text texture for afrAIca
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    const FONT_SIZE = 150;
    textCanvas.width = 1024;
    textCanvas.height = 256;

    textCtx.font = `bold ${FONT_SIZE}px 'Google Sans', Arial, sans-serif`;
    textCtx.textAlign = 'center';
    textCtx.textBaseline = 'middle';

    const metricsAfr = textCtx.measureText('afr');
    const metricsAI = textCtx.measureText('AI');
    const totalWidth = metricsAfr.width + metricsAI.width + textCtx.measureText('ca').width;
    const startX = (textCanvas.width - totalWidth) / 2;

    textCtx.fillStyle = 'blue';
    textCtx.fillText('afr', startX + metricsAfr.width / 2, 128);
    textCtx.fillStyle = 'red';
    textCtx.fillText('AI', startX + metricsAfr.width + metricsAI.width / 2, 128);
    textCtx.fillStyle = 'green';
    textCtx.fillText('ca', startX + metricsAfr.width + metricsAI.width + textCtx.measureText('ca').width / 2, 128);

    const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);

    this.particles = [];
    const sphereRadius = 1;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Text mapping rotation
    const textMapRotY = -Math.PI / 2;
    const cosTextMapY = Math.cos(textMapRotY);
    const sinTextMapY = Math.sin(textMapRotY);

    // Final positioning - facing front, right-side up
    const finalRotX = Math.PI;
    const finalRotY = Math.PI;
    const cosFinalX = Math.cos(finalRotX);
    const sinFinalX = Math.sin(finalRotX);
    const cosFinalY = Math.cos(finalRotY);
    const sinFinalY = Math.sin(finalRotY);

    for (let i = 0; i < this.PARTICLE_COUNT; i++) {
      const y = 1 - (i / (this.PARTICLE_COUNT - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Determine particle color from text mapping
      const textMapX = x * cosTextMapY - z * sinTextMapY;
      const textMapZ = x * sinTextMapY + z * cosTextMapY;
      const textMapY = y;

      const particleLongitude = Math.atan2(textMapZ, textMapX);
      const particleLatitude = Math.acos(textMapY);
      let isTextParticle = false;
      let particleColor;
      const textBandHeight = 0.4;
      const textBandStartLat = Math.PI * (1 - textBandHeight) / 2;
      const textBandEndLat = Math.PI * (1 + textBandHeight) / 2;

      if (particleLatitude > textBandStartLat && particleLatitude < textBandEndLat) {
        const u = (particleLongitude + Math.PI) / (2 * Math.PI);
        const v = (particleLatitude - textBandStartLat) / (textBandEndLat - textBandStartLat);
        const textX = Math.floor(u * textCanvas.width);
        const textY = Math.floor(v * textCanvas.height);
        const pixelIndex = (textY * textCanvas.width + textX) * 4;

        if (imageData.data[pixelIndex + 3] > 128) {
          isTextParticle = true;
          particleColor = imageData.data[pixelIndex] > 128 ? this.PARTICLE_COLORS[1] : this.PARTICLE_COLORS[0];
        }
      }

      if (!isTextParticle) {
        particleColor = Math.random() < 0.15 ? this.PARTICLE_COLORS[1] : this.PARTICLE_COLORS[2];
      }

      // Apply final rotations
      const x1 = x * cosFinalY - z * sinFinalY;
      const z1 = x * sinFinalY + z * cosFinalY;
      const y2 = y * cosFinalX - z1 * sinFinalX;
      const z2 = y * sinFinalX + z1 * cosFinalX;
      const x2 = x1;

      const baseX3d = x2 * sphereRadius;
      const baseY3d = y2 * sphereRadius;
      const baseZ3d = z2 * sphereRadius;

      // Enhanced scale for premium positioning
      const scale = Math.min(width, height) * 0.22; // Slightly larger for premium feel
      const ballCenterY = height / 2 + 48; // Positioned lower

      this.particles.push({
        x: (baseX3d * scale) + width / 2,
        y: (baseY3d * scale) + ballCenterY,
        baseX: (baseX3d * scale) + width / 2,
        baseY: (baseY3d * scale) + ballCenterY,
        baseX3d,
        baseY3d,
        baseZ3d,
        vx: 0,
        vy: 0,
        z: baseZ3d,
        radius: 1,
        color: particleColor,
        density: Math.random() * 20 + 10,
        // Enhanced properties
        originalRadius: 1,
        glowIntensity: Math.random() * 0.5 + 0.5,
        pulseOffset: Math.random() * Math.PI * 2,
        trailHistory: [],
        isTextParticle: isTextParticle
      });
    }
  }

  createElectromagneticField() {
    this.electromagneticField = [];

    for (let i = 0; i < 24; i++) {
      const angle = (i / 24) * Math.PI * 2;
      const radius = 180 + Math.sin(i * 0.5) * 20;

      this.electromagneticField.push({
        angle: angle,
        radius: radius,
        baseRadius: radius,
        intensity: 0.3 + Math.random() * 0.4,
        speed: 0.01 + Math.random() * 0.02,
        color: Math.random() < 0.3 ? '#C8102E' : '#4FAFFF'
      });
    }
  }

  createDataStreams() {
    this.dataStreams = [];

    for (let i = 0; i < 8; i++) {
      this.dataStreams.push({
        particles: [],
        color: i % 2 === 0 ? '#C8102E' : '#4FAFFF',
        speed: 2 + Math.random() * 3,
        lastSpawn: 0
      });
    }
  }

  createPremiumStars() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    this.stars = [];
    for (let i = 0; i < 150; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        vx: Math.random() * 0.2 - 0.1,
        vy: Math.random() * 0.2 - 0.1,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01
      });
    }
  }

  initBreathingEffect() {
    // GSAP breathing animation
    gsap.to(this, {
      targetBreathingScale: 1.04,
      duration: 3,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Hologram effect
    gsap.to(this, {
      hologramIntensity: 1.0,
      duration: 4,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  startPremiumAnimation() {
    const animate = () => {
      this.time += 0.016;

      const dpr = window.devicePixelRatio || 1;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      const canvasWidth = this.canvas.width / dpr;
      const canvasHeight = this.canvas.height / dpr;

      // Draw premium background effects
      this.drawPremiumStars(canvasWidth, canvasHeight);
      this.drawElectromagneticField(canvasWidth, canvasHeight);
      this.drawDataStreams(canvasWidth, canvasHeight);

      // Update breathing effect
      this.breathingScale += (this.targetBreathingScale - this.breathingScale) * 0.02;

      // Update rotations
      this.rotationY += (this.targetRotationY - this.rotationY) * 0.05;
      this.rotationX += (this.targetRotationX - this.targetRotationX) * 0.05;

      if (!this.isDragging) {
        this.targetRotationY *= 0.95;
        this.targetRotationX *= 0.95;
      }

      // Update particles with enhanced effects
      this.updateEnhancedParticles(canvasWidth, canvasHeight);

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  drawPremiumStars(width, height) {
    this.ctx.save();

    this.parallaxX += (this.targetParallaxX - this.parallaxX) * 0.05;
    this.parallaxY += (this.targetParallaxY - this.parallaxY) * 0.05;
    this.ctx.translate(this.parallaxX, this.parallaxY);

    this.stars.forEach(star => {
      star.x += star.vx;
      star.y += star.vy;

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      // Twinkling effect
      const twinkle = Math.sin(this.time * star.twinkleSpeed + star.x * 0.01) * 0.3 + 0.7;

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * twinkle * 0.6})`;
      this.ctx.fill();
    });

    this.ctx.restore();
  }

  drawElectromagneticField(width, height) {
    const centerX = width / 2;
    const centerY = height / 2 + 48;

    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    this.electromagneticField.forEach((field, index) => {
      field.angle += field.speed;
      field.radius = field.baseRadius + Math.sin(this.time * 2 + index) * 10;

      const x = centerX + Math.cos(field.angle) * field.radius * this.breathingScale;
      const y = centerY + Math.sin(field.angle) * field.radius * this.breathingScale;

      // Field lines
      this.ctx.beginPath();
      this.ctx.moveTo(centerX, centerY);
      this.ctx.lineTo(x, y);
      this.ctx.strokeStyle = `${field.color}${Math.floor(field.intensity * 100).toString(16).padStart(2, '0')}`;
      this.ctx.lineWidth = 0.5;
      this.ctx.stroke();

      // Field nodes
      this.ctx.beginPath();
      this.ctx.arc(x, y, 2, 0, Math.PI * 2);
      this.ctx.fillStyle = field.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = field.color;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    });

    this.ctx.restore();
  }

  drawDataStreams(width, height) {
    this.dataStreams.forEach((stream, streamIndex) => {
      // Spawn new data particles
      if (this.time - stream.lastSpawn > 0.5) {
        const angle = (streamIndex / this.dataStreams.length) * Math.PI * 2;
        const startRadius = 250;
        const centerX = width / 2;
        const centerY = height / 2 + 48;

        stream.particles.push({
          x: centerX + Math.cos(angle) * startRadius,
          y: centerY + Math.sin(angle) * startRadius,
          targetX: centerX,
          targetY: centerY,
          life: 1.0,
          size: Math.random() * 3 + 1
        });

        stream.lastSpawn = this.time;
      }

      // Update and draw data particles
      this.ctx.save();
      stream.particles.forEach((particle, index) => {
        particle.x += (particle.targetX - particle.x) * 0.05;
        particle.y += (particle.targetY - particle.y) * 0.05;
        particle.life -= 0.02;

        if (particle.life <= 0) {
          stream.particles.splice(index, 1);
          return;
        }

        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${stream.color}${Math.floor(particle.life * 255).toString(16).padStart(2, '0')}`;
        this.ctx.fill();
      });
      this.ctx.restore();
    });
  }

  updateEnhancedParticles(canvasWidth, canvasHeight) {
    const scale = Math.min(canvasWidth, canvasHeight) * 0.22 * this.breathingScale;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2 + 48;
    const cosX = Math.cos(this.rotationX);
    const sinX = Math.sin(this.rotationX);
    const cosY = Math.cos(this.rotationY);
    const sinY = Math.sin(this.rotationY);

    this.particles.sort((a, b) => a.z - b.z);

    this.particles.forEach((p, index) => {
      // 3D rotation
      let x1 = p.baseX3d * cosY - p.baseZ3d * sinY;
      let z1 = p.baseX3d * sinY + p.baseZ3d * cosY;
      let y2 = p.baseY3d * cosX - z1 * sinX;
      let z2 = p.baseY3d * sinX + z1 * cosX;

      p.z = z2;
      p.baseX = x1 * scale + centerX;
      p.baseY = y2 * scale + centerY;

      // Enhanced physics with breathing
      if (this.rigidity >= 1.0) {
        p.x = p.baseX;
        p.y = p.baseY;
        p.vx = 0;
        p.vy = 0;
      } else {
        let dx = (this.mouse.x ?? -9999) - p.x;
        let dy = (this.mouse.y ?? -9999) - p.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.MOUSE_RADIUS) {
          const force = (this.MOUSE_RADIUS - distance) / this.MOUSE_RADIUS;
          p.vx -= (dx / distance) * force * this.REPULSION_STRENGTH * p.density;
          p.vy -= (dy / distance) * force * this.REPULSION_STRENGTH * p.density;
        } else if (this.rigidity > 0) {
          p.vx += (p.baseX - p.x) * (this.rigidity * 0.4);
          p.vy += (p.baseY - p.y) * (this.rigidity * 0.4);
        }

        if (this.rigidity > 0) {
          p.vx *= this.PARTICLE_FRICTION;
          p.vy *= this.PARTICLE_FRICTION;
        }

        p.x += p.vx;
        p.y += p.vy;
      }

      // Enhanced visual effects
      const opacity = 0.4 + ((p.z + 1) / 2) * 0.6;
      const pulseEffect = Math.sin(this.time * 3 + p.pulseOffset) * 0.3 + 1;
      p.radius = ((p.z + 1.5) / 2.5) * 2.2 * pulseEffect;

      // Hologram effect for text particles
      if (p.isTextParticle && this.hologramIntensity > 0) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';

        const hologramOffset = Math.sin(this.time * 5 + index * 0.1) * 2;
        this.ctx.beginPath();
        this.ctx.arc(p.x + hologramOffset, p.y, p.radius * 0.8, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(0, 255, 255, ${opacity * this.hologramIntensity * 0.3})`;
        this.ctx.fill();

        this.ctx.restore();
      }

      // Enhanced glow for special particles
      if (p.color.r > 100 || p.color.g > 100) {
        this.ctx.shadowBlur = 15 * p.glowIntensity;
        this.ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
      }

      // Draw main particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${opacity})`;
      this.ctx.fill();

      this.ctx.shadowBlur = 0;
    });
  }

  setupInteractions() {
    const handleMouseDown = (event) => {
      this.isDragging = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    };

    const handleMouseUp = () => {
      this.isDragging = false;
    };

    const handleMouseMove = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const scaleX = this.canvas.width / dpr / rect.width;
      const scaleY = this.canvas.height / dpr / rect.height;

      this.mouse.x = (event.clientX - rect.left) * scaleX;
      this.mouse.y = (event.clientY - rect.top) * scaleY;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      this.targetParallaxX = (event.clientX - centerX) * this.PARALLAX_STRENGTH;
      this.targetParallaxY = (event.clientY - centerY) * this.PARALLAX_STRENGTH;

      if (this.isDragging) {
        this.targetRotationY += (event.clientX - this.lastMouseX) * 0.01;
        this.targetRotationX -= (event.clientY - this.lastMouseY) * 0.01;
      }

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    };

    const handleMouseLeave = () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.isDragging = false;
      this.targetParallaxX = 0;
      this.targetParallaxY = 0;
    };

    const handleResize = () => {
      this.setupCanvas();
      this.createEnhancedParticles();
      this.createPremiumStars();
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Store references for cleanup
    this.eventHandlers = {
      handleMouseDown,
      handleMouseUp,
      handleMouseMove,
      handleMouseLeave,
      handleResize
    };
  }

  // Animation control methods
  pause() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  resume() {
    if (!this.animationFrameId) {
      this.startPremiumAnimation();
    }
  }

  // Cleanup
  destroy() {
    this.pause();

    // Remove event listeners
    if (this.eventHandlers) {
      window.removeEventListener('mousedown', this.eventHandlers.handleMouseDown);
      window.removeEventListener('mouseup', this.eventHandlers.handleMouseUp);
      window.removeEventListener('mousemove', this.eventHandlers.handleMouseMove);
      if (this.canvas) {
        this.canvas.removeEventListener('mouseleave', this.eventHandlers.handleMouseLeave);
      }
      window.removeEventListener('resize', this.eventHandlers.handleResize);
    }

    // Clear references
    this.particles = [];
    this.electromagneticField = [];
    this.dataStreams = [];
    this.stars = [];
    this.shootingStars = [];
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
  }

  // Check if ready
  isReady() {
    return this.isInitialized;
  }
}