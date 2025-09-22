/**
 * Loading Ball Component
 * Exact particle ball code from stress ball with afrAIca text
 */

export function initializeLoadingBall(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) {
    throw new Error("Could not find canvas element");
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  const PARTICLE_COUNT = 15000;
  const PARTICLE_COLORS = [
    { r: 255, g: 255, b: 255 }, // White
    { r: 222, g: 49, b: 99 },   // Cherry Red (#DE3163)
    { r: 75, g: 85, b: 99 }     // Slate Gray (for background)
  ];
  const MOUSE_RADIUS = 100;
  const REPULSION_STRENGTH = 5;
  let rigidity = 0.25;
  const PARTICLE_FRICTION = 0.95;

  let particles = [];
  const mouse = { x: null, y: null };
  let animationFrameId = null;

  // Premium background effects
  let stars = [];
  const STAR_COUNT = 200;
  let shootingStars = [];
  let parallaxX = 0, parallaxY = 0;
  let targetParallaxX = 0, targetParallaxY = 0;
  const PARALLAX_STRENGTH = 0.01;

  // Rotation variables - starting at 0,0 to face front
  let rotationX = 0, rotationY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let lastMouseX = null, lastMouseY = null;
  let isDragging = false;

  // Volcano eruption system - makes existing particles explode
  let volcanoTimer = 0;
  let activeEruptions = [];

  // Loading sequence control
  let loadingStartTime = null;
  let totalRotationTarget = Math.PI * 4; // 2 full revolutions (4π radians total)
  let eruptionsEnabled = false;
  let finalExplosionTriggered = false;

  const createStars = (width, height) => {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.2,
            vx: Math.random() * 0.1 - 0.05,
            vy: Math.random() * 0.1 - 0.05,
            alpha: Math.random() * 0.5 + 0.5
        });
    }
  };

  const updateAndDrawShootingStars = (ctx, width, height) => {
      if (Math.random() < 0.005 && shootingStars.length < 3) {
          const fromLeft = Math.random() > 0.5;
          const fromTop = Math.random() > 0.5;
          shootingStars.push({
              x: fromLeft ? 0 : Math.random() * width,
              y: fromLeft ? Math.random() * height : 0,
              vx: (Math.random() * 4 + 4) * (fromLeft ? 1 : Math.cos(Math.PI * 1.25)),
              vy: (Math.random() * 4 + 4) * (fromLeft ? Math.sin(Math.PI * 0.25) * (fromTop ? 1 : -1) : 1),
              life: 100,
              initialLife: 100,
              tailLength: 20
          });
      }

      ctx.save();
      shootingStars.forEach((star) => {
          star.x += star.vx;
          star.y += star.vy;
          star.life--;

          const tailX = star.x - star.vx * star.tailLength;
          const tailY = star.y - star.vy * star.tailLength;
          const gradient = ctx.createLinearGradient(tailX, tailY, star.x, star.y);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(1, `rgba(255, 255, 255, ${star.life / star.initialLife})`);

          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(star.x, star.y);
          ctx.stroke();
      });
      ctx.restore();
      shootingStars = shootingStars.filter(s => s.life > 0 && s.x < width * 1.2 && s.y < height * 1.2);
  };

  const createVolcanoEruptions = (centerX, centerY, scale) => {
    volcanoTimer++;

    // Only create eruptions when enabled (after 5 seconds)
    if (!eruptionsEnabled) return;

    // Create DOUBLE frequency random volcano eruptions every ~0.25 seconds (15 frames)
    if (volcanoTimer % 15 === 0 && Math.random() < 0.95) {

      // Determine eruption type randomly
      const eruptionType = Math.random();
      let eruptionStrength, eruptionSize, eruptionDuration, eruptionName;

      if (eruptionType < 0.4) {
        // Small gentle puffs (40% chance)
        eruptionStrength = 8 + Math.random() * 12;
        eruptionSize = scale * (0.08 + Math.random() * 0.07);
        eruptionDuration = 30 + Math.random() * 20;
        eruptionName = "gentle puff";
      } else if (eruptionType < 0.7) {
        // Medium eruptions (30% chance)
        eruptionStrength = 20 + Math.random() * 15;
        eruptionSize = scale * (0.12 + Math.random() * 0.08);
        eruptionDuration = 45 + Math.random() * 25;
        eruptionName = "medium eruption";
      } else {
        // Strong bursts (30% chance)
        eruptionStrength = 35 + Math.random() * 20;
        eruptionSize = scale * (0.18 + Math.random() * 0.12);
        eruptionDuration = 60 + Math.random() * 30;
        eruptionName = "strong burst";
      }

      // Pick random spots only on CAMERA-FACING side (front hemisphere)
      const angle = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.5; // Only front hemisphere (camera side)
      const randomRadius = 0.4 + Math.random() * 0.6; // Distance from center

      // Calculate eruption center on camera-facing side only
      const eruptionX = centerX + Math.sin(phi) * Math.cos(angle) * scale * randomRadius + (Math.random() - 0.5) * 30;
      const eruptionY = centerY + Math.sin(phi) * Math.sin(angle) * scale * randomRadius + (Math.random() - 0.5) * 30;

      console.log('🌋 Creating', eruptionName, 'at', eruptionX.toFixed(0), eruptionY.toFixed(0), 'strength:', eruptionStrength.toFixed(1));

      // Create varied eruption effect
      activeEruptions.push({
        x: eruptionX,
        y: eruptionY,
        radius: eruptionSize,
        life: eruptionDuration,
        strength: eruptionStrength,
        type: eruptionName
      });

      // Random chance for DOUBLE explosions - create a second explosion nearby
      if (Math.random() < 0.4) {
        const nearbyX = eruptionX + (Math.random() - 0.5) * 80;
        const nearbyY = eruptionY + (Math.random() - 0.5) * 80;

        activeEruptions.push({
          x: nearbyX,
          y: nearbyY,
          radius: eruptionSize * 0.7,
          life: eruptionDuration * 0.8,
          strength: eruptionStrength * 0.6,
          type: "double explosion"
        });

        console.log('💥 DOUBLE explosion nearby!');
      }
    }
  };

  const applyVolcanoEffects = () => {
    // Update active eruptions and apply forces to nearby particles
    activeEruptions.forEach(eruption => {
      eruption.life--;

      // Apply explosive force to particles within eruption radius
      particles.forEach(particle => {
        const dx = particle.x - eruption.x;
        const dy = particle.y - eruption.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < eruption.radius && distance > 0) {
          // Create pulse effect based on eruption type
          let pulseIntensity = 0;
          let growthMultiplier = 1;

          if (eruption.type === "gentle puff") {
            pulseIntensity = eruption.life > 25 ? (eruption.life - 25) / 5 : 0;
            growthMultiplier = 1.5;
          } else if (eruption.type === "medium eruption") {
            pulseIntensity = eruption.life > 35 ? (eruption.life - 35) / 8 : 0;
            growthMultiplier = 2.2;
          } else if (eruption.type === "strong burst") {
            pulseIntensity = eruption.life > 50 ? (eruption.life - 50) / 12 : 0;
            growthMultiplier = 3.5;
          } else { // final explosion
            pulseIntensity = eruption.life > 80 ? (eruption.life - 80) / 20 : 0;
            growthMultiplier = 6.0; // Massive growth for final explosion
          }

          const force = (eruption.strength * pulseIntensity) / (distance * 0.3);
          const forceX = (dx / distance) * force;
          const forceY = (dy / distance) * force;

          // Apply force to particle
          particle.vx += forceX;
          particle.vy += forceY;

          // Make particles grow based on eruption intensity
          if (pulseIntensity > 0.5) {
            particle.radius = Math.min(particle.radius * growthMultiplier, 8);

            // Add special effects for stronger eruptions
            if (eruption.type === "strong burst" && particle.color.r === 200) {
              particle.glowing = true;
            }
          }
        }
      });
    });

    // Remove expired eruptions
    activeEruptions = activeEruptions.filter(eruption => eruption.life > 0);
  };

  const triggerImmediateExplosion = () => {
    console.log('💥 IMMEDIATE EXPLOSION AT 5 SECONDS!');

    // Create several immediate explosion points around the ball
    const ballCenterX = window.innerWidth / 2;
    const ballCenterY = window.innerHeight / 2 + 38;

    const explosionPoints = [
      { x: 0, y: 0, strength: 40 }, // Center
      { x: -0.2, y: -0.15, strength: 35 }, // Top left
      { x: 0.2, y: -0.15, strength: 35 }, // Top right
      { x: -0.25, y: 0.2, strength: 30 }, // Bottom left
      { x: 0.25, y: 0.2, strength: 30 }  // Bottom right
    ];

    explosionPoints.forEach((point) => {
      activeEruptions.push({
        x: ballCenterX + point.x * 150,
        y: ballCenterY + point.y * 150,
        radius: 120, // Medium explosion radius
        life: 80,
        strength: point.strength,
        type: "immediate explosion"
      });
    });
  };

  const createExplosionParticles = () => {
    console.log('✨ Creating 10x more particles for final explosion!');

    // Create 10x more particles (current ball has ~15,000, add ~150,000 more)
    const explosionParticleCount = particles.length * 10;
    const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
    const centerY = canvas.height / (window.devicePixelRatio || 1) / 2 + 38;

    for (let i = 0; i < explosionParticleCount; i++) {
      // Create particles in expanding sphere around the ball
      const phi = Math.acos(1 - 2 * Math.random()); // Full sphere
      const theta = Math.random() * Math.PI * 2;
      const radius = Math.random() * 100 + 50; // Start close to ball

      const x = Math.sin(phi) * Math.cos(theta) * radius;
      const y = Math.sin(phi) * Math.sin(theta) * radius;
      const z = Math.cos(phi) * radius;

      // Random colors - mix of white, red AI colors, and sparks
      const colorType = Math.random();
      let particleColor;
      if (colorType < 0.3) {
        particleColor = { r: 255, g: 255, b: 255 }; // White
      } else if (colorType < 0.6) {
        particleColor = { r: 200, g: 16, b: 46 }; // AI red
      } else {
        particleColor = { r: 255, g: 200 + Math.random() * 55, b: 100 + Math.random() * 100 }; // Orange sparks
      }

      particles.push({
        x: centerX + x,
        y: centerY + y,
        baseX: centerX + x,
        baseY: centerY + y,
        baseX3d: x * 0.01,
        baseY3d: y * 0.01,
        baseZ3d: z * 0.01,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        z: z * 0.01,
        radius: Math.random() * 2 + 0.5,
        color: particleColor,
        density: Math.random() * 15 + 5,
        isExplosionParticle: true // Mark as explosion particle
      });
    }

    console.log(`💥 Added ${explosionParticleCount} explosion particles! Total: ${particles.length}`);
  };

  const triggerFinalExplosion = () => {
    if (finalExplosionTriggered) return;
    finalExplosionTriggered = true;

    console.log('💥 FINAL EXPLOSION!');

    // Create 10x more particles first
    createExplosionParticles();

    // Create MASSIVE explosion 5X stronger - affects all particles dramatically
    const explosionPoints = [
      { x: 0, y: 0, strength: 400 }, // Center - 5x stronger
      { x: -0.2, y: -0.15, strength: 300 }, // Top left - 5x stronger
      { x: 0.2, y: -0.15, strength: 300 }, // Top right - 5x stronger
      { x: -0.3, y: 0.2, strength: 250 }, // Bottom left - 5x stronger
      { x: 0.3, y: 0.2, strength: 250 }, // Bottom right - 5x stronger
      { x: 0, y: -0.3, strength: 275 }, // Top - 5x stronger
      { x: 0, y: 0.3, strength: 275 }, // Bottom - 5x stronger
      // Additional explosion points for more chaos
      { x: -0.1, y: 0.1, strength: 350 }, // Inner left
      { x: 0.1, y: -0.1, strength: 350 }, // Inner right
      { x: -0.4, y: 0, strength: 200 }, // Far left
      { x: 0.4, y: 0, strength: 200 }  // Far right
    ];

    explosionPoints.forEach((point, index) => {
      setTimeout(() => {
        activeEruptions.push({
          x: window.innerWidth / 2 + point.x * 300,
          y: window.innerHeight / 2 + point.y * 300,
          radius: 1000, // GIGANTIC explosion radius - affects 10x more particles
          life: 300, // Much longer duration for slower effect
          strength: point.strength * 0.15, // QUARTER speed - ultra slow motion cinematic effect
          type: "final explosion 10x particles"
        });
      }, index * 200); // Slower stagger - double the delay
    });
  };

  const drawStars = (width, height) => {
      ctx.save();
      parallaxX += (targetParallaxX - parallaxX) * 0.05;
      parallaxY += (targetParallaxY - parallaxY) * 0.05;
      ctx.translate(parallaxX, parallaxY);

      stars.forEach(s => {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = width; if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height; if (s.y > height) s.y = 0;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * 0.5})`;
          ctx.fill();
      });
      ctx.restore();
      updateAndDrawShootingStars(ctx, width, height);
  };

  const createParticles = (width, height) => {
    const textCanvas = document.createElement('canvas');
    const textCtx = textCanvas.getContext('2d');
    if (!textCtx) return;
    const FONT_SIZE = 150;
    textCanvas.width = 1024; textCanvas.height = 256;
    textCtx.font = `bold ${FONT_SIZE}px Arial, sans-serif`;
    textCtx.textAlign = 'center'; textCtx.textBaseline = 'middle';
    const metricsAfr = textCtx.measureText('afr');
    const metricsAI = textCtx.measureText('AI');
    const totalWidth = metricsAfr.width + metricsAI.width + textCtx.measureText('ca').width;
    const startX = (textCanvas.width - totalWidth) / 2;
    textCtx.fillStyle = 'blue'; textCtx.fillText('afr', startX + metricsAfr.width / 2, 128);
    textCtx.fillStyle = 'red'; textCtx.fillText('AI', startX + metricsAfr.width + metricsAI.width / 2, 128);
    textCtx.fillStyle = 'green'; textCtx.fillText('ca', startX + metricsAfr.width + metricsAI.width + textCtx.measureText('ca').width / 2, 128);
    const imageData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height);

    particles = [];
    const sphereRadius = 1;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    // Rotation to orient the text for mapping onto the sphere's surface
    const textMapRotY = -Math.PI / 2;
    const cosTextMapY = Math.cos(textMapRotY), sinTextMapY = Math.sin(textMapRotY);

    // Position afrAIca facing front and right-side up
    const finalRotX = Math.PI; // 180 degrees to flip upright
    const finalRotY = Math.PI; // 180 degrees to face the other way
    const cosFinalX = Math.cos(finalRotX), sinFinalX = Math.sin(finalRotX);
    const cosFinalY = Math.cos(finalRotY), sinFinalY = Math.sin(finalRotY);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
        const radiusAtY = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;
        const x = Math.cos(theta) * radiusAtY, z = Math.sin(theta) * radiusAtY;

        // --- 1. Determine particle color based on text mapping ---
        // Rotate the particle's coordinates temporarily to see where it lands on the text map
        const textMapX = x * cosTextMapY - z * sinTextMapY;
        const textMapZ = x * sinTextMapY + z * cosTextMapY;
        const textMapY = y;

        const particleLongitude = Math.atan2(textMapZ, textMapX);
        const particleLatitude = Math.acos(textMapY);
        let isTextParticle = false, particleColor;
        const textBandHeight = 0.4;
        const textBandStartLat = Math.PI * (1 - textBandHeight) / 2;
        const textBandEndLat = Math.PI * (1 + textBandHeight) / 2;

        if (particleLatitude > textBandStartLat && particleLatitude < textBandEndLat) {
          const u = (particleLongitude + Math.PI) / (2 * Math.PI);
          const v = (particleLatitude - textBandStartLat) / (textBandEndLat - textBandStartLat);
          const textX = Math.floor(u * textCanvas.width), textY = Math.floor(v * textCanvas.height);
          const pixelIndex = (textY * textCanvas.width + textX) * 4;
          if (imageData.data[pixelIndex + 3] > 128) {
            isTextParticle = true;
            particleColor = imageData.data[pixelIndex] > 128 ? PARTICLE_COLORS[1] : PARTICLE_COLORS[0];
          }
        }
        if (!isTextParticle) {
            particleColor = Math.random() < 0.15 ? PARTICLE_COLORS[1] : PARTICLE_COLORS[2];
        }

        // --- 2. Calculate the FINAL base coordinates with front-facing rotation ---
        // Apply final Y rotation to the original coordinates
        const x1 = x * cosFinalY - z * sinFinalY;
        const z1 = x * sinFinalY + z * cosFinalY;
        // Then apply final X rotation
        const y2 = y * cosFinalX - z1 * sinFinalX;
        const z2 = y * sinFinalX + z1 * cosFinalX;
        const x2 = x1;

        const baseX3d = x2 * sphereRadius;
        const baseY3d = y2 * sphereRadius;
        const baseZ3d = z2 * sphereRadius;

        const scale = Math.min(width, height) * 0.18; // Reduced by 40% (0.3 * 0.6 = 0.18)
        const ballCenterY = height / 2 + 38; // Move ball down by ~1cm (38px)
        particles.push({
            x: (baseX3d * scale) + width / 2, y: (baseY3d * scale) + ballCenterY,
            baseX: (baseX3d * scale) + width / 2, baseY: (baseY3d * scale) + ballCenterY,
            baseX3d, baseY3d, baseZ3d,
            vx: 0, vy: 0, z: baseZ3d, radius: 1, color: particleColor, density: Math.random() * 20 + 10,
        });
    }
  };

  const animate = () => {
    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const canvasWidth = canvas.width / dpr, canvasHeight = canvas.height / dpr;
    drawStars(canvasWidth, canvasHeight);

    // Use real time for accurate timing
    if (!loadingStartTime) loadingStartTime = performance.now();
    const seconds = (performance.now() - loadingStartTime) / 1000; // Real seconds

    // Phase 1: Spinning (0-5 seconds) - exactly 2 revolutions then stop
    if (seconds < 5) {
      // Lock particles in perfect sphere formation while spinning
      rigidity = 1.0;

      if (!isDragging) {
        // Start with BLAZING fast spin speed and gradually slow down over 5 seconds
        const progress = seconds / 5; // 0 to 1 over 5 seconds
        const initialSpinSpeed = 0.6; // BLAZING fast initial spin (4x faster)
        const currentSpinSpeed = initialSpinSpeed * Math.pow(1 - progress, 2); // Quadratic ease-out for dramatic slowdown
        targetRotationY += currentSpinSpeed;
      }
    } else if (seconds >= 5) {
      // Stop spinning completely at 5 seconds and allow particle physics
      rigidity = 0.0; // Turn OFF rigidity completely for maximum explosion effect
    }

    // Phase 2: Enable eruptions at 5 seconds
    if (seconds >= 5 && !eruptionsEnabled) {
      eruptionsEnabled = true;
      volcanoTimer = 0; // Reset volcano timer when eruptions start

      // Trigger immediate explosion at 5 seconds
      console.log('💥 IMMEDIATE EXPLOSION AT 5 SECONDS!');
      triggerImmediateExplosion();

      console.log('🌋 Eruptions enabled at 5 seconds - RIGIDITY OFF, EXPLOSIONS ON');
    }

    // Phase 3: Final explosion at 16 seconds
    if (seconds >= 16 && !finalExplosionTriggered) {
      triggerFinalExplosion();
    }

    rotationY += (targetRotationY - rotationY) * 0.05;
    rotationX += (targetRotationX - rotationX) * 0.05;
    if (!isDragging && seconds >= 5) {
        targetRotationY *= 0.95;
        targetRotationX *= 0.95;
    }

    const scale = Math.min(canvasWidth, canvasHeight) * 0.18; // Reduced by 40% (0.3 * 0.6 = 0.18)
    const centerX = canvasWidth / 2, centerY = canvasHeight / 2 + 38; // Move ball down by ~1cm (38px)
    const cosX = Math.cos(rotationX), sinX = Math.sin(rotationX);
    const cosY = Math.cos(rotationY), sinY = Math.sin(rotationY);
    particles.sort((a, b) => a.z - b.z);

    particles.forEach(p => {
        let x1 = p.baseX3d * cosY - p.baseZ3d * sinY, z1 = p.baseX3d * sinY + p.baseZ3d * cosY;
        let y2 = p.baseY3d * cosX - z1 * sinX, z2 = p.baseY3d * sinX + z1 * cosX;
        p.z = z2; p.baseX = x1 * scale + centerX; p.baseY = y2 * scale + centerY;

        if (rigidity >= 1.0) {
            p.x = p.baseX; p.y = p.baseY; p.vx = 0; p.vy = 0;
        } else {
            let dx = (mouse.x ?? -9999) - p.x, dy = (mouse.y ?? -9999) - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < MOUSE_RADIUS) {
                const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
                p.vx -= (dx / distance) * force * REPULSION_STRENGTH * p.density;
                p.vy -= (dy / distance) * force * REPULSION_STRENGTH * p.density;
            } else if (rigidity > 0) {
                p.vx += (p.baseX - p.x) * (rigidity * 0.4);
                p.vy += (p.baseY - p.y) * (rigidity * 0.4);
            }
            if (rigidity > 0) { p.vx *= PARTICLE_FRICTION; p.vy *= PARTICLE_FRICTION; }
            p.x += p.vx; p.y += p.vy;
            // No border wall collisions - particles move freely
        }

        const opacity = 0.4 + ((p.z + 1) / 2) * 0.6;
        p.radius = ((p.z + 1.5) / 2.5) * 2 + 0.5;
        if (p.color.r > 100 || p.color.g > 100) {
          ctx.shadowBlur = 15; ctx.shadowColor = `rgb(${p.color.r}, ${p.color.g}, ${p.color.b})`;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${opacity})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    });

    // Add volcano eruption effects to existing particles
    createVolcanoEruptions(centerX, centerY, scale);
    applyVolcanoEffects();

    animationFrameId = requestAnimationFrame(animate);
  };

  const handleMouseDown = (event) => {
    isDragging = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
  };
  const handleMouseUp = () => { isDragging = false; };
  const handleMouseMove = (event) => {
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const scaleX = canvas.width / dpr / rect.width, scaleY = canvas.height / dpr / rect.height;
    mouse.x = (event.clientX - rect.left) * scaleX;
    mouse.y = (event.clientY - rect.top) * scaleY;
    const centerX = rect.width / 2, centerY = rect.height / 2;
    targetParallaxX = (event.clientX - centerX) * PARALLAX_STRENGTH;
    targetParallaxY = (event.clientY - centerY) * PARALLAX_STRENGTH;

    if (isDragging) {
        targetRotationY += (event.clientX - lastMouseX) * 0.01;
        targetRotationX -= (event.clientY - lastMouseY) * 0.01;
    }
    lastMouseX = event.clientX; lastMouseY = event.clientY;
  };
  const handleMouseLeave = () => {
      mouse.x = null; mouse.y = null; isDragging = false;
      targetParallaxX = 0; targetParallaxY = 0;
  };
  const handleResize = () => {
      cancelAnimationFrame(animationFrameId);
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      const canvasWidth = canvas.width / dpr, canvasHeight = canvas.height / dpr;
      createParticles(canvasWidth, canvasHeight);
      createStars(canvasWidth, canvasHeight);
      animate();
  };

  // Initialize
  window.addEventListener('resize', handleResize);
  window.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mouseup', handleMouseUp);
  window.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseleave', handleMouseLeave);
  handleResize();

  // Return cleanup function
  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  };
}