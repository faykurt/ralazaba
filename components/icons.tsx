type IconProps = { className?: string };

export function SailboatIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3v11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 4c3.2 1 5.2 3.6 5.8 6.8-3.2.6-5.8-.2-5.8-.2V4Z" fill="currentColor" />
      <path
        d="M12 6.2c-2.3 1-3.8 3.1-4.2 5.4 2.3.4 4.2-.2 4.2-.2V6.2Z"
        fill="currentColor"
        opacity="0.55"
      />
      <path
        d="M3.5 16.2c1.9 1.4 3.9 1.4 5.6.5 1.4 1 3 1 4.5 0 1.9 1 3.9 1 5.6-.5-1 3-4.2 5-7.85 5S4.5 19.2 3.5 16.2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function WaveIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 14.5c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 19c1.5-2 3.5-2 5 0s3.5 2 5 0 3.5-2 5 0 3.5 2 5 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function ChartIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 20V11M10 20V4M16 20v-6M22 20H2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SunIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4.5" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M12 2v2.4M12 19.6V22M22 12h-2.4M4.4 12H2M18.8 5.2l-1.7 1.7M6.9 17.1l-1.7 1.7M18.8 18.8l-1.7-1.7M6.9 6.9 5.2 5.2" />
      </g>
    </svg>
  );
}

export function StarfishIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2 14.35 8.76 21.51 8.91 15.8 13.24 17.88 20.09 12 16 6.12 20.09 8.2 13.24 2.49 8.91 9.65 8.76Z"
        fill="currentColor"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SeashellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 18c0-6 3.6-11 8-11s8 5 8 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 7v11M8.5 8.5 10 18M15.5 8.5 14 18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function AnchorIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="5" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 9h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M12 7v13M6 12H2a10 10 0 0 0 8.5 9.9M18 12h4a10 10 0 0 1-8.5 9.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function LifebuoyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 3v5M12 16v5M3 12h5M16 12h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function RopeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3 12c2-4 4 4 6 0s4 4 6 0 4 4 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3 12c2 4 4-4 6 0s4-4 6 0 4-4 6 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function FoilBoardIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="8.5" rx="7" ry="2.6" fill="currentColor" />
      <rect x="11.3" y="10.4" width="1.4" height="7" rx="0.7" fill="currentColor" />
      <path d="M8 19.5h8l-2-2h-4l-2 2Z" fill="currentColor" opacity="0.65" />
    </svg>
  );
}

export function MarketBasketIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10h14l-1.4 9.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.8L5 10Z" fill="currentColor" />
      <path d="M8 10c0-3 1.8-5 4-5s4 2 4 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="9.5" cy="14.5" r="1" fill="white" opacity="0.85" />
      <circle cx="14.5" cy="14.5" r="1" fill="white" opacity="0.85" />
    </svg>
  );
}

export function SunglassesIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 8h4l1.3 1.4M22 8h-4l-1.3 1.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      <circle cx="7" cy="13" r="4" fill="currentColor" />
      <circle cx="17" cy="13" r="4" fill="currentColor" />
      <path d="M11 12.3c.6-.8 1.4-.8 2 0" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function SunHatIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="12" cy="15.2" rx="10" ry="2.6" fill="currentColor" />
      <path d="M7 15.2c0-3.5 2.2-6 5-6s5 2.5 5 6" fill="currentColor" opacity="0.8" />
      <ellipse cx="12" cy="9.4" rx="2.6" ry="1.3" fill="currentColor" opacity="0.8" />
    </svg>
  );
}

export function PencilIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 20l1-4.2L15.8 5a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19 4 20Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M14 7l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TrashIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M5 7h14M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-9 0 1 13a1 1 0 0 0 1 .9h8a1 1 0 0 0 1-.9l1-13"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TekneManzarasi({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 400 140"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rlz-gokyuzu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eaf6fb" />
          <stop offset="100%" stopColor="#bfe6f2" />
        </linearGradient>
        <linearGradient id="rlz-deniz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>
      <rect width="400" height="140" fill="url(#rlz-gokyuzu)" />
      <circle cx="345" cy="28" r="15" fill="#ffd97a" />
      <path
        d="M40 40q6-6 12 0"
        stroke="#0b3d5c"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <path
        d="M75 28q6-6 12 0"
        stroke="#0b3d5c"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <path d="M0 92c40-14 90 14 140 4s90-18 140-2 90 10 120-2v48H0Z" fill="#8fd3c7" opacity="0.55" />
      <path d="M0 106c50-10 100 10 160 2s100-14 140 0 60 6 100-4v40H0Z" fill="url(#rlz-deniz)" />
      <g transform="translate(250,48)">
        <path d="M20 0v48" stroke="#0b3d5c" strokeWidth="2" strokeLinecap="round" />
        <path d="M20 4c14 5 22 16 25 28-12 2-25-2-25-2V4Z" fill="#ffffff" />
        <path d="M20 10c-10 4-16 13-18 23 10 1 18-1 18-1V10Z" fill="#e7f6f3" />
        <path
          d="M-4 52c9 6 18 6 24 2 5 5 14 5 20 0 8 4 17 4 24-3-4 12-17 20-34 20S0 63-4 52Z"
          fill="#0b3d5c"
        />
      </g>
    </svg>
  );
}

export function KumsalSeridi({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 30c40-16 80 16 120 4s80-20 120-4 80 18 160 2v28H0Z" fill="#14b8a6" opacity="0.18" />
      <path d="M0 40c50-10 100 10 160 2s100-14 140 0 60 8 100-2v22H0Z" fill="#0b3d5c" opacity="0.08" />
    </svg>
  );
}
