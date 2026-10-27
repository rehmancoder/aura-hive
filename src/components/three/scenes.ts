import type { ShapeName } from "./shapes";

/**
 * One scene per page. Sections on the page opt in with data-stage="1", "2"… and,
 * as each reaches the screen, the swarm morphs to the next shape in `shapes`.
 *
 * Every array below has one entry per stage (stage 0 = top of the page).
 */
export type Stage = { x: number; y: number; z: number; s: number };

export type SceneConfig = {
  /** Exactly six shapes; repeat the last one if the page needs fewer stages. */
  shapes: readonly [ShapeName, ShapeName, ShapeName, ShapeName, ShapeName, ShapeName];
  /** Number of stages actually used (data-stage count + 1). */
  stages: number;
  /** Show the solid gold logo bars and hexagon floor in the hero. */
  heroBars: boolean;
  /** Where the swarm sits for each stage, so it stays clear of that section's text. */
  desktop: Stage[];
  mobile: Stage[];
  /** Particle brightness per stage. */
  opacity: { desktop: number[]; mobile: number[] };
  /** Soft gold glow behind the swarm, per stage. */
  glow: number[];
  /** Slow rotation, rolling wave and upward pulse, per stage (0 = off, 1 = full). */
  spin: number[];
  wave: number[];
  pulse: number[];
};

export const scenes = {
  home: {
    shapes: ["auraShell", "hiveSphere", "signalWave", "growthColumns", "dust", "logo"],
    stages: 6,
    heroBars: true,
    desktop: [
      { x: 2.7, y: 0, z: 0, s: 0.85 },
      { x: 3.9, y: -0.2, z: 0, s: 0.85 },
      { x: 0, y: -0.3, z: -1, s: 1.05 },
      { x: -3.7, y: -1.3, z: 0, s: 0.85 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 2.9, y: 0.1, z: 0, s: 0.92 },
    ],
    mobile: [
      { x: 0, y: 0, z: 0, s: 0.8 },
      { x: 0, y: 0.6, z: -1, s: 0.72 },
      { x: 0, y: 0.4, z: -2, s: 0.7 },
      { x: 1.6, y: -2.2, z: -1, s: 0.6 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 1.2, z: 0, s: 0.75 },
    ],
    opacity: { desktop: [0.75, 1, 1, 1, 0.55, 1], mobile: [0.75, 0.55, 0.55, 0.33, 0.3, 0.55] },
    glow: [1, 0.25, 0, 0, 0, 1],
    spin: [0, 1, 0, 0, 0, 0],
    wave: [0, 0, 1, 0, 0, 0],
    pulse: [0, 0, 0, 1, 0, 0],
  },

  about: {
    shapes: ["halo", "honeycomb", "logo", "globe", "logo", "logo"],
    stages: 5,
    heroBars: false,
    desktop: [
      { x: 3.1, y: 0.1, z: 0, s: 1 },
      { x: 2.6, y: 0, z: -1.5, s: 1.05 },
      { x: 0, y: -0.2, z: -4, s: 1.35 },
      { x: -3.6, y: -0.1, z: 0, s: 0.95 },
      { x: 2.9, y: 0.1, z: 0, s: 0.92 },
    ],
    mobile: [
      { x: 0, y: 1.1, z: 0, s: 0.72 },
      { x: 0, y: 0.6, z: -2, s: 0.7 },
      { x: 0, y: 0.4, z: -3, s: 0.8 },
      { x: 0, y: 0.8, z: -2, s: 0.7 },
      { x: 0, y: 1.2, z: 0, s: 0.75 },
    ],
    opacity: { desktop: [1, 0.8, 0.45, 0.7, 1], mobile: [0.85, 0.4, 0.3, 0.45, 0.6] },
    glow: [0.8, 0.15, 0.25, 0.1, 1],
    spin: [1, 0.25, 0, 1, 0],
    wave: [0, 0, 0, 0, 0],
    pulse: [0, 0, 0, 0, 0],
  },

  services: {
    shapes: ["nineOrbs", "target", "playButton", "network", "dust", "logo"],
    stages: 6,
    heroBars: false,
    desktop: [
      { x: 3.2, y: 0, z: 0, s: 1 },
      { x: -4.1, y: -2.1, z: -1, s: 0.66 },
      { x: -4.1, y: -2.1, z: -1, s: 0.66 },
      { x: -4.1, y: -2.1, z: -1, s: 0.68 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 2.9, y: 0.1, z: 0, s: 0.92 },
    ],
    mobile: [
      { x: 0, y: 1.2, z: 0, s: 0.72 },
      { x: 0, y: 0.8, z: -2, s: 0.7 },
      { x: 0, y: 0.8, z: -2, s: 0.7 },
      { x: 0, y: 0.8, z: -2, s: 0.7 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 1.2, z: 0, s: 0.75 },
    ],
    opacity: { desktop: [1, 0.65, 0.65, 0.65, 0.5, 1], mobile: [0.85, 0.35, 0.35, 0.35, 0.3, 0.6] },
    glow: [0.7, 0.1, 0.1, 0.1, 0, 1],
    spin: [0.35, 0, 0, 0.5, 0, 0],
    wave: [0, 0, 0, 0, 0, 0],
    pulse: [0, 0, 0, 0, 0, 0],
  },

  contact: {
    shapes: ["chatBubble", "chatBubble", "dust", "logo", "logo", "logo"],
    stages: 4,
    heroBars: false,
    desktop: [
      { x: 2.6, y: -0.2, z: -3, s: 0.95 },
      { x: 3.4, y: -0.4, z: -2, s: 0.8 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 2.9, y: 0.1, z: 0, s: 0.92 },
    ],
    mobile: [
      { x: 0, y: 1.0, z: -4, s: 0.6 },
      { x: 0, y: 0.8, z: -2, s: 0.65 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 1.2, z: 0, s: 0.75 },
    ],
    opacity: { desktop: [1, 0.6, 0.5, 1], mobile: [0.3, 0.3, 0.3, 0.6] },
    glow: [0.5, 0.1, 0, 1],
    spin: [0, 0, 0, 0],
    wave: [0, 0, 0, 0],
    pulse: [0, 0, 0, 0],
  },
} satisfies Record<string, SceneConfig>;

export type SceneName = keyof typeof scenes;

/**
 * Scene for a single service page: the service's own shape in the hero, which then
 * drifts aside behind "What's included", dissolves into gold dust and becomes the logo.
 */
export function serviceScene(shape: ShapeName): SceneConfig {
  return {
    shapes: [shape, shape, "dust", "dust", "logo", "logo"],
    stages: 5,
    heroBars: false,
    desktop: [
      { x: 3.5, y: -0.15, z: 0, s: 0.86 },
      { x: 3.2, y: -0.6, z: -3, s: 0.8 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 2.9, y: 0.1, z: 0, s: 0.92 },
    ],
    mobile: [
      { x: 0, y: 1.2, z: 0, s: 0.7 },
      { x: 0, y: 0.8, z: -3, s: 0.65 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 0, z: 0, s: 1 },
      { x: 0, y: 1.2, z: 0, s: 0.75 },
    ],
    opacity: { desktop: [1, 0.45, 0.5, 0.5, 1], mobile: [0.85, 0.3, 0.3, 0.3, 0.6] },
    glow: [0.7, 0.05, 0, 0, 1],
    spin: [0.3, 0, 0, 0, 0],
    wave: [0, 0, 0, 0, 0],
    pulse: [0, 0, 0, 0, 0],
  };
}
