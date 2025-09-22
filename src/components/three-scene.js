/**
 * Premium Three.js Volumetric Lighting Scene
 * Ultra-sophisticated 3D lighting and depth effects
 */

import * as THREE from 'three';

export class ThreeScene {
  constructor(canvasId) {
    this.canvasId = canvasId;
    this.canvas = null;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lights = {};
    this.uniforms = {};
    this.isInitialized = false;
    this.animationId = null;

    // Premium lighting parameters
    this.lightIntensity = 0.6;
    this.ambientIntensity = 0.2;
    this.time = 0;
  }

  async initialize() {
    try {
      this.canvas = document.getElementById(this.canvasId);
      if (!this.canvas) {
        throw new Error(`Canvas element #${this.canvasId} not found`);
      }

      // Create scene
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.Fog(0x000511, 1, 100);

      // Setup camera with premium perspective
      this.setupCamera();

      // Initialize WebGL renderer with premium settings
      this.setupRenderer();

      // Create sophisticated lighting system
      this.setupLighting();

      // Add volumetric effects
      this.setupVolumetricEffects();

      // Handle window resize
      this.handleResize();

      // Start render loop
      this.startRenderLoop();

      this.isInitialized = true;
      console.log('✨ Premium Three.js Scene initialized');

    } catch (error) {
      console.error('❌ Failed to initialize Three.js scene:', error);
      throw error;
    }
  }

  setupCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(0, 0, 0);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Premium rendering settings
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
  }

  setupLighting() {
    // Ambient light for base illumination
    this.lights.ambient = new THREE.AmbientLight(0x4FAFFF, this.ambientIntensity);
    this.scene.add(this.lights.ambient);

    // Primary key light (afrAIca red)
    this.lights.key = new THREE.DirectionalLight(0xC8102E, this.lightIntensity);
    this.lights.key.position.set(2, 3, 5);
    this.lights.key.castShadow = true;
    this.lights.key.shadow.mapSize.width = 2048;
    this.lights.key.shadow.mapSize.height = 2048;
    this.lights.key.shadow.camera.near = 0.5;
    this.lights.key.shadow.camera.far = 500;
    this.scene.add(this.lights.key);

    // Fill light (cool blue)
    this.lights.fill = new THREE.DirectionalLight(0x4FAFFF, this.lightIntensity * 0.3);
    this.lights.fill.position.set(-2, 1, 3);
    this.scene.add(this.lights.fill);

    // Rim light (white)
    this.lights.rim = new THREE.DirectionalLight(0xFFFFFF, this.lightIntensity * 0.5);
    this.lights.rim.position.set(0, -2, -3);
    this.scene.add(this.lights.rim);

    // Point lights for atmospheric effect
    this.createAtmosphericLights();
  }

  createAtmosphericLights() {
    const colors = [0xC8102E, 0x4FAFFF, 0xFF6B6B, 0xFFFFFF];

    for (let i = 0; i < 8; i++) {
      const light = new THREE.PointLight(
        colors[i % colors.length],
        0.2,
        20,
        2
      );

      // Position lights in a sphere around origin
      const radius = 8;
      const theta = (i / 8) * Math.PI * 2;
      const phi = Math.PI * 0.5 + (Math.random() - 0.5) * 0.5;

      light.position.x = radius * Math.sin(phi) * Math.cos(theta);
      light.position.y = radius * Math.sin(phi) * Math.sin(theta);
      light.position.z = radius * Math.cos(phi);

      this.scene.add(light);

      if (!this.lights.atmospheric) {
        this.lights.atmospheric = [];
      }
      this.lights.atmospheric.push(light);
    }
  }

  setupVolumetricEffects() {
    // Volumetric light material
    const volumetricVertexShader = `
      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const volumetricFragmentShader = `
      uniform float time;
      uniform vec3 lightPosition;
      uniform vec3 cameraPosition;
      uniform float intensity;

      varying vec3 vWorldPosition;
      varying vec3 vNormal;

      void main() {
        vec3 lightDirection = normalize(lightPosition - vWorldPosition);
        vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

        float lightDistance = length(lightPosition - vWorldPosition);
        float attenuation = 1.0 / (1.0 + 0.1 * lightDistance + 0.01 * lightDistance * lightDistance);

        // Volumetric scattering effect
        float scattering = pow(max(0.0, dot(lightDirection, viewDirection)), 2.0);

        // Noise for atmospheric effect
        float noise = sin(vWorldPosition.x * 0.1 + time) *
                     sin(vWorldPosition.y * 0.1 + time * 0.7) *
                     sin(vWorldPosition.z * 0.1 + time * 0.3);
        noise = (noise + 1.0) * 0.5;

        float volumetricEffect = scattering * attenuation * noise * intensity;

        gl_FragColor = vec4(0.8, 0.1, 0.2, volumetricEffect * 0.1);
      }
    `;

    this.uniforms = {
      time: { value: 0 },
      lightPosition: { value: new THREE.Vector3(2, 3, 5) },
      cameraPosition: { value: this.camera.position },
      intensity: { value: 1.0 }
    };

    const volumetricMaterial = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: volumetricVertexShader,
      fragmentShader: volumetricFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });

    // Create invisible spheres for volumetric effect
    const geometry = new THREE.SphereGeometry(3, 32, 32);
    this.volumetricMesh = new THREE.Mesh(geometry, volumetricMaterial);
    this.scene.add(this.volumetricMesh);

    // Add particle system for light rays
    this.createLightRays();
  }

  createLightRays() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Random positions in a cone shape (light rays)
      const radius = Math.random() * 5;
      const angle = Math.random() * Math.PI * 2;
      const height = Math.random() * 10 - 5;

      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Colors (red to white gradient)
      const colorIntensity = Math.random();
      colors[i3] = 1.0; // R
      colors[i3 + 1] = colorIntensity * 0.2; // G
      colors[i3 + 2] = colorIntensity * 0.3; // B

      sizes[i] = Math.random() * 2 + 1;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending
    });

    this.lightRayParticles = new THREE.Points(particles, particleMaterial);
    this.scene.add(this.lightRayParticles);
  }

  startRenderLoop() {
    const animate = () => {
      this.time += 0.016; // Approximately 60fps

      if (this.uniforms.time) {
        this.uniforms.time.value = this.time;
      }

      // Animate atmospheric lights
      if (this.lights.atmospheric) {
        this.lights.atmospheric.forEach((light, index) => {
          const time = this.time + index * 0.5;
          light.intensity = 0.2 + Math.sin(time * 2) * 0.1;

          // Subtle movement
          const radius = 8;
          const theta = (index / 8) * Math.PI * 2 + time * 0.1;
          const phi = Math.PI * 0.5 + Math.sin(time * 0.3) * 0.2;

          light.position.x = radius * Math.sin(phi) * Math.cos(theta);
          light.position.y = radius * Math.sin(phi) * Math.sin(theta);
          light.position.z = radius * Math.cos(phi);
        });
      }

      // Animate light ray particles
      if (this.lightRayParticles) {
        this.lightRayParticles.rotation.y += 0.001;
        this.lightRayParticles.rotation.x = Math.sin(this.time * 0.5) * 0.1;
      }

      // Subtle camera movement
      this.camera.position.x = Math.sin(this.time * 0.2) * 0.5;
      this.camera.position.y = Math.cos(this.time * 0.15) * 0.3;
      this.camera.lookAt(0, 0, 0);

      this.renderer.render(this.scene, this.camera);
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  handleResize() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  // Animation control
  setIntensity(intensity) {
    this.lightIntensity = intensity;
    if (this.lights.key) this.lights.key.intensity = intensity;
    if (this.lights.fill) this.lights.fill.intensity = intensity * 0.3;
    if (this.lights.rim) this.lights.rim.intensity = intensity * 0.5;
    if (this.uniforms.intensity) this.uniforms.intensity.value = intensity;
  }

  pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  resume() {
    if (!this.animationId) {
      this.startRenderLoop();
    }
  }

  // Cleanup
  destroy() {
    this.pause();

    if (this.renderer) {
      this.renderer.dispose();
    }

    if (this.scene) {
      // Dispose of all geometries and materials
      this.scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.lights = {};
    this.uniforms = {};
    this.isInitialized = false;
  }

  // Get scene reference
  getScene() {
    return this.scene;
  }

  getCamera() {
    return this.camera;
  }

  getRenderer() {
    return this.renderer;
  }

  // Check if initialized
  isReady() {
    return this.isInitialized;
  }
}