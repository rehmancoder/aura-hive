type LogoProps = {
  className?: string;
  title?: string;
};

/** Aura Hive mark: three rounded bars, traced from the brand logo. */
export function LogoMark({ className, title }: LogoProps) {
  return (
    <svg
      viewBox="0 0 470 590"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      fill="currentColor"
    >
      {title ? <title>{title}</title> : null}
      <rect x="0" y="179" width="109" height="318" rx="54.5" />
      <rect x="181" y="0" width="108" height="590" rx="54" />
      <rect x="361" y="179" width="109" height="318" rx="54.5" />
    </svg>
  );
}
