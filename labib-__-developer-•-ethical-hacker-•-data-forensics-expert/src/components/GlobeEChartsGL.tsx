import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts-gl';

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

interface GlobeEChartsGLProps {
  cities: City3D[];
  attacks: Attack3D[];
  autoRotate: boolean;
  selectedAttackId?: string | null;
  hoveredAttackId?: string | null;
  onSelectAttack?: (attackId: string) => void;
  hoveredCity?: string | null;
  onHoverCity?: (cityName: string | null) => void;
}

// Generate high-resolution, dark/night earth texture with glowing continents & night lights Data URL
function createDarkNightEarthDataURL(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;

  // 1. Pitch Dark Ocean Canvas
  ctx.fillStyle = '#040711';
  ctx.fillRect(0, 0, w, h);

  // 2. Tactical Lat/Lng Grid
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 3. Equirectangular coordinate converters
  const lonToX = (lon: number) => ((lon + 180) / 360) * w;
  const latToY = (lat: number) => ((90 - lat) / 180) * h;

  // 4. Accurate World Continent Polygons
  const continents: [number, number][][] = [
    // North America & Canada
    [
      [-168, 65], [-150, 70], [-130, 72], [-100, 75], [-70, 70], [-60, 55],
      [-55, 48], [-65, 44], [-75, 38], [-80, 25], [-90, 18], [-105, 20],
      [-118, 30], [-125, 48], [-140, 60], [-160, 60]
    ],
    // Central America
    [[-105, 20], [-90, 18], [-82, 9], [-77, 8], [-83, 14], [-98, 16]],
    // South America
    [
      [-77, 10], [-60, 8], [-45, 0], [-35, -10], [-38, -20], [-48, -28],
      [-58, -38], [-68, -54], [-75, -45], [-72, -30], [-80, -5]
    ],
    // Greenland
    [[-55, 60], [-40, 65], [-20, 75], [-25, 82], [-50, 82], [-70, 75]],
    // British Isles
    [[-10, 50], [0, 52], [-2, 58], [-8, 58]],
    // Europe
    [
      [-10, 36], [0, 43], [15, 44], [25, 35], [30, 42], [30, 60],
      [20, 70], [5, 60], [-5, 48]
    ],
    // Scandinavia
    [[5, 58], [15, 56], [28, 70], [18, 71], [8, 62]],
    // Africa
    [
      [-17, 33], [10, 37], [25, 32], [33, 28], [42, 12], [51, 11],
      [42, -10], [33, -34], [18, -34], [12, -18], [0, 5], [-15, 12]
    ],
    // Madagascar
    [[43, -12], [50, -14], [47, -25], [43, -24]],
    // Russia & Siberia / Northern Asia
    [
      [30, 60], [60, 55], [90, 60], [130, 70], [170, 65], [180, 68],
      [170, 55], [140, 45], [120, 50], [80, 50], [50, 50]
    ],
    // Middle East
    [[33, 28], [45, 35], [60, 25], [55, 15], [43, 12]],
    // India & South Asia
    [[68, 24], [88, 22], [80, 8], [73, 8]],
    // East Asia / China / Korea
    [[80, 45], [120, 50], [122, 30], [118, 22], [100, 20], [90, 30]],
    // Japan
    [[130, 32], [140, 36], [142, 44], [135, 34]],
    // Southeast Asia
    [[98, 20], [108, 12], [105, 2], [98, 8]],
    // Indonesia / Philippines
    [[95, -5], [118, -8], [125, 8], [115, 5]],
    // Australia
    [[113, -15], [135, -12], [150, -22], [145, -38], [115, -34]],
    // New Zealand
    [[166, -46], [178, -37], [174, -42]]
  ];

  // Draw Continent Solid Base Fill & High-Tech Glowing Borders
  ctx.fillStyle = '#0c1322';
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.8;

  continents.forEach((poly) => {
    ctx.beginPath();
    poly.forEach(([lon, lat], idx) => {
      const x = lonToX(lon);
      const y = latToY(lat);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  });

  // 5. Fine Dot-Matrix Pattern Overlay across Landmasses
  ctx.fillStyle = '#223249';
  for (let lat = -80; lat <= 80; lat += 2.5) {
    for (let lon = -180; lon <= 180; lon += 2.5) {
      const x = lonToX(lon);
      const y = latToY(lat);

      // Point-in-polygon check
      let inside = false;
      for (const poly of continents) {
        let j = poly.length - 1;
        for (let i = 0; i < poly.length; i++) {
          const [xi, yi] = [poly[i][0], poly[i][1]];
          const [xj, yj] = [poly[j][0], poly[j][1]];
          const intersect =
            yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
          if (intersect) inside = !inside;
          j = i;
        }
        if (inside) break;
      }

      if (inside) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 6. Vibrant City Night Lights / Urban Density Clusters
  const nightLights = [
    { lon: -122.4, lat: 37.7, color: '#38bdf8', r: 9 },  // SF
    { lon: -74.0, lat: 40.7, color: '#38bdf8', r: 12 },  // NYC
    { lon: -87.6, lat: 41.8, color: '#38bdf8', r: 8 },   // Chicago
    { lon: -118.2, lat: 34.0, color: '#38bdf8', r: 10 }, // LA
    { lon: -0.12, lat: 51.5, color: '#fbbf24', r: 11 },  // London
    { lon: 2.35, lat: 48.8, color: '#fbbf24', r: 9 },    // Paris
    { lon: 8.68, lat: 50.1, color: '#fbbf24', r: 9 },    // Frankfurt
    { lon: 37.6, lat: 55.7, color: '#f43f5e', r: 9 },    // Moscow
    { lon: 55.2, lat: 25.2, color: '#fbbf24', r: 8 },    // Dubai
    { lon: 72.8, lat: 19.0, color: '#2dd4bf', r: 9 },    // Mumbai
    { lon: 116.4, lat: 39.9, color: '#f43f5e', r: 10 },  // Beijing
    { lon: 121.4, lat: 31.2, color: '#f43f5e', r: 11 },  // Shanghai
    { lon: 139.6, lat: 35.6, color: '#38bdf8', r: 12 },  // Tokyo
    { lon: 126.9, lat: 37.5, color: '#38bdf8', r: 9 },   // Seoul
    { lon: 103.8, lat: 1.35, color: '#2dd4bf', r: 8 },   // Singapore
    { lon: 151.2, lat: -33.8, color: '#38bdf8', r: 9 },  // Sydney
    { lon: -46.6, lat: -23.5, color: '#fbbf24', r: 10 }, // Sao Paulo
    { lon: -58.3, lat: -34.6, color: '#fbbf24', r: 8 },  // Buenos Aires
    { lon: 31.2, lat: 30.0, color: '#2dd4bf', r: 8 },    // Cairo
  ];

  nightLights.forEach(({ lon, lat, color, r }) => {
    const x = lonToX(lon);
    const y = latToY(lat);

    const grad = ctx.createRadialGradient(x, y, 0, x, y, r * 2.5);
    grad.addColorStop(0, color);
    grad.addColorStop(0.35, color + '99');
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
    ctx.fill();
  });

  return canvas.toDataURL('image/png');
}

let cachedTextureURL: string | null = null;

export const GlobeEChartsGL: React.FC<GlobeEChartsGLProps> = ({
  cities,
  attacks,
  autoRotate,
  selectedAttackId,
  hoveredAttackId,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const container = chartRef.current;
    if (!container) return;

    if (!cachedTextureURL) {
      cachedTextureURL = createDarkNightEarthDataURL();
    }

    const chart = echarts.init(container, 'dark');
    instanceRef.current = chart;

    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = instanceRef.current;
    if (!chart || !cachedTextureURL) return;

    // Convert attacks into lines3D trajectory vectors with cyberpunk color scheme
    const linesData = attacks.map((atk) => {
      const isHighlighted =
        atk.id === hoveredAttackId || atk.id === selectedAttackId;
      return {
        id: atk.id,
        coords: [
          [atk.sourceLng, atk.sourceLat],
          [atk.targetLng, atk.targetLat],
        ],
        lineStyle: {
          color: isHighlighted
            ? '#00F0FF'
            : atk.severity === 'CRITICAL'
            ? '#FF3366'
            : atk.severity === 'HIGH'
            ? '#FFB800'
            : '#00F0FF',
          width: isHighlighted ? 4.5 : atk.severity === 'CRITICAL' ? 2.5 : 1.8,
          opacity: isHighlighted ? 1.0 : 0.85,
        },
      };
    });

    // Target Impact Ripple/Ping Nodes
    const targetPings = attacks.map((atk) => ({
      name: atk.targetCity,
      value: [atk.targetLng, atk.targetLat, 2.0],
      itemStyle: {
        color:
          atk.severity === 'CRITICAL'
            ? '#FF3366'
            : atk.severity === 'HIGH'
            ? '#FFB800'
            : '#00F0FF',
      },
    }));

    // Convert cities into scatter3D honeypot nodes
    const scatterData = cities.map((c) => ({
      name: c.name,
      code: c.code,
      value: [c.lng, c.lat, 1.5],
      itemStyle: {
        color: '#00FF88',
      },
    }));

    const option: any = {
      backgroundColor: 'transparent',
      globe: {
        show: true,
        baseColor: '#050811', // Deep Navy/Black base color matching #050811 theme
        baseTexture: cachedTextureURL,
        shading: 'color',
        atmosphere: {
          show: true,
          color: '#00F0FF',
          glowPower: 4,
          innerGlowPower: 2,
          opacity: 0.85,
        },
        light: {
          ambient: {
            intensity: 1.0,
          },
          main: {
            intensity: 0.35,
            shadow: false,
          },
        },
        viewControl: {
          autoRotate: autoRotate,
          autoRotateSpeed: 7,
          rotateSensitivity: 1,
          zoomSensitivity: 1,
          distance: 210,
          minDistance: 130,
          maxDistance: 320,
          alpha: 22,
          beta: -20,
        },
      },
      series: [
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'circle',
          symbolSize: 7,
          itemStyle: {
            color: '#00FF88',
            opacity: 0.95,
          },
          label: {
            show: true,
            formatter: (params: any) => `[${params.data.code}] ${params.name}`,
            position: 'top',
            textStyle: {
              color: '#00F0FF',
              fontSize: 10,
              fontFamily: 'monospace',
              backgroundColor: 'rgba(5, 8, 17, 0.9)',
              padding: [3, 5],
              borderRadius: 4,
              borderColor: '#1e293b',
              borderWidth: 1,
            },
          },
          data: scatterData,
        },
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'pin',
          symbolSize: 12,
          itemStyle: {
            opacity: 0.9,
          },
          data: targetPings,
        },
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          effect: {
            show: true,
            period: 2.0,
            trailLength: 0.4,
            symbol: 'arrow',
            symbolSize: 9,
          },
          blendMode: 'lighter',
          lineStyle: {
            width: 2,
            opacity: 0.85,
          },
          data: linesData,
        },
      ],
    };

    chart.setOption(option, true);
  }, [cities, attacks, autoRotate, hoveredAttackId, selectedAttackId]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-lg overflow-hidden select-none bg-[#030509]">
      <div ref={chartRef} className="w-full h-full min-h-[420px]" />

      {/* Control Overlay Badge */}
      <div className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300 flex items-center space-x-2 pointer-events-none shadow-lg">
        <i className="ri-earth-line text-teal-400"></i>
        <span>ECHARTS-GL 3D NIGHT GLOBE // VECTOR TRAJECTORY ARROWS</span>
      </div>
    </div>
  );
};
