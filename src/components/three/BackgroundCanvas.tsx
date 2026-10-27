"use client";

import dynamic from "next/dynamic";
import type { SceneName } from "./scenes";
import type { ShapeName } from "./shapes";

// three.js loads only in the browser, after the page's HTML and copy are already on screen.
const Experience = dynamic(() => import("./Experience"), { ssr: false, loading: () => null });

/**
 * Fixed 3D background for a page. Pick the page's particle scene from scenes.ts,
 * or pass `shape` for a service page built around one particle shape.
 */
export function BackgroundCanvas({ scene = "home", shape }: { scene?: SceneName; shape?: ShapeName }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <Experience scene={scene} shape={shape} />
    </div>
  );
}
