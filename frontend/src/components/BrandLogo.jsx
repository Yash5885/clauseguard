const LOGO_SRC = "/clause-guard-logo.png";

export default function BrandLogo({ className = "", decorative = true }) {
  return (
    <img
      alt={decorative ? "" : "Clause Guard"}
      aria-hidden={decorative || undefined}
      className={`block shrink-0 object-contain ${className}`}
      draggable="false"
      src={LOGO_SRC}
    />
  );
}
