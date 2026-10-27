/**
 * Point-cloud generators for the particle swarm. Each generator returns one point;
 * a scene (see scenes.ts) picks six of them, and the shader morphs point i of one
 * shape into point i of the next as the visitor scrolls.
 */

export const BAR = { R: 0.42, SIDE_H: 2.45, CENTER_H: 4.54, GAP: 1.39 };

// Bars exactly as the hero mesh places them.
const bars = [
  { x: -BAR.GAP, bottom: 0.965, h: BAR.SIDE_H },
  { x: 0, bottom: 0.25, h: BAR.CENTER_H },
  { x: BAR.GAP, bottom: 0.965, h: BAR.SIDE_H },
];

type Rand = () => number;
type Vec = readonly [number, number, number];

function rng(seed: number): Rand {
  let s = seed % 2147483647;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function unitVector(r: Rand): Vec {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), u, s * Math.sin(t)];
}

function onCapsule(r: Rand, bar: (typeof bars)[number], radius: number): Vec {
  const L = bar.h - 2 * BAR.R;
  if (r() < L / (L + 2 * radius)) {
    const a = r() * Math.PI * 2;
    return [bar.x + Math.cos(a) * radius, bar.bottom + BAR.R + r() * L, Math.sin(a) * radius];
  }
  const v = unitVector(r);
  const cy = v[1] > 0 ? bar.bottom + bar.h - BAR.R : bar.bottom + BAR.R;
  return [bar.x + v[0] * radius, cy + v[1] * radius, v[2] * radius];
}

function pickBar(r: Rand) {
  // Weight by height so density is even across bars.
  const x = r() * (BAR.SIDE_H * 2 + BAR.CENTER_H);
  if (x < BAR.SIDE_H) return bars[0];
  if (x < BAR.SIDE_H + BAR.CENTER_H) return bars[1];
  return bars[2];
}

/** Rotate a point around x (tilt), then around y (yaw). */
function orient(x: number, y: number, z: number, tilt: number, yaw: number): Vec {
  const y1 = y * Math.cos(tilt) - z * Math.sin(tilt);
  const z1 = y * Math.sin(tilt) + z * Math.cos(tilt);
  const x2 = x * Math.cos(yaw) + z1 * Math.sin(yaw);
  const z2 = -x * Math.sin(yaw) + z1 * Math.cos(yaw);
  return [x2, y1, z2];
}

const CY = 2.4; // vertical centre of the logo

// Fixed node layout for the network shape: points on a flattened sphere, each linked to its two nearest neighbours.
const NODES: Vec[] = (() => {
  const r = rng(98765);
  return Array.from({ length: 24 }, () => {
    const v = unitVector(r);
    const k = 1.6 + r() * 1.3;
    return [v[0] * k * 1.25, CY + v[1] * k * 0.85, v[2] * k * 0.6] as Vec;
  });
})();
const EDGES: [number, number][] = (() => {
  const out: [number, number][] = [];
  NODES.forEach((p, i) => {
    const near = NODES.map((q, j) => ({ j, d: Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) }))
      .filter((x) => x.j !== i)
      .sort((x, y) => x.d - y.d)
      .slice(0, 2);
    near.forEach(({ j }) => out.push([i, j]));
  });
  return out;
})();

