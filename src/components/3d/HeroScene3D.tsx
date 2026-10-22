import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const HeroScene3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile or tablet with narrow screen
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      return mobile;
    };

    if (checkMobile()) {
      return; // Skip WebGL on mobile for buttery smooth 120fps touch experience
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf8fafc, 0.05);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lighting
    const keyLight = new THREE.DirectionalLight(0x6366f1, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);

    // Floating Study Artifacts Group
    const group = new THREE.Group();
    scene.add(group);

    // 1. Math Octahedron (Crystalline Knowledge)
    const octGeo = new THREE.OctahedronGeometry(1.2, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      roughness: 0.15,
      metalness: 0.2,
      wireframe: false,
    });
    const octahedron = new THREE.Mesh(octGeo, octMat);
    octahedron.position.set(3.2, 1.2, -1);
    group.add(octahedron);

    // Wireframe overlay for mathematical feel
    const wireGeo = new THREE.WireframeGeometry(octGeo);
    const wireMat = new THREE.LineBasicMaterial({ color: 0x818cf8, linewidth: 2 });
    const wireframe = new THREE.LineSegments(wireGeo, wireMat);
    octahedron.add(wireframe);

    // 2. Torus Knot (Data structures / Algorithmic loops)
    const torusGeo = new THREE.TorusKnotGeometry(0.7, 0.22, 64, 16);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      roughness: 0.2,
      metalness: 0.5,
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(-3.5, -0.8, -1.2);
    group.add(torusKnot);

    // 3. Floating Physics Rings (Atomic Orbital)
    const ringGeo1 = new THREE.TorusGeometry(1.6, 0.03, 16, 64);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.8,
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.position.set(-2.8, 1.8, -2);
    ring1.rotation.x = Math.PI / 3;
    group.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(1.9, 0.025, 16, 64);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.set(-2.8, 1.8, -2);
    ring2.rotation.y = Math.PI / 4;
    group.add(ring2);

    // 4. Optical Prism (Light dispersion)
    const prismGeo = new THREE.ConeGeometry(0.8, 1.4, 3);
    const prismMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      roughness: 0.1,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const prism = new THREE.Mesh(prismGeo, prismMat);
    prism.position.set(2.6, -1.8, -1.5);
    group.add(prism);

    // 5. Starfield Dust of Knowledge Particles
    const particleCount = 60;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 16;
      positions[i + 1] = (Math.random() - 0.5) * 12;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6366f1,
      size: 0.06,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse & Scroll Parallax
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let isVisible = true;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // IntersectionObserver to pause rendering when offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      if (isVisible) {
        const elapsed = clock.getElapsedTime();

        // Slow elegant rotations
        octahedron.rotation.x = elapsed * 0.3;
        octahedron.rotation.y = elapsed * 0.4;
        octahedron.position.y = 1.2 + Math.sin(elapsed * 1.5) * 0.15;

        torusKnot.rotation.x = elapsed * 0.25;
        torusKnot.rotation.y = elapsed * 0.35;
        torusKnot.position.y = -0.8 + Math.cos(elapsed * 1.8) * 0.12;

        ring1.rotation.z = elapsed * 0.4;
        ring1.rotation.x = Math.PI / 3 + Math.sin(elapsed * 0.8) * 0.1;

        ring2.rotation.z = -elapsed * 0.3;
        ring2.rotation.y = Math.PI / 4 + Math.cos(elapsed * 0.7) * 0.1;

        prism.rotation.y = elapsed * 0.5;

        // Parallax damping
        camera.position.x += (mouseX * 0.8 - camera.position.x) * 0.05;
        camera.position.y += (mouseY * 0.6 - scrollY * 0.002 - camera.position.y) * 0.05;
        camera.lookAt(0, -scrollY * 0.001, 0);

        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    const handleResize = () => {
      if (!container) return;
      if (window.innerWidth < 768) {
        setIsMobile(true);
        return;
      }
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      octGeo.dispose();
      octMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      prismGeo.dispose();
      prismMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
    };
  }, []);

  if (isMobile) {
    // Ultra-lightweight ambient gradient background for mobile phones: 0% GPU load, instant response
    return (
      <div
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-10 -left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 -right-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-75"
      aria-hidden="true"
    />
  );
};
