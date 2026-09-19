import Image from 'next/image';

export default function VLogo({ size = 26 }) {
  return (
    <Image
      src="/ViX-logo.png"
      alt="ViXtrend logo"
      width={size}
      height={size}
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
      priority
    />
  );
}