export const generators = {
  /** Loose shell hugging the logo bars (home hero). */
  auraShell(r: Rand): Vec {
    if (r() < 0.78) {
      const p = onCapsule(r, pickBar(r), BAR.R * 1.35);
      const j = unitVector(r);
      const k = 0.08 + r() * 0.35;
      return [p[0] + j[0] * k, p[1] + j[1] * k, p[2] + j[2] * k];
    }
    const j = unitVector(r);
    const k = 2.2 + r() * 3.5;
    return [j[0] * k, CY + j[1] * k * 0.8, j[2] * k * 0.6];
  },

  /** Sphere with three orbit rings (the AI hive). */
  hiveSphere(r: Rand): Vec {
    if (r() < 0.74) {
      const v = unitVector(r);
      const rad = 2.35 + (r() - 0.5) * 0.08;
      return [v[0] * rad, CY + v[1] * rad, v[2] * rad];
    }
    const ring = Math.floor(r() * 3);
    const a = r() * Math.PI * 2;
    const rad = 3.25 + ring * 0.42 + (r() - 0.5) * 0.06;
    const p = orient(Math.cos(a) * rad, 0, Math.sin(a) * rad, [0.35, -0.55, 1.15][ring], [0.2, 1.3, -0.9][ring]);
    return [p[0], CY + p[1], p[2]];
  },

  /** Wide rolling wave (services). */
  signalWave(r: Rand): Vec {
    const x = (r() - 0.5) * 22;
    const z = -5 + r() * 6.5;
    const y = 1.6 + 0.6 * Math.sin(0.55 * x + 0.9 * z) + 0.28 * Math.sin(1.3 * x - 0.4 * z);
    return [x, y, z];
  },

  /** Rising columns on an arc (growth). */
  growthColumns(r: Rand): Vec {
    const cols = 7;
    const c = Math.min(cols - 1, Math.floor(r() * cols));
    const a = -0.75 + (c / (cols - 1)) * 1.5;
    const cx = Math.sin(a) * 3.1;
    const cz = -Math.cos(a) * 1.6 + 0.6;
    const h = 0.7 + c * 0.62;
    const ang = r() * Math.PI * 2;
    const rad = 0.3 * Math.sqrt(r()) + 0.06;
    const top = r() < 0.18;
    return [cx + Math.cos(ang) * rad, top ? h + r() * 0.06 : r() * h, cz + Math.sin(ang) * rad];
  },

  /** Calm wide field of motes. */
  dust(r: Rand): Vec {
    return [(r() - 0.5) * 26, -3 + r() * 10, -8 + r() * 9];
  },

  /** The three logo bars, crisp. */
  logo(r: Rand): Vec {
    return onCapsule(r, pickBar(r), BAR.R * (0.96 + r() * 0.06));
  },

  /** Concentric tilted rings around an empty centre, like a halo or aura. */
  halo(r: Rand): Vec {
    const roll = r();
    if (roll < 0.12) {
      // faint inner glow
      const v = unitVector(r);
      const k = Math.pow(r(), 2) * 1.1;
      return [v[0] * k, CY + v[1] * k, v[2] * k];
    }
    const ring = Math.floor(r() * 4);
    const a = r() * Math.PI * 2;
    const rad = 1.7 + ring * 0.62 + (r() - 0.5) * (0.06 + ring * 0.05);
    const p = orient(Math.cos(a) * rad, (r() - 0.5) * 0.08, Math.sin(a) * rad, [1.25, 1.05, 1.45, 0.85][ring], [0, 0.5, -0.45, 0.9][ring]);
    return [p[0], CY + p[1], p[2]];
  },

  /** Flat honeycomb of hexagon outlines, gently curved toward the viewer. */
  honeycomb(r: Rand): Vec {
    const size = 0.78;
    // pick a cell inside a rough circle
    let q = 0;
    let s = 0;
    let cx = 0;
    let cy = 0;
    for (let tries = 0; tries < 20; tries++) {
      q = Math.floor(r() * 11) - 5;
      s = Math.floor(r() * 9) - 4;
      cx = Math.sqrt(3) * size * (q + s / 2);
      cy = 1.5 * size * s;
      if (Math.hypot(cx * 0.8, cy) < 3.6) break;
    }
    const edge = Math.floor(r() * 6);
    const t = r();
    const a0 = (Math.PI / 3) * edge + Math.PI / 6;
    const a1 = a0 + Math.PI / 3;
    const ex = Math.cos(a0) * size * (1 - t) + Math.cos(a1) * size * t;
    const ey = Math.sin(a0) * size * (1 - t) + Math.sin(a1) * size * t;
    const x = cx + ex * 0.94;
    const y = cy + ey * 0.94;
    const z = -0.06 * (x * x + y * y) + (r() - 0.5) * 0.05;
    return [x, CY + y, z];
  },

  /** Globe drawn with latitude and longitude lines. */
  globe(r: Rand): Vec {
    const rad = 2.5;
    if (r() < 0.5) {
      const lat = (Math.floor(r() * 9) - 4) * (Math.PI / 10);
      const lon = r() * Math.PI * 2;
      return [Math.cos(lat) * Math.cos(lon) * rad, CY + Math.sin(lat) * rad, Math.cos(lat) * Math.sin(lon) * rad];
    }
    const lon = Math.floor(r() * 12) * (Math.PI / 6);
    const lat = (r() - 0.5) * Math.PI;
    return [Math.cos(lat) * Math.cos(lon) * rad, CY + Math.sin(lat) * rad, Math.cos(lat) * Math.sin(lon) * rad];
  },

  /** Nine small orbs in three columns, arranged like the three logo bars (one per service). */
  nineOrbs(r: Rand): Vec {
    const col = Math.floor(r() * 3);
    const row = Math.floor(r() * 3);
    const x = (col - 1) * BAR.GAP;
    const spread = col === 1 ? 1.45 : 0.95;
    const y = CY + (row - 1) * spread;
    const v = unitVector(r);
    const k = 0.42 + (r() - 0.5) * 0.05;
    const halo = r() < 0.15 ? 1.6 + r() * 0.6 : 1;
    return [x + v[0] * k * halo, y + v[1] * k * halo, v[2] * k * halo];
  },

  /** Bullseye of rings with a crosshair, facing the viewer (advertising: reaching the right people). */
  target(r: Rand): Vec {
    const roll = r();
    if (roll < 0.14) {
      // crosshair
      const along = (r() - 0.5) * 7;
      return r() < 0.5 ? [along, CY, 0] : [0, CY + along, 0];
    }
    const ring = Math.floor(r() * 4);
    const a = r() * Math.PI * 2;
    const rad = 0.55 + ring * 0.75 + (r() - 0.5) * 0.06;
    return [Math.cos(a) * rad, CY + Math.sin(a) * rad, (r() - 0.5) * 0.1];
  },

  /** A play button: ring with a solid triangle inside (brand, social and video content). */
  playButton(r: Rand): Vec {
    if (r() < 0.45) {
      const a = r() * Math.PI * 2;
      const rad = 2.6 + (r() - 0.5) * 0.12;
      return [Math.cos(a) * rad, CY + Math.sin(a) * rad, (r() - 0.5) * 0.1];
    }
    // uniform point in a triangle pointing right
    let u = r();
    let v = r();
    if (u + v > 1) {
      u = 1 - u;
      v = 1 - v;
    }
    const A = [-0.75, 1.3];
    const B = [-0.75, -1.3];
    const C = [1.45, 0];
    const x = A[0] + u * (B[0] - A[0]) + v * (C[0] - A[0]);
    const y = A[1] + u * (B[1] - A[1]) + v * (C[1] - A[1]);
    return [x, CY + y, (r() - 0.5) * 0.25];
  },

  /** Connected nodes, like contacts flowing through a CRM. */
  network(r: Rand): Vec {
    const n = NODES.length;
    if (r() < 0.38) {
      const node = NODES[Math.floor(r() * n)];
      const v = unitVector(r);
      const k = 0.06 + r() * 0.16;
      return [node[0] + v[0] * k, node[1] + v[1] * k, node[2] + v[2] * k];
    }
    const [a, b] = EDGES[Math.floor(r() * EDGES.length)];
    const t = r();
    const p = NODES[a];
    const q = NODES[b];
    return [p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t];
  },

  /** Magnifying glass: a ring with a handle (search). */
  magnifier(r: Rand): Vec {
    if (r() < 0.62) {
      const a = r() * Math.PI * 2;
      const rad = 1.75 + (r() - 0.5) * 0.22;
      return [-0.5 + Math.cos(a) * rad, CY + 0.5 + Math.sin(a) * rad, (r() - 0.5) * 0.25];
    }
    if (r() < 0.2) {
      // glint inside the lens
      const a = Math.PI * (0.55 + r() * 0.35);
      const rad = 1.1 + (r() - 0.5) * 0.08;
      return [-0.5 + Math.cos(a) * rad, CY + 0.5 + Math.sin(a) * rad, 0];
    }
    const t = r();
    const w = (r() - 0.5) * 0.36;
    // handle runs down-right at 45 degrees
    const x = -0.5 + Math.cos(-Math.PI / 4) * (1.9 + t * 1.9) + w * 0.7;
    const y = CY + 0.5 + Math.sin(-Math.PI / 4) * (1.9 + t * 1.9) + w * 0.7;
    return [x, y, (r() - 0.5) * 0.3];
  },

  /** A stack of tilted feed cards, like posts in a phone feed (social ads). */
  feed(r: Rand): Vec {
    const card = Math.floor(r() * 4);
    const w = 3.2;
    const h = 2.0;
    const edge = r() < 0.55;
    let x: number;
    let y: number;
    if (edge) {
      const per = 2 * (w + h);
      let d = r() * per;
      if (d < w) [x, y] = [d - w / 2, h / 2];
      else if ((d -= w) < h) [x, y] = [w / 2, h / 2 - d];
      else if ((d -= h) < w) [x, y] = [w / 2 - d, -h / 2];
      else [x, y] = [-w / 2, -h / 2 + (d - w)];
    } else {
      // image block and text lines inside the card
      if (r() < 0.6) [x, y] = [-w / 2 + 0.25 + r() * (w - 0.5), -0.05 + r() * 0.8];
      else [x, y] = [-w / 2 + 0.25 + r() * (w * (0.4 + 0.4 * r())), -0.5 - Math.floor(r() * 2) * 0.28];
    }
    const p = orient(x, y, 0, -0.35, 0.25);
    return [p[0] + card * 0.18, CY - 1.6 + card * 1.05 + p[1], p[2] - card * 0.9];
  },

  /** A three-by-three grid of square tiles, like a social profile. */
  postGrid(r: Rand): Vec {
    const col = Math.floor(r() * 3);
    const row = Math.floor(r() * 3);
    const size = 1.3;
    const gap = 0.22;
    const cx = (col - 1) * (size + gap);
    const cy = CY + (row - 1) * (size + gap);
    let x: number;
    let y: number;
    if (r() < 0.7) {
      const d = r() * 4 * size;
      const side = Math.floor(d / size);
      const t = d - side * size - size / 2;
      [x, y] = [[t, size / 2], [size / 2, -t], [-t, -size / 2], [-size / 2, t]][side] as [number, number];
    } else {
      [x, y] = [(r() - 0.5) * size * 0.8, (r() - 0.5) * size * 0.8];
    }
    const p = orient(cx + x, cy - CY + y, (r() - 0.5) * 0.05, -0.25, -0.35);
    return [p[0], CY + p[1], p[2]];
  },

  /** A cut gem outlined by its edges (brand value). */
  gem(r: Rand): Vec {
    const top = 1.15;
    const rad = 2.0;
    const sides = 8;
    const ring = (i: number, k: number, y: number): Vec => {
      const a = (i / sides) * Math.PI * 2;
      return [Math.cos(a) * k, y, Math.sin(a) * k];
    };
    const i = Math.floor(r() * sides);
    const kind = r();
    let a: Vec;
    let b: Vec;
    if (kind < 0.25) [a, b] = [ring(i, rad, 0), ring(i + 1, rad, 0)]; // girdle
    else if (kind < 0.45) [a, b] = [ring(i, rad * 0.55, top), ring(i + 1, rad * 0.55, top)]; // table
    else if (kind < 0.7) [a, b] = [ring(i, rad * 0.55, top), ring(i, rad, 0)]; // crown facets
    else [a, b] = [ring(i, rad, 0), [0, -2.4, 0]]; // pavilion to the point
    const t = r();
    const j = (r() - 0.5) * 0.06;
    const x = a[0] + (b[0] - a[0]) * t + j;
    const y = a[1] + (b[1] - a[1]) * t + j;
    const z = a[2] + (b[2] - a[2]) * t;
    const p = orient(x, y, z, 0.25, 0.4);
    return [p[0], CY + 0.4 + p[1], p[2]];
  },

  /** A funnel of rings narrowing downward (sales pipeline). */
  funnel(r: Rand): Vec {
    const t = r();
    const y = 2.1 - t * 4.2;
    const k = 0.35 + Math.pow(1 - t, 1.6) * 2.4;
    const ringy = r() < 0.65;
    const level = Math.round(t * 6) / 6;
    const yy = ringy ? 2.1 - level * 4.2 : y;
    const kk = ringy ? 0.35 + Math.pow(1 - level, 1.6) * 2.4 : k;
    const a = r() * Math.PI * 2;
    const p = orient(Math.cos(a) * kk, yy, Math.sin(a) * kk, 0.3, 0);
    // a trickle of points falling out of the bottom
    if (r() < 0.06) return [(r() - 0.5) * 0.2, CY - 2.3 - r() * 1.2, 0];
    return [p[0], CY + p[1], p[2]];
  },

  /** A speech bubble with three typing dots (conversation). */
  chatBubble(r: Rand): Vec {
    const w = 4.4;
    const h = 2.8;
    const rad = 0.9;
    const roll = r();
    let x: number;
    let y: number;
    if (roll < 0.62) {
      // rounded-rectangle outline: straight edges plus four quarter-circle corners
      const hw = w / 2 - rad;
      const hh = h / 2 - rad;
      const pick = r();
      if (pick < 0.75) {
        const edge = Math.floor(r() * 4);
        const t = r() * 2 - 1;
        [x, y] = [
          [t * hw, h / 2],
          [w / 2, t * hh],
          [t * hw, -h / 2],
          [-w / 2, t * hh],
        ][edge] as [number, number];
      } else {
        const c = Math.floor(r() * 4);
        const [cx, cy] = [[hw, hh], [hw, -hh], [-hw, -hh], [-hw, hh]][c];
        const a = (c === 0 ? 0 : c === 1 ? -Math.PI / 2 : c === 2 ? Math.PI : Math.PI / 2) + r() * (Math.PI / 2);
        [x, y] = [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      }
    } else if (roll < 0.72) {
      // tail at the bottom left
      const t = r();
      const side = r() < 0.5;
      const a: [number, number] = side ? [-1.1, -h / 2] : [-0.3, -h / 2];
      const b: [number, number] = [-1.5, -h / 2 - 0.95];
      [x, y] = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
    } else {
      // three typing dots
      const dot = Math.floor(r() * 3);
      const v = unitVector(r);
      const k = Math.sqrt(r()) * 0.3;
      [x, y] = [(dot - 1) * 1.05 + v[0] * k, v[1] * k];
    }
    const p = orient(x, y, (r() - 0.5) * 0.12, 0.12, -0.3);
    return [p[0], CY + 0.2 + p[1], p[2]];
  },
} satisfies Record<string, (r: Rand) => Vec>;

export type ShapeName = keyof typeof generators;

/** Builds six aligned point clouds for a scene. */
export function buildShapes(names: readonly ShapeName[], count: number) {
  const shapes = names.map(() => new Float32Array(count * 3));
  const rand = new Float32Array(count);
  const r = rng(1234567);
  for (let i = 0; i < count; i++) {
    rand[i] = r();
    names.forEach((name, k) => {
      shapes[k].set(generators[name](r), i * 3);
    });
  }
  return { shapes, rand };
}
