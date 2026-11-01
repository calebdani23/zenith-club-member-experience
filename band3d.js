/**
 * Zenith's real-time product viewer.
 * The cloth, embroidered monogram, geometry and lighting are generated locally.
 * No models, textures, analytics or other resources are fetched at runtime.
 */
export async function createBandViewer(container, { color = 'black', autoRotate = true, onReady } = {}) {
  if (!container || typeof document === 'undefined') return null;

  let renderer;
  let disposed = false;
  let frame = 0;
  const owned = new Set();
  const listeners = [];
  let resizeObserver;
  let intersectionObserver;

  const remember = value => { owned.add(value); return value; };
  const listen = (target, event, handler, options) => {
    target.addEventListener(event, handler, options);
    listeners.push(() => target.removeEventListener(event, handler, options));
  };

  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    intersectionObserver?.disconnect();
    listeners.forEach(remove => remove());
    owned.forEach(resource => resource.dispose?.());
    renderer?.dispose();
    renderer?.domElement.remove();
    delete container.dataset.bandReady;
  }

  try {
    const THREE = await import('./vendor/three.module.js');
    if (!container.isConnected) return null;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const canvas = renderer.domElement;
    canvas.className = 'zenith-band-canvas';
    canvas.tabIndex = 0;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'Interactive 3D Zenith terry wristband. Drag or use arrow keys to rotate. Press Home to reset.');
    canvas.setAttribute('title', 'Drag to explore · Arrow keys to rotate · Home to reset');
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', touchAction: 'pan-y', cursor: 'grab' });
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
    camera.position.set(3.3, 2.7, 6.6);
    camera.lookAt(0, 0.06, 0);

    scene.add(new THREE.HemisphereLight(0xe9ecff, 0x5b4935, 1.1));
    const key = new THREE.DirectionalLight(0xfff5e8, 3.3);
    key.position.set(-3.5, 5.5, 5);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcddfff, 1.25);
    fill.position.set(4, 1.4, 4.5);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd9a6, 3.1);
    rim.position.set(1.4, 3, -4);
    scene.add(rim);

    let seed = 404;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const makeCanvas = (size = 512) => {
      const value = document.createElement('canvas');
      value.width = value.height = size;
      return value;
    };
    const textureFrom = (source, colorSpace = false) => {
      const texture = remember(new THREE.CanvasTexture(source));
      if (colorSpace) texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);
      return texture;
    };

    // Looped cotton, rather than a shiny silicone surface. The repeating map
    // supplies fine yarn detail; sparse instanced loops soften the silhouette.
    const clothCanvas = makeCanvas();
    const clothContext = clothCanvas.getContext('2d');
    if (!clothContext) throw new Error('Canvas rendering unavailable');
    const pixels = clothContext.createImageData(512, 512);
    for (let p = 0; p < pixels.data.length; p += 4) {
      const value = 126 + random() * 74;
      pixels.data[p] = pixels.data[p + 1] = pixels.data[p + 2] = value;
      pixels.data[p + 3] = 255;
    }
    clothContext.putImageData(pixels, 0, 0);
    clothContext.lineCap = 'round';
    for (let n = 0; n < 10500; n++) {
      const x = random() * 512;
      const y = random() * 512;
      const radius = 1.3 + random() * 2.8;
      const angle = random() * Math.PI;
      clothContext.strokeStyle = `rgba(23,25,28,${0.2 + random() * 0.3})`;
      clothContext.lineWidth = 1.5;
      clothContext.beginPath();
      clothContext.ellipse(x + 0.6, y + 0.7, radius * 0.62, radius, angle, 0.1, Math.PI * 1.85);
      clothContext.stroke();
      clothContext.strokeStyle = `rgba(245,245,238,${0.2 + random() * 0.37})`;
      clothContext.lineWidth = 0.75;
      clothContext.beginPath();
      clothContext.ellipse(x, y, radius * 0.62, radius, angle, 0.1, Math.PI * 1.6);
      clothContext.stroke();
    }
    const fabricMap = textureFrom(clothCanvas, true);
    fabricMap.wrapS = fabricMap.wrapT = THREE.RepeatWrapping;
    fabricMap.repeat.set(4.5, 3.7);
    const fabricBump = textureFrom(clothCanvas);
    fabricBump.wrapS = fabricBump.wrapT = THREE.RepeatWrapping;
    fabricBump.repeat.copy(fabricMap.repeat);

    const clothMaterial = remember(new THREE.MeshPhysicalMaterial({
      color: 0x353738,
      map: fabricMap,
      bumpMap: fabricBump,
      bumpScale: 0.035,
      roughness: 0.96,
      metalness: 0,
      sheen: 0.8,
      sheenRoughness: 0.95,
      sheenColor: 0x565b60,
      vertexColors: true
    }));
    const fiberMaterial = remember(new THREE.MeshStandardMaterial({ color: 0x26282a, roughness: 1, metalness: 0 }));

    const band = new THREE.Group();
    scene.add(band);
    // A closed cross-section produces a proper hollow cuff, including its
    // inner lining and soft top and bottom returns. No artificial cap or screen.
    const crossSection = [
      [0.91, -1.29], [0.965, -1.28], [1.005, -1.23],
      [1.022, -1.11], [1.012, -0.9], [1.005, -0.6],
      [1.008, -0.3], [1.015, 0], [1.012, 0.35],
      [1.006, 0.65], [1.016, 0.95], [1.01, 1.17],
      [0.985, 1.26], [0.94, 1.3], [0.89, 1.3],
      [0.845, 1.27], [0.817, 1.2], [0.812, 0.95],
      [0.805, 0.6], [0.805, 0], [0.805, -0.6],
      [0.812, -0.95], [0.823, -1.19], [0.85, -1.26],
      [0.91, -1.29]
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const bodyGeometry = remember(new THREE.LatheGeometry(crossSection, 112));
    const positions = bodyGeometry.attributes.position;
    const normals = bodyGeometry.attributes.normal;
    const colorValues = new Float32Array(positions.count * 3);
    for (let i = 0; i < positions.count; i++) {
      const inward = normals.getX(i) * positions.getX(i) + normals.getZ(i) * positions.getZ(i) < -0.1;
      const shade = inward ? 0.52 : 1;
      colorValues.set([shade, shade, shade], i * 3);
    }
    bodyGeometry.setAttribute('color', new THREE.BufferAttribute(colorValues, 3));
    band.add(new THREE.Mesh(bodyGeometry, clothMaterial));
    band.scale.z = 0.9;

    const loopGeometry = remember(new THREE.TorusGeometry(0.015, 0.0048, 3, 6, Math.PI * 1.85));
    const fiberCount = 2600;
    const fibers = new THREE.InstancedMesh(loopGeometry, fiberMaterial, fiberCount);
    const dummy = new THREE.Object3D();
    const outward = new THREE.Vector3();
    const axis = new THREE.Vector3(0, 0, 1);
    for (let i = 0; i < fiberCount; i++) {
      let theta = random() * Math.PI * 2;
      let height = (random() - 0.5) * 2.47;
      const wrappedTheta = Math.atan2(Math.sin(theta), Math.cos(theta));
      // The embroidery compresses the pile beneath it.
      if (Math.abs(wrappedTheta) < 0.62 && Math.abs(height - 0.12) < 0.68) theta += Math.PI;
      const radius = 1.014 + random() * 0.008;
      dummy.position.set(Math.sin(theta) * radius, height, Math.cos(theta) * radius);
      outward.set(Math.sin(theta), 0, Math.cos(theta));
      dummy.quaternion.setFromUnitVectors(axis, outward);
      dummy.rotateZ(random() * Math.PI);
      dummy.rotateX((random() - 0.5) * 0.7);
      dummy.scale.set(0.65 + random() * 0.6, 0.8 + random() * 0.7, 1);
      dummy.updateMatrix();
      fibers.setMatrixAt(i, dummy.matrix);
    }
    fibers.instanceMatrix.needsUpdate = true;
    band.add(fibers);

    const logoCanvas = makeCanvas();
    const logoContext = logoCanvas.getContext('2d');
    if (!logoContext) throw new Error('Canvas rendering unavailable');
    const logoTexture = textureFrom(logoCanvas, true);
    const logoBump = textureFrom(logoCanvas);
    function drawEmbroidery(cream) {
      const c = logoContext;
      c.clearRect(0, 0, 512, 512);
      const gradient = c.createLinearGradient(70, 30, 460, 460);
      gradient.addColorStop(0, cream ? '#b8945b' : '#e3c993');
      gradient.addColorStop(0.35, cream ? '#d2b37b' : '#f5e6bd');
      gradient.addColorStop(0.65, cream ? '#947441' : '#b59254');
      gradient.addColorStop(1, cream ? '#c3a371' : '#e3c78e');
      c.fillStyle = gradient;
      c.font = 'normal 300px Georgia, "Times New Roman", serif';
      c.textBaseline = 'alphabetic';
      c.fillText('Z', 89, 304);
      c.fillText('C', 208, 408);
      c.globalCompositeOperation = 'source-atop';
      // Close parallel silk stitches catch the key light differently.
      for (let y = 0; y < 512; y += 3) {
        c.strokeStyle = y % 6 ? 'rgba(255,249,220,.27)' : 'rgba(58,35,10,.19)';
        c.lineWidth = 0.9;
        c.beginPath(); c.moveTo(0, y); c.lineTo(512, y - 80); c.stroke();
      }
      c.globalCompositeOperation = 'source-over';
      logoTexture.needsUpdate = true;
      logoBump.needsUpdate = true;
    }
    const logoMaterial = remember(new THREE.MeshStandardMaterial({
      map: logoTexture, bumpMap: logoBump, bumpScale: 0.009,
      transparent: true, alphaTest: 0.035, depthWrite: false,
      roughness: 0.63, metalness: 0.3, side: THREE.DoubleSide
    }));
    const logoGeometry = remember(new THREE.PlaneGeometry(1.38, 1.44, 36, 12));
    const logoPositions = logoGeometry.attributes.position;
    for (let i = 0; i < logoPositions.count; i++) {
      const angle = logoPositions.getX(i) / 1.035;
      logoPositions.setXYZ(i, Math.sin(angle) * 1.038, logoPositions.getY(i) + 0.12, Math.cos(angle) * 1.038);
    }
    logoGeometry.computeVertexNormals();
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.renderOrder = 2;
    band.add(logo);

    const shadowCanvas = makeCanvas(128);
    const shadowContext = shadowCanvas.getContext('2d');
    const shadowGradient = shadowContext.createRadialGradient(64, 64, 2, 64, 64, 64);
    shadowGradient.addColorStop(0, 'rgba(0,0,0,.65)');
    shadowGradient.addColorStop(0.4, 'rgba(0,0,0,.22)');
    shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
    shadowContext.fillStyle = shadowGradient;
    shadowContext.fillRect(0, 0, 128, 128);
    const shadowTexture = textureFrom(shadowCanvas);
    const shadowMaterial = remember(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false, opacity: 0.38 }));
    const shadowGeometry = remember(new THREE.PlaneGeometry(4, 3));
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -1.62;
    scene.add(shadow);

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduce = reducedMotion.matches;
    let rotating = Boolean(autoRotate);
    let visible = true;
    let dragging = false;
    let pointerId;
    let previousPointer = { x: 0, y: 0 };
    let targetYaw = 0.36;
    let targetPitch = -0.06;
    let currentYaw = targetYaw;
    let currentPitch = targetPitch;
    let elapsed = 0;
    let previousTime = 0;

    function render(time = performance.now()) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;
      previousTime = time;
      if (rotating && !reduce && !dragging) elapsed += delta;
      const smoothing = reduce ? 1 : Math.min(1, delta * 15 || 1);
      currentYaw += (targetYaw - currentYaw) * smoothing;
      currentPitch += (targetPitch - currentPitch) * smoothing;
      const animated = rotating && !reduce && !dragging;
      band.rotation.set(currentPitch, currentYaw + (animated ? Math.sin(elapsed * 0.46) * 0.23 : 0), -0.18 + (animated ? Math.sin(elapsed * 0.38) * 0.025 : 0));
      band.position.y = animated ? Math.sin(elapsed * 0.75) * 0.055 : 0;
      renderer.render(scene, camera);
      const settling = Math.abs(currentYaw - targetYaw) + Math.abs(currentPitch - targetPitch) > 0.001;
      if (animated || settling) frame = requestAnimationFrame(render);
    }

    function requestRender() {
      if (!frame && !disposed && visible && !document.hidden) frame = requestAnimationFrame(render);
    }

    function resize() {
      if (disposed) return;
      const bounds = container.getBoundingClientRect();
      const width = Math.max(1, bounds.width);
      const height = Math.max(1, bounds.height || width * 0.9);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      // Preserve the entire cuff in narrow portrait panels as well as desktops.
      camera.fov = camera.aspect < 0.85 ? 35 : 30;
      camera.updateProjectionMatrix();
      requestRender();
    }

    function setColor(value) {
      const cream = value === 'cream' || value === 'ivory' || value === 'sand';
      clothMaterial.color.set(cream ? 0xfff0d1 : 0x35383a);
      clothMaterial.sheenColor.set(cream ? 0xfff3de : 0x62666b);
      clothMaterial.bumpScale = cream ? 0.028 : 0.035;
      fiberMaterial.color.set(cream ? 0xbdb19a : 0x292d30);
      drawEmbroidery(cream);
      canvas.setAttribute('aria-label', `${cream ? 'Cream' : 'Onyx black'} Zenith wristband in 3D. Drag or use arrow keys to rotate. Press Home to reset.`);
      requestRender();
    }
    function setAutoRotate(value) { rotating = Boolean(value); previousTime = 0; requestRender(); }
    function reset() { targetYaw = 0.36; targetPitch = -0.06; elapsed = 0; requestRender(); }

    listen(canvas, 'pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      dragging = true;
      pointerId = event.pointerId;
      previousPointer = { x: event.clientX, y: event.clientY };
      canvas.setPointerCapture?.(pointerId);
      canvas.style.cursor = 'grabbing';
      canvas.focus({ preventScroll: true });
      requestRender();
    });
    listen(canvas, 'pointermove', event => {
      if (!dragging || event.pointerId !== pointerId) return;
      const dx = event.clientX - previousPointer.x;
      const dy = event.clientY - previousPointer.y;
      targetYaw += dx * 0.009;
      targetPitch = THREE.MathUtils.clamp(targetPitch + dy * 0.006, -0.9, 0.65);
      previousPointer = { x: event.clientX, y: event.clientY };
      requestRender();
    });
    function releasePointer(event) {
      if (event.pointerId !== pointerId) return;
      dragging = false;
      if (canvas.hasPointerCapture?.(pointerId)) canvas.releasePointerCapture(pointerId);
      pointerId = undefined;
      canvas.style.cursor = 'grab';
      requestRender();
    }
    listen(canvas, 'pointerup', releasePointer);
    listen(canvas, 'pointercancel', releasePointer);
    listen(canvas, 'lostpointercapture', releasePointer);
    listen(canvas, 'keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', ' '].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') targetYaw -= 0.2;
      if (event.key === 'ArrowRight') targetYaw += 0.2;
      if (event.key === 'ArrowUp') targetPitch = Math.max(-0.9, targetPitch - 0.12);
      if (event.key === 'ArrowDown') targetPitch = Math.min(0.65, targetPitch + 0.12);
      if (event.key === 'Home') reset();
      if (event.key === ' ') rotating = !rotating;
      requestRender();
    });
    listen(document, 'visibilitychange', () => {
      previousTime = 0;
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else requestRender();
    });
    const motionChange = event => { reduce = event.matches; requestRender(); };
    if (reducedMotion.addEventListener) listen(reducedMotion, 'change', motionChange);

    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
    } else listen(window, 'resize', resize);

    if ('IntersectionObserver' in window) {
      intersectionObserver = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? true;
        previousTime = 0;
        if (visible) requestRender();
        else { cancelAnimationFrame(frame); frame = 0; }
      }, { rootMargin: '80px' });
      intersectionObserver.observe(container);
    }

    listen(canvas, 'webglcontextlost', event => {
      event.preventDefault();
      dispose();
      container.dispatchEvent(new CustomEvent('band:error'));
    });

    setColor(color);
    resize();
    cancelAnimationFrame(frame);
    frame = 0;
    render();
    container.dataset.bandReady = 'true';
    const api = { setColor, setAutoRotate, reset, dispose };
    if (typeof onReady === 'function') {
      try { onReady(api); } catch (_) { /* A host callback cannot break the viewer. */ }
    }
    return api;
  } catch (error) {
    dispose();
    container.dispatchEvent(new CustomEvent('band:error', { detail: { reason: '3D preview unavailable' } }));
    return null;
  }
}
