import type { SVGProps } from 'react';

export function SoundwaveIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className={`soundwave-icon ${props.className || ''}`}
    >
      <style jsx>{`
        .soundwave-icon line {
          animation: pulse 1.5s infinite ease-in-out;
        }
        .soundwave-icon line:nth-child(1) { animation-delay: 0s; }
        .soundwave-icon line:nth-child(2) { animation-delay: 0.2s; }
        .soundwave-icon line:nth-child(3) { animation-delay: 0.4s; }
        .soundwave-icon line:nth-child(4) { animation-delay: 0.6s; }
        .soundwave-icon line:nth-child(5) { animation-delay: 0.8s; }
        @keyframes pulse {
          0%, 100% { stroke-dasharray: 1; transform: scaleY(0.3); }
          50% { stroke-dasharray: 1; transform: scaleY(1); }
        }
      `}</style>
      <line x1="4" y1="20" x2="4" y2="4" transform-origin="center" />
      <line x1="8" y1="20" x2="8" y2="4" transform-origin="center" />
      <line x1="12" y1="20" x2="12" y2="4" transform-origin="center" />
      <line x1="16" y1="20" x2="16" y2="4" transform-origin="center" />
      <line x1="20" y1="20" x2="20" y2="4" transform-origin="center" />
    </svg>
  );
}
