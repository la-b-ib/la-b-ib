import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';
import { scaleSequentialSqrt } from 'd3-scale';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
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
    const height = containerRef.current.clientHeight || 250;

    const colorScale = scaleSequentialSqrt(interpolateYlOrRd);
    const getVal = (feat: any) =>
      (feat?.properties?.GDP_MD_EST || feat?.properties?.gdp_md_est || 1) /
      Math.max(1e5, feat?.properties?.POP_EST || feat?.properties?.pop_est || 1e6);

    const globe = new Globe(containerRef.current)
      .width(width)
      .height(height)
      .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
      .backgroundImageUrl('https://unpkg.com/three-globe/example/img/night-sky.png')
      .backgroundColor('#000000')
      .showAtmosphere(true)
      .atmosphereColor('#00F0FF')
      .atmosphereAltitude(0.18)
      .lineHoverPrecision(0)
      // City pings/dots (elevated above polygons)
      .pointsData(cities)
      .pointLat((d: any) => d.lat)
      .pointLng((d: any) => d.lng)
      .pointColor(() => '#00FF88')
      .pointAltitude(0.075)
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
      // Attack vector trajectory arcs (moving lines from one place to another preserved as is)
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

    // Fetch Choropleth Countries GeoJSON (vasturiano/globe.gl choropleth-countries pattern)
    fetch('/datasets/ne_110m_admin_0_countries.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Local dataset failed');
        return res.json();
      })
      .catch(() =>
        fetch(
          'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson'
        ).then((res) => res.json())
      )
      .then((countries) => {
        if (!globeInstanceRef.current || !countries?.features) return;
        const maxVal = Math.max(...countries.features.map(getVal));
        colorScale.domain([0, maxVal]);

        globe
          .polygonsData(countries.features.filter((d: any) => d.properties.ISO_A2 !== 'AQ'))
          .polygonAltitude(0.06)
          .polygonCapColor((feat: any) => colorScale(getVal(feat)))
          .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
          .polygonStrokeColor(() => '#111')
          .polygonLabel(({ properties: d }: any) => `
            <div style="background: rgba(10, 14, 23, 0.94); border: 1px solid rgba(0, 240, 255, 0.4); padding: 8px 12px; border-radius: 8px; font-family: monospace; font-size: 11px; color: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.6); pointer-events: none;">
              <b style="color: #00F0FF; font-size: 12px;">${d.ADMIN || d.SOVEREIGNT} (${d.ISO_A2 || d.ADM0_A3 || ''}):</b><br />
              Threat / GDP Index: <i>${(getVal({ properties: d }) * 1000).toFixed(2)}</i><br/>
              Population: <i>${d.POP_EST ? (d.POP_EST / 1e6).toFixed(1) + 'M' : 'N/A'}</i>
            </div>
          `)
          .onPolygonHover((hoverD: any) => {
            globe
              .polygonAltitude((d: any) => (d === hoverD ? 0.12 : 0.06))
              .polygonCapColor((d: any) => (d === hoverD ? 'steelblue' : colorScale(getVal(d))));
          })
          .polygonsTransitionDuration(300);
      })
      .catch((err) => {
        console.warn('Unable to load choropleth countries geojson', err);
      });

    // Set initial camera controls
    const controls = globe.controls();
    if (controls) {
      controls.autoRotate = autoRotate;
      controls.autoRotateSpeed = 1.2;
      controls.enableZoom = true;
      // Restrict zoom limits with additional 10% increased zoom
      controls.minDistance = 120;
      controls.maxDistance = 198;
    }
    // Zoomed in by an additional 10% (altitude lowered to 1.03)
    globe.pointOfView({ lat: 20, lng: 10, altitude: 1.03 });

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
        { lat: focusLocation.lat, lng: focusLocation.lng, altitude: 1.35 },
        1200
      );
    }
  }, [focusLocation]);

  // Update Attack Trajectories & Target Rings
  useEffect(() => {
    const globe = globeInstanceRef.current;
    if (!globe) return;

    // Update Arcs Data (moving attack lines preserved)
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
    <div
      className="relative w-full h-full rounded-none border-0 overflow-hidden select-none bg-[#000000] [&_canvas]:!h-[250px]"
      style={{ height: '250px' }}
    >
      <div ref={containerRef} className="w-full h-full" style={{ height: '250px' }} />
    </div>
  );
};
