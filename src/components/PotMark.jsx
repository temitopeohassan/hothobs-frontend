export default function PotMark({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M11 6c0-2 2-2.4 2-4 1.6 1.2 1.6 3 .6 4.4M17.5 6.4c.2-1.6 1.6-2 1.6-3.4 1.4 1.2 1.4 2.8.6 3.9"
        stroke="var(--warm-gold)"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M4 11h24v3a12 12 0 0 1-1.6 6l-1.1 2a4 4 0 0 1-3.5 2h-11.6a4 4 0 0 1-3.5-2l-1.1-2A12 12 0 0 1 4 14z"
        fill="var(--warm-gold)"
      />
      <rect x="2" y="9.5" width="28" height="3" rx="1.5" fill="var(--cream)" />
    </svg>
  )
}
