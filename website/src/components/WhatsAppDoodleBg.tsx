import React from 'react';

interface WhatsAppDoodleBgProps {
  className?: string;
  opacity?: number;
  color?: string;
}

export const WhatsAppDoodleBg: React.FC<WhatsAppDoodleBgProps> = ({
  className = '',
  opacity = 1,
  color = '#21232b',
}) => {
  return (
    <div
      className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#000000] ${className}`}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        style={{ color, opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="whatsapp-doodle-pattern"
            x="0"
            y="0"
            width="160"
            height="160"
            patternUnits="userSpaceOnUse"
          >
            {/* 1. Chat Bubble with dots */}
            <g transform="translate(15, 15)">
              <path
                d="M4 4h20a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-10l-6 5v-5H4a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="13" r="1.6" fill="currentColor" />
              <circle cx="14" cy="13" r="1.6" fill="currentColor" />
              <circle cx="20" cy="13" r="1.6" fill="currentColor" />
            </g>

            {/* 2. Paper Airplane */}
            <g transform="translate(68, 12)">
              <path
                d="M2 12l22-10-9 22-3-7-10-5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 14l12-12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>

            {/* 3. Star / Sparkle */}
            <g transform="translate(125, 15)">
              <path
                d="M10 2v16M2 10h16M4 4l12 12M16 4L4 16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>

            {/* 4. Padlock / Security */}
            <g transform="translate(15, 62)">
              <rect
                x="3"
                y="9"
                width="16"
                height="13"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <path
                d="M6 9V5a5 5 0 0 1 10 0v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
              />
              <circle cx="11" cy="15.5" r="2.0" fill="currentColor" />
            </g>

            {/* 5. Coffee Mug / Tea with steam */}
            <g transform="translate(65, 58)">
              <path
                d="M2 8h16v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V8z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <path
                d="M18 10a3 3 0 0 1 0 6h-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <path
                d="M6 2q2 3 0 5M12 2q2 3 0 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </g>

            {/* 6. Heart */}
            <g transform="translate(118, 60)">
              <path
                d="M12 5a3.5 3.5 0 0 0-5 0l-.5.5-.5-.5a3.5 3.5 0 0 0-5 5l6 7 6-7a3.5 3.5 0 0 0 0-5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 7. Camera */}
            <g transform="translate(14, 112)">
              <rect
                x="2"
                y="6"
                width="20"
                height="14"
                rx="3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <circle
                cx="12"
                cy="13"
                r="3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <path
                d="M6 6l1.5-3h9L18 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="18" cy="9" r="1.3" fill="currentColor" />
            </g>

            {/* 8. Smiley Face */}
            <g transform="translate(68, 110)">
              <circle
                cx="12"
                cy="12"
                r="10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
              />
              <circle cx="8.5" cy="9.5" r="1.6" fill="currentColor" />
              <circle cx="15.5" cy="9.5" r="1.6" fill="currentColor" />
              <path
                d="M7.5 14.5c1.2 2 7.8 2 9 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>

            {/* 9. Musical Note */}
            <g transform="translate(122, 110)">
              <circle cx="5" cy="15" r="2.8" fill="none" stroke="currentColor" strokeWidth="2.0" />
              <circle cx="16" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="2.0" />
              <path
                d="M7.5 15V4l11-3v11M7.5 7.5l11-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 10. Lightning Bolt (Filler) */}
            <g transform="translate(45, 38)">
              <path
                d="M7 1l-5 7h5l-2 7 8-9H8l4-5z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </g>

            {/* 11. Code Bracket Symbol (Filler) */}
            <g transform="translate(98, 36)">
              <path
                d="M4 2L0 6l4 4M10 2l4 4-4 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* 12. Clock (Filler) */}
            <g transform="translate(42, 92)">
              <circle cx="7" cy="7" r="6" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M7 3.5v3.5l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </g>

            {/* 13. Search Glass (Filler) */}
            <g transform="translate(100, 88)">
              <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9.5 9.5l4 4" stroke="currentColor" strokeWidth="2.0" strokeLinecap="round" />
            </g>

            {/* 14. Corner Keys & Dots for Seamless Repeat */}
            <g transform="translate(0, 0)">
              <circle cx="0" cy="0" r="1.8" fill="currentColor" />
              <circle cx="160" cy="0" r="1.8" fill="currentColor" />
              <circle cx="0" cy="160" r="1.8" fill="currentColor" />
              <circle cx="160" cy="160" r="1.8" fill="currentColor" />
              <path d="M0 0l3 3M160 0l-3 3M0 160l3-3M160 160l-3-3" stroke="currentColor" strokeWidth="1.7" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#whatsapp-doodle-pattern)" />
      </svg>
    </div>
  );
};
