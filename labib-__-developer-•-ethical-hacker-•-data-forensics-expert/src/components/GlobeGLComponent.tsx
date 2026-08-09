import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import { getAttackColor, hexToRgba } from '../utils/cyberAttackTypes';

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

interface GlobeGLProps {
  cities: City3D[];
  attacks: Attack3D[];
  autoRotate: boolean;
  selectedAttackId?: string | null;
  hoveredAttackId?: string | null;
  onSelectAttack?: (attackId: string) => void;
  hoveredCity?: string | null;
  onHoverCity?: (cityName: string | null) => void;
  focusLocation?: { lat: number; lng: number } | null;
}

export const GlobeGLComponent: React.FC<GlobeGLProps> = ({
  cities,
  attacks,
  autoRotate,
  selectedAttackId,
  hoveredAttackId,
  focusLocation,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeInstanceRef = useRef<any>(null);

  // Initialize Globe Instance on mount
  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    const globe = new Globe(containerRef.current)
      .width(width)
      .height(height)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
      .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png')
      .backgroundColor('#050811')
      .showAtmosphere(true)
      .atmosphereColor('#00F0FF')
      .atmosphereAltitude(0.18)
      // City pings/dots
      .pointsData(cities)
      .pointLat((d: any) => d.lat)
      .pointLng((d: any) => d.lng)
      .pointColor(() => '#00FF88')
      .pointAltitude(0.015)
      .pointRadius(0.55)
      .pointResolution(16)
      // City labels
      .labelsData(cities)
      .labelLat((d: any) => d.lat)
      .labelLng((d: any) => d.lng)
      .labelText((d: any) => `[${d.code}] ${d.name}`)
      .labelSize(0.85)
      .labelDotRadius(0.35)
      .labelColor(() => '#00F0FF')
      .labelResolution(2)
      // Attack vector trajectory arcs
      .arcStartLat((d: any) => d.sourceLat)
      .arcStartLng((d: any) => d.sourceLng)
      .arcEndLat((d: any) => d.targetLat)
      .arcEndLng((d: any) => d.targetLng)
      .arcDashLength(0.4)
      .arcDashGap(0.2)
      .arcDashAnimateTime(1500)
      // Target impact radar rings
      .ringLat((d: any) => d.targetLat)
      .ringLng((d: any) => d.targetLng)
      .ringMaxRadius(7)
      .ringPropagationSpeed(3)
      .ringRepeatPeriod(1000);

    // Set initial camera controls
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.2;
    }
    globe.pointOfView({ lat: 20, lng: 10, altitude: 2.2 });

    globeInstanceRef.current = globe;

    // Responsive container ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current && globeInstanceRef.current) {
          const newW = entry.contentRect.width;
          const newH = entry.contentRect.height;
          if (newW > 0 && newH > 0) {
            globeInstanceRef.current.width(newW).height(newH);
          }
        }
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
      globeInstanceRef.current = null;
    };
  }, []);

  // Update auto-rotate on prop change
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (globe && globe.controls()) {
      globe.controls().autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Smooth camera pan to focusLocation
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (globe && focusLocation) {
      globe.pointOfView(
        { lat: focusLocation.lat, lng: focusLocation.lng, altitude: 1.8 },
        1200
      );
    }
  }, [focusLocation]);

  // Update Attack Trajectories & Target Rings
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe) return;

    // Update Arcs Data
    globe.arcsData(attacks);

    // Dynamic Arc Colors matching Cyber Attack Type hex colors
    globe.arcColor((d: any) => {
      const isHighlighted = d.id === hoveredAttackId || d.id === selectedAttackId;
      const color = getAttackColor(d.type, d.severity);
      if (isHighlighted) return ['#FFFFFF', '#00F0FF'];
      return [color, color];
    });

    // Dynamic Altitude
    globe.arcAltitude((d: any) => {
      const isHighlighted = d.id === hoveredAttackId || d.id === selectedAttackId;
      return isHighlighted ? 0.38 : d.severity === 'CRITICAL' ? 0.32 : 0.22;
    });

    // Dynamic Arc Stroke Width
    globe.arcStroke((d: any) => {
      const isHighlighted = d.id === hoveredAttackId || d.id === selectedAttackId;
      return isHighlighted ? 2.5 : d.severity === 'CRITICAL' ? 1.8 : 1.2;
    });

    // Target Impact Radar Ripple Rings
    globe.ringsData(attacks);
    globe.ringColor((d: any) => {
      const isHighlighted = d.id === hoveredAttackId || d.id === selectedAttackId;
      const color = isHighlighted ? '#00F0FF' : getAttackColor(d.type, d.severity);
      return (t: number) => hexToRgba(color, 1 - t);
    });

  }, [attacks, hoveredAttackId, selectedAttackId]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden select-none bg-[#050811]">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};
