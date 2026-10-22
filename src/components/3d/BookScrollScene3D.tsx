import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { BookOpen, Sparkles, ChevronLeft, ChevronRight, RotateCw, ZoomIn } from 'lucide-react';

interface BookScrollScene3DProps {
  className?: string;
  onOpenNotesWorkspace?: () => void;
}

export const BookScrollScene3D: React.FC<BookScrollScene3DProps> = ({
  className = '',
  onOpenNotesWorkspace,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [isOpenManual, setIsOpenManual] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  // References to communicate between React state and Three.js render loop
  const animStateRef = useRef({
    scrollProgress: 0,
    targetPage: 0,
    currentPage: 0,
    mouseX: 0,
    mouseY: 0,
    manualOverride: false,
    manualProgress: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 2.2);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x818cf8, 1.5);
    fillLight.position.set(-5, 2, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 3.5, 12);
    rimLight.position.set(0, 3, -1);
    scene.add(rimLight);

    // ROOT BOOK GROUP
    const bookRoot = new THREE.Group();
    bookRoot.position.set(0, -0.1, 0);
    scene.add(bookRoot);

    // DIMENSIONS
    const bookWidth = 2.4;
    const bookHeight = 3.2;
    const bookThickness = 0.35;
    const coverThickness = 0.05;

    // PROCEDURAL TEXTURES
    const createCoverTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Leather Navy gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      // Gold ornate border
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 14;
      ctx.strokeRect(50, 50, 924, 924);

      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 4;
      ctx.strokeRect(70, 70, 884, 884);

      // Corner flourishes
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(90, 90);
      drawCorner(934, 90);
      drawCorner(90, 934);
      drawCorner(934, 934);

      // Title & Emblems
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 54px serif';
      ctx.textAlign = 'center';
      ctx.fillText('STUDYSNAP AI', 512, 280);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '600 28px sans-serif';
      ctx.fillText('ENGINEERING & SCIENCE', 512, 335);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'italic 24px serif';
      ctx.fillText('Interactive Academic Compendium', 512, 380);

      // Central Emblem
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(512, 540, 110, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 96px sans-serif';
      ctx.fillText('Σ', 512, 575);

      // Footer tag
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 22px sans-serif';
      ctx.fillText('AUTONOMOUS STUDY SYSTEM • B.TECH EDITION', 512, 860);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const createPageTexture = (pageNumber: number) => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d')!;

      // Ivory paper
      ctx.fillStyle = '#faf8f2';
      ctx.fillRect(0, 0, 1024, 1024);

      // Faint subtle ruling lines
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1.5;
      for (let y = 140; y < 940; y += 45) {
        ctx.beginPath();
        ctx.moveTo(80, y);
        ctx.lineTo(944, y);
        ctx.stroke();
      }

      // Page header
      ctx.fillStyle = '#4f46e5';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText(`MODULE ${pageNumber}: ${pageNumber === 1 ? 'CLASSICAL MECHANICS' : pageNumber === 2 ? 'DYNAMIC EQUILIBRIUM' : 'ENERGY CONSERVATION'}`, 80, 95);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 24px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`Page ${pageNumber + 12}`, 944, 95);
      ctx.textAlign = 'left';

      if (pageNumber === 1) {
        // Content for Page 1: Newton's 2nd Law
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText("Newton's Second Law of Motion", 80, 185);

        ctx.fillStyle = '#334155';
        ctx.font = '26px sans-serif';
        ctx.fillText('The rate of change of momentum of a body is directly', 80, 235);
        ctx.fillText('proportional to the applied unbalanced force.', 80, 275);

        // Highlight box for formula
        ctx.fillStyle = '#eef2ff';
        ctx.fillRect(80, 310, 864, 130);
        ctx.strokeStyle = '#6366f1';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 310, 864, 130);

        ctx.fillStyle = '#312e81';
        ctx.font = 'bold 50px serif';
        ctx.fillText('F = m · a   [1 N = 1 kg·m/s²]', 140, 390);

        // Free Body Diagram schematic
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 4;
        ctx.strokeRect(140, 490, 160, 100);
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(140, 490, 160, 100);
        ctx.fillStyle = '#0369a1';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Mass (m)', 175, 550);

        // Arrow force
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(300, 540);
        ctx.lineTo(460, 540);
        ctx.stroke();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(460, 525);
        ctx.lineTo(490, 540);
        ctx.lineTo(460, 555);
        ctx.fill();
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText('F_net', 505, 548);

        // Key exam notes
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('✓ StudySnap Key Takeaways:', 80, 680);

        ctx.fillStyle = '#334155';
        ctx.font = '24px sans-serif';
        ctx.fillText('1. Net force determines acceleration, NOT instantaneous velocity.', 110, 725);
        ctx.fillText('2. Always resolve vectors along parallel and normal inclined axes.', 110, 770);
        ctx.fillText('3. College trap: Forgetting gravity component mg·sin(θ) on ramps.', 110, 815);
      } else if (pageNumber === 2) {
        // Content for Page 2: Momentum & Collisions
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText('Conservation of Linear Momentum', 80, 185);

        ctx.fillStyle = '#334155';
        ctx.font = '26px sans-serif';
        ctx.fillText('In an isolated system (F_ext = 0), the total vector', 80, 235);
        ctx.fillText('linear momentum remains strictly conserved over time.', 80, 275);

        // Highlight box
        ctx.fillStyle = '#f0fdf4';
        ctx.fillRect(80, 310, 864, 120);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 310, 864, 120);

        ctx.fillStyle = '#065f46';
        ctx.font = 'bold 46px serif';
        ctx.fillText('Σ p_initial = Σ p_final  ⇒  m₁v₁ + m₂v₂ = const', 120, 385);

        // Elastic vs Inelastic comparison table
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(80, 480, 864, 280);
        ctx.strokeStyle = '#94a3b8';
        ctx.strokeRect(80, 480, 864, 280);

        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('Type', 110, 520);
        ctx.fillText('Momentum', 340, 520);
        ctx.fillText('Kinetic Energy', 600, 520);

        ctx.fillStyle = '#475569';
        ctx.font = '22px sans-serif';
        ctx.fillText('Elastic', 110, 580);
        ctx.fillText('Conserved (Δp = 0)', 340, 580);
        ctx.fillText('Conserved (ΔK = 0)', 600, 580);

        ctx.fillText('Inelastic', 110, 640);
        ctx.fillText('Conserved (Δp = 0)', 340, 640);
        ctx.fillText('Dissipated into Heat', 600, 640);

        ctx.fillText('Completely Inelastic', 110, 700);
        ctx.fillText('Conserved', 340, 700);
        ctx.fillText('Maximum K Loss (Stick)', 600, 700);

        ctx.fillStyle = '#6366f1';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('AI Socratic Tip: Coefficient of restitution e = -(v₂ - v₁) / (u₂ - u₁)', 80, 810);
      } else {
        // Content for Page 3: Work-Energy Theorem
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText('Work-Kinetic Energy Theorem', 80, 185);

        ctx.fillStyle = '#334155';
        ctx.font = '26px sans-serif';
        ctx.fillText('The net work done by all forces equals the change in kinetic energy:', 80, 240);

        ctx.fillStyle = '#fffbeb';
        ctx.fillRect(80, 280, 864, 120);
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 280, 864, 120);

        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 48px serif';
        ctx.fillText('W_net = ΔK = ½ m(v_f² - v_i²)', 160, 355);

        // Step by step
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('Integral Formulation:', 80, 460);

        ctx.fillStyle = '#334155';
        ctx.font = '28px serif';
        ctx.fillText('W = ∫ F · dr = ∫ m (dv/dt) · v dt = ∫ m v dv = ½ mv²', 120, 515);

        ctx.fillStyle = '#4f46e5';
        ctx.font = 'bold 26px sans-serif';
        ctx.fillText('Exam Checklist:', 80, 600);

        ctx.fillStyle = '#334155';
        ctx.font = '24px sans-serif';
        ctx.fillText('• Conservative forces depend solely on endpoints (W_closed = 0).', 110, 650);
        ctx.fillText('• Friction is non-conservative: W_fric converts mechanical energy to heat.', 110, 700);
        ctx.fillText('• Potential Energy U(x) = - ∫ F_c dx.', 110, 750);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const coverTexture = createCoverTexture();

    // BACK COVER (stationary base)
    const backCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    const coverMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.35,
      metalness: 0.25,
      bumpScale: 0.05,
    });
    const backCoverMesh = new THREE.Mesh(backCoverGeo, coverMat);
    backCoverMesh.position.set(bookWidth / 2, 0, -bookThickness / 2);
    bookRoot.add(backCoverMesh);

    // PAPER CORE BLOCK (Pages edge)
    const paperCoreGeo = new THREE.BoxGeometry(bookWidth * 0.96, bookHeight * 0.96, bookThickness - 0.06);
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xf5f3ed,
      roughness: 0.9,
    });
    const paperCoreMesh = new THREE.Mesh(paperCoreGeo, paperMat);
    paperCoreMesh.position.set(bookWidth / 2, 0, 0);
    bookRoot.add(paperCoreMesh);

    // SPINE
    const spineGeo = new THREE.CylinderGeometry(bookThickness / 2, bookThickness / 2, bookHeight, 16, 1, false, 0, Math.PI);
    const spineMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b4b,
      roughness: 0.4,
      metalness: 0.3,
    });
    const spineMesh = new THREE.Mesh(spineGeo, spineMat);
    spineMesh.rotation.y = -Math.PI / 2;
    spineMesh.rotation.z = Math.PI / 2;
    spineMesh.position.set(0, 0, 0);
    bookRoot.add(spineMesh);

    // FRONT COVER HINGE GROUP
    const frontCoverHinge = new THREE.Group();
    frontCoverHinge.position.set(0, 0, bookThickness / 2);
    bookRoot.add(frontCoverHinge);

    const frontCoverGeo = new THREE.BoxGeometry(bookWidth, bookHeight, coverThickness);
    const frontCoverFaceMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.35,
      metalness: 0.25,
    });
    const frontCoverMesh = new THREE.Mesh(frontCoverGeo, [
      coverMat,
      coverMat,
      coverMat,
      coverMat,
      frontCoverFaceMat, // front face
      coverMat, // back face
    ]);
    frontCoverMesh.position.set(bookWidth / 2, 0, 0);
    frontCoverHinge.add(frontCoverMesh);

    // DYNAMIC TURNING PAGES (3 Pages)
    const pageTextures = [createPageTexture(1), createPageTexture(2), createPageTexture(3)];
    const pageHinges: THREE.Group[] = [];

    for (let i = 0; i < 3; i++) {
      const pageHinge = new THREE.Group();
      pageHinge.position.set(0, 0, bookThickness / 2 - 0.02 - i * 0.04);
      bookRoot.add(pageHinge);

      const pageGeo = new THREE.BoxGeometry(bookWidth * 0.96, bookHeight * 0.96, 0.008);
      const pageMat = new THREE.MeshStandardMaterial({
        map: pageTextures[i],
        roughness: 0.75,
      });

      const pageMesh = new THREE.Mesh(pageGeo, [
        paperMat,
        paperMat,
        paperMat,
        paperMat,
        pageMat,
        paperMat,
      ]);
      pageMesh.position.set((bookWidth * 0.96) / 2, 0, 0);
      pageHinge.add(pageMesh);
      pageHinges.push(pageHinge);
    }

    // FLOATING MATHEMATICAL / ENGINEERING GLYPHS AROUND THE BOOK
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const glyphGeos = [
      new THREE.IcosahedronGeometry(0.12, 0),
      new THREE.OctahedronGeometry(0.14, 0),
      new THREE.TetrahedronGeometry(0.13, 0),
      new THREE.TorusGeometry(0.14, 0.03, 8, 16),
    ];
    const glyphMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    const glyphMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const geo = glyphGeos[i % glyphGeos.length];
      const mesh = new THREE.Mesh(geo, glyphMat);
      const angle = (i / 14) * Math.PI * 2;
      const radius = 2.2 + Math.random() * 1.0;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 3,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 0.5
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      particleGroup.add(mesh);
      glyphMeshes.push(mesh);
    }

    // SCROLL LISTENER FOR SECTION
    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Calculate progress while element moves through viewport
      const start = windowHeight;
      const end = -rect.height;
      const current = rect.top;
      const rawProgress = (start - current) / (start - end);
      const clamped = Math.max(0, Math.min(1, rawProgress));

      animStateRef.current.scrollProgress = clamped;
      setScrollPercent(Math.round(clamped * 100));

      if (!animStateRef.current.manualOverride) {
        if (clamped < 0.25) {
          animStateRef.current.targetPage = 0;
          setActivePageIndex(0);
        } else if (clamped < 0.55) {
          animStateRef.current.targetPage = 1;
          setActivePageIndex(1);
        } else if (clamped < 0.82) {
          animStateRef.current.targetPage = 2;
          setActivePageIndex(2);
        } else {
          animStateRef.current.targetPage = 3;
          setActivePageIndex(3);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // MOUSE PARALLAX
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      animStateRef.current.mouseX = x;
      animStateRef.current.mouseY = y;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // RESIZE OBSERVER
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    let currentOpenAngle = 0;
    let pageAngles = [0, 0, 0];

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      const scrollProg = animStateRef.current.scrollProgress;
      const targetP = animStateRef.current.manualOverride
        ? animStateRef.current.targetPage
        : animStateRef.current.targetPage;

      // Determine Target Cover Open Angle (0 to -Math.PI * 0.95)
      const shouldBeOpen = targetP > 0 || scrollProg > 0.15;
      const targetCoverAngle = shouldBeOpen ? -Math.PI * 0.92 : 0;
      currentOpenAngle = THREE.MathUtils.lerp(currentOpenAngle, targetCoverAngle, delta * 3.5);
      frontCoverHinge.rotation.y = currentOpenAngle;

      // Sequential Page Flipping
      for (let i = 0; i < 3; i++) {
        const isFlipped = targetP > i + 1;
        const targetPageAngle = isFlipped ? -Math.PI * 0.88 + i * 0.03 : 0;
        pageAngles[i] = THREE.MathUtils.lerp(pageAngles[i], targetPageAngle, delta * 4.0);
        pageHinges[i].rotation.y = pageAngles[i];
      }

      // Root Book Posture & Elevation
      const targetRotationY = -0.45 + (scrollProg - 0.5) * 0.6 + animStateRef.current.mouseX * 0.25;
      const targetRotationX = 0.35 + animStateRef.current.mouseY * 0.2;
      const targetPosY = -0.1 + Math.sin(elapsed * 1.5) * 0.05;

      bookRoot.rotation.y = THREE.MathUtils.lerp(bookRoot.rotation.y, targetRotationY, delta * 3.0);
      bookRoot.rotation.x = THREE.MathUtils.lerp(bookRoot.rotation.x, targetRotationX, delta * 3.0);
      bookRoot.position.y = THREE.MathUtils.lerp(bookRoot.position.y, targetPosY, delta * 4.0);

      // Rotate floating glyphs
      particleGroup.rotation.y = elapsed * 0.15;
      glyphMeshes.forEach((mesh, idx) => {
        mesh.rotation.x += delta * (0.4 + idx * 0.05);
        mesh.rotation.y += delta * (0.3 + idx * 0.04);
        mesh.position.y += Math.sin(elapsed * 2 + idx) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);

      // Dispose Three.js objects
      backCoverGeo.dispose();
      frontCoverGeo.dispose();
      paperCoreGeo.dispose();
      spineGeo.dispose();
      coverMat.dispose();
      paperMat.dispose();
      spineMat.dispose();
      coverTexture.dispose();
      pageTextures.forEach((t) => t.dispose());
      glyphGeos.forEach((g) => g.dispose());
      glyphMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const handleNextPage = () => {
    animStateRef.current.manualOverride = true;
    const next = Math.min(3, activePageIndex + 1);
    setActivePageIndex(next);
    animStateRef.current.targetPage = next;
  };

  const handlePrevPage = () => {
    animStateRef.current.manualOverride = true;
    const prev = Math.max(0, activePageIndex - 1);
    setActivePageIndex(prev);
    animStateRef.current.targetPage = prev;
  };

  const handleToggleCover = () => {
    animStateRef.current.manualOverride = true;
    if (activePageIndex === 0) {
      setActivePageIndex(1);
      animStateRef.current.targetPage = 1;
    } else {
      setActivePageIndex(0);
      animStateRef.current.targetPage = 0;
    }
  };

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50 dark:from-slate-900/80 dark:via-slate-950 dark:to-slate-900 p-4 sm:p-6 shadow-xl ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Canvas Container */}
      <div
        ref={mountRef}
        className="w-full h-[400px] sm:h-[480px] lg:h-[540px] cursor-grab active:cursor-grabbing relative"
      />

      {/* Floating 3D HUD & Controls */}
      <div className="absolute top-6 left-6 right-6 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-slate-800 dark:text-slate-200">
            3D Interactive Curriculum Book
          </span>
          <span className="text-slate-400 dark:text-slate-500">|</span>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
            Scroll to Flip Pages
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-xs">
          <span className="text-slate-500 dark:text-slate-400">Viewport Scroll:</span>
          <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
            {scrollPercent}%
          </span>
        </div>
      </div>

      {/* Bottom Interactive Toolbar */}
      <div className="mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleCover}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-xs"
          >
            {activePageIndex === 0 ? '📖 Open Textbook' : '📕 Close Cover'}
          </button>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={activePageIndex === 0}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
              {activePageIndex === 0 ? 'Cover' : `Page ${activePageIndex} of 3`}
            </span>
            <button
              type="button"
              onClick={handleNextPage}
              disabled={activePageIndex === 3}
              className="p-1 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 transition-colors"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action Button */}
        {onOpenNotesWorkspace && (
          <button
            type="button"
            onClick={onOpenNotesWorkspace}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Transform These Notes With AI</span>
          </button>
        )}
      </div>
    </div>
  );
};
