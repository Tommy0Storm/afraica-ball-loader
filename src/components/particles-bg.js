/**
 * Premium Particles Background Constellation
 * Ultra-sophisticated particle system representing African data networks
 */

export class ParticlesBackground {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.connections = [];
    this.isInitialized = false;
    this.animationFrameId = null;
    this.mouse = { x: null, y: null };
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

      this.setupCanvas();
      this.createPremiumParticles();
      this.setupInteractions();
      this.startAnimation();

      this.isInitialized = true;
      console.log('✨ Premium Particles Background initialized');

    } catch (error) {
      console.error('❌ Failed to initialize particles background:', error);
      throw error;
    }
  }

  setupCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createPremiumParticles() {
    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    // Create different types of particles
    const particleTypes = [
      { count: 15, color: '#C8102E', size: { min: 3, max: 6 }, speed: 0.3, type: 'executive' },
      { count: 40, color: '#4FAFFF', size: { min: 2, max: 4 }, speed: 0.5, type: 'data' },
      { count: 80, color: '#FFFFFF', size: { min: 1, max: 2 }, speed: 0.8, type: 'network' }
    ];

    this.particles = [];

    particleTypes.forEach(type => {
      for (let i = 0; i < type.count; i++) {
        this.particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * type.speed,
          vy: (Math.random() - 0.5) * type.speed,
          radius: Math.random() * (type.size.max - type.size.min) + type.size.min,
          color: type.color,
          alpha: Math.random() * 0.5 + 0.5,
          type: type.type,
          pulseOffset: Math.random() * Math.PI * 2,
          originalRadius: 0
        });
      }
    });

    // Set original radius after creation
    this.particles.forEach(p => p.originalRadius = p.radius);
  }

  setupInteractions() {
    const handleMouseMove = (event) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = event.clientX - rect.left;
      this.mouse.y = event.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      this.mouse.x = null;
      this.mouse.y = null;
    };

    const handleResize = () => {
      this.setupCanvas();
      this.createPremiumParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    // Store for cleanup
    this.eventHandlers = { handleMouseMove, handleMouseLeave, handleResize };
  }

  startAnimation() {
    const animate = () => {
      this.time += 0.016;

      const dpr = window.devicePixelRatio || 1;
      const width = this.canvas.width / dpr;
      const height = this.canvas.height / dpr;

      this.ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      this.updateParticles(width, height);
      this.drawConnections(width, height);
      this.drawParticles();

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  updateParticles(width, height) {
    this.particles.forEach(particle => {
      // Move particles
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= width) {
        particle.vx *= -1;
        particle.x = Math.max(0, Math.min(width, particle.x));
      }
      if (particle.y <= 0 || particle.y >= height) {
        particle.vy *= -1;
        particle.y = Math.max(0, Math.min(height, particle.y));
      }

      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - particle.x;
        const dy = this.mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 150;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          particle.vx -= (dx / distance) * force * 0.05;
          particle.vy -= (dy / distance) * force * 0.05;
        }
      }

      // Pulsing effect for executive particles
      if (particle.type === 'executive') {
        particle.radius = particle.originalRadius + Math.sin(this.time * 2 + particle.pulseOffset) * 1;
      }

      // Twinkling effect
      particle.alpha = 0.5 + Math.sin(this.time * 3 + particle.pulseOffset) * 0.3 + 0.2;
    });
  }

  drawConnections(width, height) {
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'screen';

    const maxDistance = 120;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];

        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (maxDistance - distance) / maxDistance * 0.3;

          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);

          // Color based on particle types
          let color = '#FFFFFF';
          if (p1.type === 'executive' || p2.type === 'executive') {
            color = '#C8102E';
          } else if (p1.type === 'data' || p2.type === 'data') {
            color = '#4FAFFF';
          }

          this.ctx.strokeStyle = `${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    this.ctx.restore();
  }

  drawParticles() {
    this.particles.forEach(particle => {
      this.ctx.save();

      // Glow effect for special particles
      if (particle.type === 'executive') {
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = particle.color;
      } else if (particle.type === 'data') {
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = particle.color;
      }

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `${particle.color}${Math.floor(particle.alpha * 255).toString(16).padStart(2, '0')}`;
      this.ctx.fill();

      this.ctx.restore();
    });
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
      this.startAnimation();
    }
  }

  // Cleanup
  destroy() {
    this.pause();

    // Remove event listeners
    if (this.eventHandlers) {
      window.removeEventListener('mousemove', this.eventHandlers.handleMouseMove);
      if (this.canvas) {
        this.canvas.removeEventListener('mouseleave', this.eventHandlers.handleMouseLeave);
      }
      window.removeEventListener('resize', this.eventHandlers.handleResize);
    }

    // Clear references
    this.particles = [];
    this.connections = [];
    this.canvas = null;
    this.ctx = null;
    this.isInitialized = false;
  }

  // Get particle system reference (for compatibility)
  getContainer() {
    return { particles: { array: this.particles } };
  }

  // Check if initialized
  isReady() {
    return this.isInitialized;
  }
}