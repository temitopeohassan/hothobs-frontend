/** The pot-and-heat motif, used only where the site changes register. */
export default function SteamRule({ color = 'var(--deep)', flip = false }) {
  return (
    <svg
      className="steam"
      viewBox="0 0 1200 34"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={flip ? { transform: 'rotate(180deg)' } : undefined}
    >
      <path
        d="M0 34V16c60-10 120-14 180-6s120 12 180 2 120-16 180-8 120 14 180 6 120-14 180-8 120 12 120 12v20z"
        fill={color}
      />
    </svg>
  )
}
