import { FloatingCards } from "../shared/FloatingCards";
import { heroSignals } from "@/lib/site";

// Where each card floats around the 3D logo, and how strongly it follows the pointer.
const spots = [
  { className: "right-[30%] top-[22%]", depth: 28 },
  { className: "right-[6%] top-[30%]", depth: 46 },
  { className: "right-[34%] top-[56%]", depth: 38 },
  { className: "right-[4%] top-[62%]", depth: 20 },
];

/** Live-looking AI activity cards around the home hero. */
export function HeroSignals() {
  return <FloatingCards cards={heroSignals} spots={spots} delay={850} />;
}
