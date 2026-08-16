import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface City3D {
  name: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
}

export interface Attack3D {
  id: string;
  sourceCity: string;
  sourceLat: number;
  sourceLng: number;
  targetCity: string;
  targetLat: number;
  targetLng: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  type: string;
}

interface Globe3DProps {
  cities: City3D[];
  attacks: Attack3D[];
  autoRotate: boolean;
  onSelectAttack?: (attackId: string) => void;
  hoveredCity?: string | null;
  onHoverCity?: (cityName: string | null) => void;
}

// Convert Lat/Lng to 3D Cartesian coordinates on sphere of radius R
export function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export const Globe3D: React.FC<Globe3DProps> = ({
  cities,
  attacks,
  autoRotate,
  hoveredCity,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const globeGroupRef = useRef<THREE.Group | null>(null);
  const arcsGroupRef = useRef<THREE.Group | null>(null);
  const particlesGroupRef = useRef<THREE.Group | null>(null);

  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 400;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 20, 210);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x2dd4bf, 2.5);
    dirLight1.position.set(150, 100, 150);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf43f5e, 1.5);
    dirLight2.position.set(-150, -100, -150);
    scene.add(dirLight2);

    // GLOBE GROUP
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);
    globeGroupRef.current = globeGroup;

    const radius = 60;

    // Inner Dark Core Sphere
    const sphereGeo = new THREE.SphereGeometry(radius - 0.2, 64, 64);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x050914,
      emissive: 0x030712,
      shininess: 25,
      transparent: true,
      opacity: 0.96,
    });
    const coreSphere = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(coreSphere);

    // Outer Atmosphere Wireframe / Grid
    const gridGeo = new THREE.SphereGeometry(radius, 36, 18);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.25,
    });
    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    globeGroup.add(gridMesh);

    // Atmosphere Glow Outer Shell
    const atmoGeo = new THREE.SphereGeometry(radius + 2.5, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x2dd4bf,
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // DOTTED CONTINENTS SAMPLING
    const dotsCount = 2800;
    const dotPositions: number[] = [];
    const dotColors: number[] = [];
    const baseColor = new THREE.Color(0x334155);

    // Fibonacci sphere distribution with landmass mask simulation
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    for (let i = 0; i < dotsCount; i++) {
      const theta = (2 * Math.PI * i) / goldenRatio;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / dotsCount);

      const lat = 90 - (phi * 180) / Math.PI;
      const lng = (theta * 180) / Math.PI - 180;

      // Approximate landmass filter logic (simplified continents check)
      const isLand =
        (lat > 10 && lat < 70 && lng > -160 && lng < -50) || // North America
        (lat > -55 && lat < 12 && lng > -82 && lng < -34) || // South America
        (lat > 35 && lat < 70 && lng > -10 && lng < 40) || // Europe
        (lat > -35 && lat < 37 && lng > -18 && lng < 52) || // Africa
        (lat > 5 && lat < 75 && lng > 40 && lng < 180) || // Asia
        (lat > -45 && lat < -10 && lng > 110 && lng < 155); // Australia

      if (isLand) {
        const pt = latLngToVector3(lat, lng, radius + 0.3);
        dotPositions.push(pt.x, pt.y, pt.z);
        dotColors.push(baseColor.r, baseColor.g, baseColor.b);
      }
    }

    const dotsGeo = new THREE.BufferGeometry();
    dotsGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
    dotsGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));

    const dotsMat = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
    });
    const dotsMesh = new THREE.Points(dotsGeo, dotsMat);
    globeGroup.add(dotsMesh);

    // CITY MARKERS & GLOW PULSE RINGS
    const cityGroup = new THREE.Group();
    globeGroup.add(cityGroup);

    cities.forEach((c) => {
      const pos = latLngToVector3(c.lat, c.lng, radius + 0.5);

      // Node marker point
      const nodeGeo = new THREE.SphereGeometry(0.8, 12, 12);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.copy(pos);
      cityGroup.add(nodeMesh);

      // Node ring
      const ringGeo = new THREE.RingGeometry(1.0, 1.8, 16);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x2dd4bf, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(0, 0, 0);
      cityGroup.add(ringMesh);
    });

    // ARCS & PARTICLES GROUP
    const arcsGroup = new THREE.Group();
    globeGroup.add(arcsGroup);
    arcsGroupRef.current = arcsGroup;

    const particlesGroup = new THREE.Group();
    globeGroup.add(particlesGroup);
    particlesGroupRef.current = particlesGroup;

    // INTERACTION MOUSE DRAG ROTATION
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !globeGroupRef.current) return;

      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      globeGroupRef.current.rotation.y += deltaX * 0.005;
      globeGroupRef.current.rotation.x += deltaY * 0.005;

      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const delta = clock.getDelta();

      // Auto rotation when enabled and user not dragging
      if (autoRotate && !isDragging.current && globeGroupRef.current) {
        globeGroupRef.current.rotation.y += delta * 0.15;
      }

      // Animate traveling attack particles along Bezier arcs
      if (particlesGroupRef.current) {
        particlesGroupRef.current.children.forEach((child) => {
          const particle = child as THREE.Mesh & {
            userData: { curve: THREE.CubicBezierCurve3; progress: number; speed: number; arrowMesh?: THREE.Mesh };
          };
          if (particle.userData && particle.userData.curve) {
            particle.userData.progress = (particle.userData.progress + delta * particle.userData.speed) % 1.0;
            const p = particle.userData.curve.getPoint(particle.userData.progress);
            particle.position.copy(p);

            // Orient arrow vector in direction of curve tangent
            if (particle.userData.arrowMesh) {
              const tangent = particle.userData.curve.getTangent(particle.userData.progress);
              const targetPt = p.clone().add(tangent);
              particle.userData.arrowMesh.lookAt(targetPt);
            }
          }
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domElem.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (container.contains(domElem)) {
        container.removeChild(domElem);
      }
      renderer.dispose();
    };
  }, []);

  // UPDATE 3D TRAJECTORY ARCS WHEN ATTACKS CHANGE
  useEffect(() => {
    const arcsGroup = arcsGroupRef.current;
    const particlesGroup = particlesGroupRef.current;
    if (!arcsGroup || !particlesGroup) return;

    // Clear previous dynamic arcs
    while (arcsGroup.children.length > 0) {
      const child = arcsGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      arcsGroup.remove(child);
    }
    while (particlesGroup.children.length > 0) {
      const child = particlesGroup.children[0] as THREE.Mesh;
      if (child.geometry) child.geometry.dispose();
      particlesGroup.remove(child);
    }

    const radius = 60;

    attacks.forEach((atk) => {
      const vSource = latLngToVector3(atk.sourceLat, atk.sourceLng, radius + 0.5);
      const vTarget = latLngToVector3(atk.targetLat, atk.targetLng, radius + 0.5);

      const distance = vSource.distanceTo(vTarget);
      const maxAltitude = Math.min(distance * 0.45, 32);

      // Midpoint pulled outward along normal to create 3D ballistic trajectory arc
      const vMid = vSource.clone().add(vTarget).multiplyScalar(0.5);
      const midNormal = vMid.clone().normalize();
      const vControl1 = vSource.clone().add(midNormal.clone().multiplyScalar(maxAltitude * 0.7));
      const vControl2 = vTarget.clone().add(midNormal.clone().multiplyScalar(maxAltitude * 0.7));

      const curve = new THREE.CubicBezierCurve3(vSource, vControl1, vControl2, vTarget);
      const points = curve.getPoints(50);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);

      const colorHex =
        atk.severity === 'CRITICAL' ? 0xf43f5e : atk.severity === 'HIGH' ? 0xfbbf24 : 0x2dd4bf;

      const arcMat = new THREE.LineDashedMaterial({
        color: colorHex,
        dashSize: 2,
        gapSize: 1,
        transparent: true,
        opacity: 0.7,
      });
      const line = new THREE.Line(arcGeo, arcMat);
      line.computeLineDistances();
      arcsGroup.add(line);

      // TRAVELING ARROWHEAD VECTOR
      const arrowGeo = new THREE.ConeGeometry(1.2, 3.5, 8);
      arrowGeo.rotateX(Math.PI / 2); // Orient cone along Z axis
      const arrowMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const arrowMesh = new THREE.Mesh(arrowGeo, arrowMat);

      const particleGroup = new THREE.Group() as THREE.Group & {
        userData: { curve: THREE.CubicBezierCurve3; progress: number; speed: number; arrowMesh: THREE.Mesh };
      };
      particleGroup.add(arrowMesh);

      particleGroup.userData = {
        curve,
        progress: Math.random(),
        speed: atk.severity === 'CRITICAL' ? 0.8 : atk.severity === 'HIGH' ? 0.6 : 0.45,
        arrowMesh,
      };

      particlesGroup.add(particleGroup);
    });
  }, [attacks]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-lg overflow-hidden cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full min-h-[420px]" />
      
      {/* Overlay Hint */}
      <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center space-x-2 pointer-events-none">
        <i className="ri-drag-move-fill text-teal-400"></i>
        <span>DRAG TO ROTATE 3D GLOBE</span>
      </div>
    </div>
  );
};
