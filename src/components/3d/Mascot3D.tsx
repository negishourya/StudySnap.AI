import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Mascot3DProps {
  state?: 'idle' | 'thinking' | 'happy' | 'celebrating' | 'confused';
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
}

export const Mascot3D: React.FC<Mascot3DProps> = ({
  state = 'idle',
  size = 'medium',
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || (size === 'small' ? 140 : size === 'large' ? 320 : 220);
    const height = container.clientHeight || (size === 'small' ? 140 : size === 'large' ? 320 : 220);

    // Software WebGL detection per skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Scene setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 0.2, 3.2);

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl && !isMobile,
      powerPreference: 'default',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isMobile || isSoftwareGl ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(2, 4, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.2);
    fillLight.position.set(-3, -1, 1);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xeef2ff, 0x4f46e5, 0.8);
    scene.add(hemiLight);

    // Mascot Group (Composite 8-part procedural model)
    const mascotGroup = new THREE.Group();
    scene.add(mascotGroup);

    // 1. Torso / Main Body (Smooth rounded cylinder/sphere blend)
    const bodyGeo = new THREE.SphereGeometry(0.75, 32, 28);
    bodyGeo.scale(1, 0.95, 0.85);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.18,
      metalness: 0.08,
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    mascotGroup.add(bodyMesh);

    // 2. Visor Screen (Recessed dark glossy curved screen)
    const visorGeo = new THREE.SphereGeometry(0.58, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.45);
    visorGeo.rotateX(Math.PI / 2);
    visorGeo.scale(1, 0.65, 0.6);
    const visorMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.8,
    });
    const visorMesh = new THREE.Mesh(visorGeo, visorMat);
    visorMesh.position.set(0, 0.08, 0.38);
    mascotGroup.add(visorMesh);

    // 3. Left & Right Eyes (Emissive luminous lenses)
    const eyeGeo = new THREE.CapsuleGeometry(0.085, 0.14, 16, 16);
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x60a5fa,
      emissive: 0x38bdf8,
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.22, 0.1, 0.66);
    leftEye.rotation.z = 0.05;
    mascotGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat.clone());
    rightEye.position.set(0.22, 0.1, 0.66);
    rightEye.rotation.z = -0.05;
    mascotGroup.add(rightEye);

    // 4. Floating Antenna Node on Head
    const antennaStemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.22, 12);
    const antennaStemMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.6 });
    const stem = new THREE.Mesh(antennaStemGeo, antennaStemMat);
    stem.position.set(0, 0.82, 0);
    mascotGroup.add(stem);

    const beaconGeo = new THREE.SphereGeometry(0.09, 16, 16);
    const beaconMat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 2.5,
      roughness: 0.1,
    });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 0.94, 0);
    mascotGroup.add(beacon);

    // 5. Left & Right Ear Fins / Audio Sensor Nodes
    const earGeo = new THREE.TorusGeometry(0.18, 0.04, 16, 24);
    const earMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.25, metalness: 0.4 });

    const leftEar = new THREE.Mesh(earGeo, earMat);
    leftEar.position.set(-0.76, 0.05, 0);
    leftEar.rotation.y = Math.PI / 2;
    mascotGroup.add(leftEar);

    const rightEar = new THREE.Mesh(earGeo, earMat);
    rightEar.position.set(0.76, 0.05, 0);
    rightEar.rotation.y = Math.PI / 2;
    mascotGroup.add(rightEar);

    // 6. Orbital Halo Ring (representing AI learning cycle)
    const haloGeo = new THREE.TorusGeometry(1.05, 0.022, 16, 64);
    const haloMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 1.0,
      transparent: true,
      opacity: 0.75,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.rotation.x = Math.PI / 2.6;
    mascotGroup.add(halo);

    // Mouse tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = Math.max(-0.6, Math.min(0.6, x * 0.5));
      mouse.targetY = Math.max(-0.4, Math.min(0.4, y * 0.4));
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const currentState = stateRef.current;

      // Base Floating Motion
      let floatY = Math.sin(elapsed * 2.2) * 0.09;
      let targetRotY = mouse.x * 0.7;
      let targetRotX = -mouse.y * 0.6;
      let targetScale = 1;

      // Reactions based on Tutor state
      if (currentState === 'thinking') {
        floatY = Math.sin(elapsed * 4) * 0.05;
        halo.rotation.z += 0.06;
        halo.rotation.y += 0.02;
        targetRotY += Math.sin(elapsed * 3) * 0.2;
        // Pulse eye emissive
        const pulse = 1.2 + Math.sin(elapsed * 6) * 1.0;
        (eyeMat as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
        (eyeMat as THREE.MeshStandardMaterial).emissive.setHex(0xf59e0b); // amber
      } else if (currentState === 'happy' || currentState === 'celebrating') {
        floatY = Math.abs(Math.sin(elapsed * 5)) * 0.16; // joyful bounce
        targetRotZ = Math.sin(elapsed * 4) * 0.12;
        halo.rotation.z += 0.04;
        (eyeMat as THREE.MeshStandardMaterial).emissive.setHex(0x22c55e); // bright green
        (eyeMat as THREE.MeshStandardMaterial).emissiveIntensity = 2.4;
      } else if (currentState === 'confused') {
        targetRotZ = 0.22; // quizzical head tilt
        (eyeMat as THREE.MeshStandardMaterial).emissive.setHex(0xec4899); // pink
        (eyeMat as THREE.MeshStandardMaterial).emissiveIntensity = 1.6;
      } else {
        // Idle
        halo.rotation.z += 0.012;
        (eyeMat as THREE.MeshStandardMaterial).emissive.setHex(0x38bdf8); // sky cyan
        (eyeMat as THREE.MeshStandardMaterial).emissiveIntensity = 1.8;
      }

      var targetRotZ = (currentState === 'happy' || currentState === 'celebrating')
        ? Math.sin(elapsed * 4) * 0.12
        : currentState === 'confused'
        ? 0.22
        : 0;

      mascotGroup.position.y = floatY;
      mascotGroup.rotation.y += (targetRotY - mascotGroup.rotation.y) * 0.1;
      mascotGroup.rotation.x += (targetRotX - mascotGroup.rotation.x) * 0.1;
      mascotGroup.rotation.z += (targetRotZ - mascotGroup.rotation.z) * 0.1;

      // Beacon breathing glow
      beaconMat.emissiveIntensity = 1.5 + Math.sin(elapsed * 3.5) * 1.2;

      if (isVisible) {
        renderer.render(scene, camera);
      }
      animId = requestAnimationFrame(animate);
    };

    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    animId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
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
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeo.dispose();
      bodyMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      eyeGeo.dispose();
      eyeMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
    };
  }, [size, interactive]);

  const sizeClasses =
    size === 'small'
      ? 'w-32 h-32 md:w-36 md:h-36'
      : size === 'large'
      ? 'w-64 h-64 md:w-80 md:h-80'
      : 'w-48 h-48 md:w-56 md:h-56';

  return (
    <div className={`relative flex items-center justify-center ${sizeClasses} select-none`}>
      <div ref={mountRef} className="w-full h-full" />
      {/* Subtle contact shadow under floating mascot */}
      <div className="absolute -bottom-2 w-28 h-4 bg-indigo-500/15 rounded-full blur-md pointer-events-none" />
    </div>
  );
};
