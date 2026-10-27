import { LogoMark } from "./Logo";

/** Short CSS-only intro: the logo bars grow, then the curtain lifts. Content is in the HTML underneath the whole time. */
export function Preloader() {
  return (
    <div aria-hidden className="preloader pointer-events-none fixed inset-0 z-[70] flex items-center justify-center bg-ink">
      <LogoMark className="preloader-mark h-24 w-auto text-honey" />
    </div>
  );
}
