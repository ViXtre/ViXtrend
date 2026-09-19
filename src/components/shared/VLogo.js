export default function VLogo({ size = 26 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id="vlt" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#a8e06a" />
          <stop offset="100%" stopColor="#26d0b2" />
        </linearGradient>
      </defs>
      <polygon
        points="4,8 27,8 50,68 73,8 96,8 58,94 42,94"
        fill="url(#vlt)"
      />
      <polygon
        points="27,8 45,8 50,24 55,8 73,8 50,56"
        fill="#1a2d4a"
        opacity=".65"
      />
    </svg>
  );
}
