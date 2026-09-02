import React from 'react';

interface GraphPaperBgProps {
  className?: string;
  gridSize?: number;
  majorMultiple?: number;
  lineColor?: string;
  majorLineColor?: string;
  dotColor?: string;
  opacity?: number;
}

export const GraphPaperBg: React.FC<GraphPaperBgProps> = ({
  className = '',
  gridSize = 10,
  majorMultiple = 5,
  lineColor = '#222530',
  majorLineColor = '#363b4d',
  dotColor = '#525970',
  opacity = 0.9,
}) => {
  const majorSize = gridSize * majorMultiple;

  return (
    <div
      className={`w-full h-full overflow-hidden pointer-events-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
      >
        <defs>
          {/* Minor Grid Pattern (10px dense squares) */}
          <pattern
            id="graph-grid-minor"
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={lineColor}
              strokeWidth="0.6"
              strokeOpacity="0.7"
            />
          </pattern>

          {/* Major Grid Pattern with crosshairs (50px) */}
          <pattern
            id="graph-grid-major"
            width={majorSize}
            height={majorSize}
            patternUnits="userSpaceOnUse"
          >
            {/* Fill with minor grid */}
            <rect width={majorSize} height={majorSize} fill="url(#graph-grid-minor)" />
            
            {/* Major boundary lines */}
            <path
              d={`M ${majorSize} 0 L 0 0 0 ${majorSize}`}
              fill="none"
              stroke={majorLineColor}
              strokeWidth="1.0"
              strokeOpacity="0.9"
            />
            
            {/* Intersection coordinate crosshair marker */}
            <path
              d="M -2.5 0 L 2.5 0 M 0 -2.5 L 0 2.5"
              fill="none"
              stroke={dotColor}
              strokeWidth="1.2"
            />
          </pattern>
        </defs>

        {/* Render Graph Paper Grid */}
        <rect width="100%" height="100%" fill="url(#graph-grid-major)" />
      </svg>
    </div>
  );
};
