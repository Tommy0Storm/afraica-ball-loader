// Red Blinker Background Animation - CSS-based// Red Blinker Background Animation - CSS Fallback

// Creates a simple CSS-based red animation background without Three.js dependency// Creates a simple CSS-based red animation background



export async function initializeRedBlinkerBackground() {export async function initializeRedBlinkerBackground() {

  try {  try {

    // Idempotent init    // Idempotent init

    if (window.__redBlinkerInitialized) return;    if (window.__redBlinkerInitialized) return;



    console.log('🔴 Initializing CSS red background animation...');    console.log('🔴 Initializing CSS red background animation...');



    // Create CSS-based red background animation    // Create CSS-based red background animation

    let bgElement = document.getElementById('redBlinkerBackground');    let bgElement = document.getElementById('redBlinkerBackground');

    if (!bgElement) {    if (!bgElement) {

      bgElement = document.createElement('div');      bgElement = document.createElement('div');

      bgElement.id = 'redBlinkerBackground';      bgElement.id = 'redBlinkerBackground';

      Object.assign(bgElement.style, {      Object.assign(bgElement.style, {

        position: 'fixed',        position: 'fixed',

        inset: '0',        inset: '0',

        width: '100vw',        width: '100vw',

        height: '100vh',        height: '100vh',

        pointerEvents: 'none',        pointerEvents: 'none',

        zIndex: '0',        zIndex: '0',

        background: `        background: `

          radial-gradient(ellipse at 20% 80%, rgba(200, 16, 46, 0.15) 0%, transparent 50%),          radial-gradient(ellipse at 20% 80%, rgba(200, 16, 46, 0.15) 0%, transparent 50%),

          radial-gradient(ellipse at 80% 20%, rgba(200, 16, 46, 0.1) 0%, transparent 50%),          radial-gradient(ellipse at 80% 20%, rgba(200, 16, 46, 0.1) 0%, transparent 50%),

          radial-gradient(ellipse at 40% 40%, rgba(200, 16, 46, 0.08) 0%, transparent 30%),          radial-gradient(ellipse at 40% 40%, rgba(200, 16, 46, 0.08) 0%, transparent 30%),

          linear-gradient(135deg, rgba(0, 0, 0, 1) 0%, rgba(10, 0, 5, 1) 100%)          linear-gradient(135deg, rgba(0, 0, 0, 1) 0%, rgba(10, 0, 5, 1) 100%)

        `,        `,

        backgroundSize: '150% 150%, 120% 120%, 100% 100%, 100% 100%',        animation: 'redBlinkerPulse 8s ease-in-out infinite alternate'

        animation: 'redBlinkerPulse 8s ease-in-out infinite alternate, redBlinkerShift 12s ease-in-out infinite'      });

      });      document.body.prepend(bgElement);

      document.body.prepend(bgElement);    }

    }

    // Add CSS animation keyframes

    // Add CSS animation keyframes    if (!document.getElementById('redBlinkerStyles')) {

    if (!document.getElementById('redBlinkerStyles')) {      const style = document.createElement('style');

      const style = document.createElement('style');      style.id = 'redBlinkerStyles';

      style.id = 'redBlinkerStyles';      style.textContent = `

      style.textContent = `        @keyframes redBlinkerPulse {

        @keyframes redBlinkerPulse {          0% {

          0% {            opacity: 0.8;

            opacity: 0.8;            filter: brightness(1) saturate(1);

            filter: brightness(1) saturate(1);            transform: scale(1);

            transform: scale(1);          }

          }          25% {

          25% {            opacity: 1;

            opacity: 1;            filter: brightness(1.2) saturate(1.3);

            filter: brightness(1.2) saturate(1.3);            transform: scale(1.02);

            transform: scale(1.02);          }

          }          50% {

          50% {            opacity: 0.9;

            opacity: 0.9;            filter: brightness(1.1) saturate(1.2);

            filter: brightness(1.1) saturate(1.2);            transform: scale(1.01);

            transform: scale(1.01);          }

          }          75% {

          75% {            opacity: 1;

            opacity: 1;            filter: brightness(1.3) saturate(1.4);

            filter: brightness(1.3) saturate(1.4);            transform: scale(1.03);

            transform: scale(1.03);          }

          }          100% {

          100% {            opacity: 0.85;

            opacity: 0.85;            filter: brightness(1) saturate(1.1);

            filter: brightness(1) saturate(1.1);            transform: scale(1);

            transform: scale(1);          }

          }        }

        }        

                @keyframes redBlinkerShift {

        @keyframes redBlinkerShift {          0% {

          0% {            background-position: 0% 0%, 100% 100%, 50% 50%;

            background-position: 0% 0%, 100% 100%, 50% 50%, 0% 0%;          }

          }          50% {

          33% {            background-position: 100% 100%, 0% 0%, 25% 75%;

            background-position: 50% 50%, 0% 0%, 25% 75%, 100% 0%;          }

          }          100% {

          66% {            background-position: 0% 0%, 100% 100%, 75% 25%;

            background-position: 100% 100%, 50% 50%, 75% 25%, 0% 100%;          }

          }        }

          100% {      `;

            background-position: 0% 0%, 100% 100%, 50% 50%, 100% 100%;      document.head.appendChild(style);

          }    }

        }

            window.__redBlinkerInitialized = true;

        /* Enhanced red blinking dots effect */    console.log('✅ CSS red background animation initialized successfully');

        #redBlinkerBackground::before {

          content: '';  } catch (error) {

          position: absolute;    console.error('❌ Red blinker background failed to initialize:', error);

          inset: 0;    // Create minimal fallback

          background:     const fallback = document.createElement('div');

            radial-gradient(circle at 15% 25%, rgba(200, 16, 46, 0.3) 2px, transparent 3px),    fallback.style.cssText = `

            radial-gradient(circle at 85% 75%, rgba(200, 16, 46, 0.2) 1.5px, transparent 2.5px),      position: fixed;

            radial-gradient(circle at 50% 10%, rgba(200, 16, 46, 0.25) 1px, transparent 2px),      inset: 0;

            radial-gradient(circle at 30% 90%, rgba(200, 16, 46, 0.15) 2.5px, transparent 3.5px);      background: linear-gradient(135deg, #000000 0%, #1a0a0a 100%);

          background-size: 200px 200px, 300px 300px, 250px 250px, 180px 180px;      z-index: 0;

          animation: redBlinkerDots 10s ease-in-out infinite;      pointer-events: none;

          opacity: 0.7;    `;

        }    document.body.prepend(fallback);

          }

        @keyframes redBlinkerDots {}

          0%, 100% {      const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, r);

            transform: translate(0, 0) rotate(0deg);      grd.addColorStop(0.00, 'rgba(255,0,0,1)');

            opacity: 0.7;      grd.addColorStop(0.35, 'rgba(255,0,0,0.7)');

          }      grd.addColorStop(1.00, 'rgba(255,0,0,0)');

          25% {      g.fillStyle = grd;

            transform: translate(10px, -5px) rotate(1deg);      g.beginPath();

            opacity: 1;      g.arc(size / 2, size / 2, r, 0, Math.PI * 2);

          }      g.fill();

          50% {      return new THREE.CanvasTexture(cnv);

            transform: translate(-5px, 10px) rotate(-1deg);    }

            opacity: 0.8;    const dotTex = makeDotTexture();

          }

          75% {    const COUNT = 10000;

            transform: translate(8px, 3px) rotate(0.5deg);    const STRANDS = 5;

            opacity: 0.9;    const SAMPLES = 160;

          }    const JITTER = 0.1;

        }    const BASE_ALPHA = 0.09;

      `;    const BLINK_WIDTH = 0.10;

      document.head.appendChild(style);    const SIZE_MIN = 0.002; // reduced by half per request

    }    const SIZE_MAX = 0.006;

    const HEADS = [

    window.__redBlinkerInitialized = true;      { speed: 0.009, phase: 0.10 },

    console.log('✅ CSS red background animation initialized successfully');      { speed: -0.104, phase: 0.33 },

      { speed: 0.0109, phase: 0.67 },

  } catch (error) {    ];

    console.error('❌ Red blinker background failed to initialize:', error);

    // Create minimal fallback    const harmonics = Array.from({ length: 5 }, (_, i) => ({

    const fallback = document.createElement('div');      kx: 0.6 + i * 0.45,

    fallback.style.cssText = `      kt: 0.1 + i * 0.21,

      position: fixed;      ax: 0.06 * Math.pow(0.9, i),

      inset: 0;      ph: Math.random() * Math.PI * 2,

      background: linear-gradient(135deg, #000000 0%, #1a0a0a 100%);    }));

      z-index: 0;    function loopNoise(x, t, baseAmp = 0.28, vshift = 0) {

      pointer-events: none;      let y = 0;

    `;      for (const h of harmonics) {

    document.body.prepend(fallback);        y += h.ax * Math.sin(x * Math.PI * 2 * h.kx + t * h.kt + h.ph);

  }      }

}      return vshift + baseAmp * y;
    }

    function buildPolyline(samples, amp, t, vshift) {
      const pts = [];
      const x0 = -0.92, x1 = 0.92;
      for (let i = 0; i <= samples; i++) {
        const u = i / samples;
        const x = THREE.MathUtils.lerp(x0, x1, u);
        const y = loopNoise(x, t, amp, vshift);
        pts.push(new THREE.Vector2(x, y));
      }
      const s = [0]; let acc = 0;
      for (let i = 1; i < pts.length; i++) { acc += pts[i].distanceTo(pts[i - 1]); s.push(acc); }
      for (let i = 0; i < s.length; i++) s[i] /= acc || 1e-6;
      return { pts, s };
    }
    function samplePolyline(poly, t) {
      const s = poly.s, pts = poly.pts;
      let lo = 0, hi = s.length - 1;
      while (hi - lo > 1) { const mid = (lo + hi) >> 1; (s[mid] < t) ? (lo = mid) : (hi = mid); }
      const span = (s[hi] - s[lo]) || 1e-6; const a = (t - s[lo]) / span;
      const p0 = pts[lo], p1 = pts[hi];
      return new THREE.Vector2(
        THREE.MathUtils.lerp(p0.x, p1.x, a),
        THREE.MathUtils.lerp(p0.y, p1.y, a)
      );
    }

    let strands = [];
    function rebuildStrands(time) {
      strands = [];
      for (let i = 0; i < STRANDS; i++) {
        const vshift = (i - (STRANDS - 1) / 2) * 0.20;
        strands.push(buildPolyline(SAMPLES, 3.0, time * 0.5 + i * 1.7, vshift));
      }
    }
    rebuildStrands(0);

    const positions = new Float32Array(COUNT * 3);
    const phases = new Float32Array(COUNT);
    const sizes = new Float32Array(COUNT);
    const strandIdx = new Uint16Array(COUNT);
    const jitters = Array.from({ length: COUNT }, () => (Math.random() - 0.5) * 2 * JITTER);

    for (let i = 0; i < COUNT; i++) {
      const s = Math.floor(Math.random() * STRANDS);
      const t = Math.random();
      positions[i * 3 + 0] = 0; positions[i * 3 + 1] = 0; positions[i * 3 + 2] = 0;
      phases[i] = t; sizes[i] = THREE.MathUtils.lerp(SIZE_MIN, SIZE_MAX, Math.pow(Math.random(), 3));
      strandIdx[i] = s;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTex: { value: dotTex },
        uTime: { value: 0 },
        uBaseAlpha: { value: BASE_ALPHA },
        uBlinkWidth: { value: BLINK_WIDTH },
        uHeadCount: { value: HEADS.length },
        uHeadSpeeds: { value: new THREE.Vector4(
          HEADS[0]?.speed || 0, HEADS[1]?.speed || 0, HEADS[2]?.speed || 0, HEADS[3]?.speed || 0
        ) },
        uHeadPhases: { value: new THREE.Vector4(
          HEADS[0]?.phase || 0, HEADS[1]?.phase || 0, HEADS[2]?.phase || 0, HEADS[3]?.phase || 0
        ) },
      },
      vertexShader: `
        attribute float aSize;
        varying float vPhase;
        void main(){
          vPhase = position.z; // phase encoded in Z set each frame
          gl_Position = vec4(position.xy, 0.0, 1.0);
          float ndcToPx = 0.5 * float(${typeof window !== 'undefined' ? window.innerHeight : 1080}.0);
          gl_PointSize = aSize * ndcToPx;
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform sampler2D uTex;
        uniform float uTime, uBaseAlpha, uBlinkWidth;
        uniform int   uHeadCount;
        uniform vec4  uHeadSpeeds;
        uniform vec4  uHeadPhases;
        varying float vPhase;
        float head(float t, float speed, float phase){
          float h = fract(t * speed + phase);
          return (h < 0.0) ? (h + 1.0) : h;
        }
        void main(){
          vec2 uv = gl_PointCoord;
          vec4 tex = texture2D(uTex, uv);
          float glow = 0.0;
          for(int i=0;i<4;i++){
            if(i>=uHeadCount) break;
            float sp = (i==0)? uHeadSpeeds.x : (i==1)? uHeadSpeeds.y : (i==2)? uHeadSpeeds.z : uHeadSpeeds.w;
            float ph = (i==0)? uHeadPhases.x : (i==1)? uHeadPhases.y : (i==2)? uHeadPhases.z : uHeadPhases.w;
            float h  = head(uTime, sp, ph);
            float d  = abs(vPhase - h); d = min(d, 1.0 - d);
            float w  = max(0.0, 1.0 - d / uBlinkWidth);
            glow    += pow(sin(w*1.5707963), 5.0);
          }
          float a = uBaseAlpha + glow * 0.9;
          vec3  c = vec3(1.0,0.0,0.0) * (0.35 + glow*1.8);
          vec4  col = vec4(c,a) * tex;
          if(col.a < 0.02) discard;
          gl_FragColor = col;
        }
      `,
    });

    const points = new THREE.Points(geo, mat);
    scene.add(points);

    function updatePositions(time) {
      rebuildStrands(time);
      const pos = geo.getAttribute('position');
      const pha = geo.getAttribute('aPhase');
      for (let i = 0; i < COUNT; i++) {
        const sIdx = strandIdx[i];
        const t = pha.getX(i);
        const poly = strands[sIdx];
        const p = samplePolyline(poly, t);
        const t2 = Math.min(1, t + 0.001);
        const p2 = samplePolyline(poly, t2);
        const tx = p2.x - p.x, ty = p2.y - p.y;
        const len = Math.hypot(tx, ty) || 1;
        const nx = -ty / len, ny = tx / len;
        const j = jitters[i];
        const x = p.x + nx * j;
        const y = p.y + ny * j;
        pos.setXYZ(i, x, y, t);
      }
      pos.needsUpdate = true;
    }

    function render(tms) {
      const t = tms * 0.001;
      updatePositions(t);
      mat.uniforms.uTime.value = t;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    window.addEventListener('resize', () => setSize());
  } catch (err) {
    console.error('Red blinker background failed to initialize:', err);
  }
}
