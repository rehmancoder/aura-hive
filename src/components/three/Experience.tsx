"use client";

// three.js objects are created once and then updated every frame inside useFrame,
// which is the intended React Three Fiber pattern; the React Compiler immutability rule does not apply.
/* eslint-disable react-hooks/immutability */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { BAR, buildShapes, type ShapeName } from "./shapes";
import { scenes, serviceScene, type SceneConfig, type SceneName } from "./scenes";

/*
  One fixed WebGL canvas sits behind the page. Scrolling drives `morph`
  (0 → number of stages − 1), and the gold particle swarm morphs through the
  shapes of the page's scene (see scenes.ts). On the home page the hero also
  shows the solid gold logo bars over a hexagon floor.
*/

// React Three Fiber 9 still creates a THREE.Clock internally, which three r183+ flags as deprecated.
// Drop only that warning (it's outside our code); every other three.js message passes through.
THREE.setConsoleFunction((type, message, ...params) => {
  if (type === "warn" && String(message).includes("Clock: This module has been deprecated")) return;
  console[type as "log" | "warn" | "error"](message, ...params);
});

const GOLD = "#DFB576";
const COMB = new THREE.Color("#120d06");
const HONEY = new THREE.Color("#DFB576");

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Value of a per-stage setting at morph position m, eased between stages. */
function at(values: number[], m: number) {
  const i = Math.min(values.length - 2, Math.floor(m));
  const t = ease(clamp01(m - i));
  return values[i] + (values[i + 1] - values[i]) * t;
}

/** Scroll position → morph value, measured from sections marked data-stage="1", "2"… */
function readMorph(last: number) {
  const vh = window.innerHeight;
  let m = 0;
  document.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => {
    // Pages you navigated away from stay in the DOM, hidden (Next.js keeps them in <Activity>).
    // Their sections have no layout box and would read as scrolled past, so skip them.
    if (!el.getClientRects().length) return;
    const top = el.getBoundingClientRect().top;
    m += clamp01((vh * 0.95 - top) / (vh * 0.7));
  });
  return Math.min(last, m);
}

/** 0 at the top of the page, 1 once the hero has scrolled most of the way off. */
function readHeroFade() {
  return clamp01(window.scrollY / (window.innerHeight * 0.6));
}

function useEnvironment() {
  const get = useThree((s) => s.get);
  useEffect(() => {
    const { gl, scene } = get();
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [get]);
}

/* ---------------- Hero: solid gold bars ---------------- */
function Bars({ motion, fade: fadeRef }: { motion: number; fade: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const refs = useRef<(THREE.Mesh | null)[]>([]);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: GOLD,
        metalness: 1,
        roughness: 0.24,
        clearcoat: 0.6,
        clearcoatRoughness: 0.2,
        transparent: true,
      }),
    [],
  );
  const bars = useMemo(
    () => [
      { x: -BAR.GAP, h: BAR.SIDE_H, phase: 0.9 },
      { x: 0, h: BAR.CENTER_H, phase: 0 },
      { x: BAR.GAP, h: BAR.SIDE_H, phase: 2.1 },
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime * motion + 1.2;
    const fade = ease(fadeRef.current);
    material.opacity = 1 - fade;
    bars.forEach((b, i) => {
      const m = refs.current[i];
      if (!m) return;
      const breath = 1 + (0.07 * Math.sin(t * 1.5 + b.phase) + 0.03 * Math.sin(t * 3.7 + b.phase * 2)) * motion;
      const s = breath * (1 - fade * 0.85);
      m.scale.set(1 - fade * 0.5, s, 1 - fade * 0.5);
      const lift = b.h === BAR.SIDE_H ? (BAR.CENTER_H - BAR.SIDE_H) / 2 - 0.33 : 0;
      m.position.y = (b.h * s) / 2 + 0.25 + lift + fade * 1.6;
    });
    const g = group.current;
    if (g) {
      g.visible = fade < 0.999;
      const ty = state.pointer.x * 0.35 + Math.sin(t * 0.25) * 0.15 * motion;
      g.rotation.y += (ty - g.rotation.y) * 0.05;
      g.rotation.x += (-state.pointer.y * 0.08 - g.rotation.x) * 0.05;
      g.position.y = Math.sin(t * 0.8) * 0.06 * motion;
    }
  });

  return (
    <group ref={group}>
      {bars.map((b, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[b.x, b.h / 2, 0]}
          material={material}
        >
          <capsuleGeometry args={[BAR.R, b.h - BAR.R * 2, 12, 48]} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------------- Hero: hexagon hive floor ---------------- */
function HiveFloor({ motion, fade: fadeRef }: { motion: number; fade: React.RefObject<number> }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const cells = useMemo(() => {
    const list: { x: number; z: number; d: number }[] = [];
    const size = 0.5;
    const N = 17;
    for (let q = -N; q <= N; q++) {
      for (let r = Math.max(-N, -q - N); r <= Math.min(N, -q + N); r++) {
        const x = Math.sqrt(3) * size * (q + r / 2);
        const z = 1.5 * size * r;
        list.push({ x, z, d: Math.hypot(x, z) });
      }
    }
    return list;
  }, []);
  const geometry = useMemo(() => {
    const g = new THREE.CylinderGeometry(0.46, 0.46, 1, 6);
    g.translate(0, -0.5, 0);
    return g;
  }, []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#ffffff",
        metalness: 0.7,
        roughness: 0.5,
        envMapIntensity: 0.18,
        transparent: true,
      }),
    [],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const color = useMemo(() => new THREE.Color(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const fade = ease(fadeRef.current);
    m.visible = fade < 0.999;
    if (!m.visible) return;
    material.opacity = 1 - fade;
    m.position.y = -fade * 2.5;
    const t = state.clock.elapsedTime * motion + 2.4;
    for (let i = 0; i < cells.length; i++) {
      const c = cells[i];
      const wave = Math.max(0, Math.sin(c.d * 1.05 - t * 1.6));
      const pulse = Math.pow(wave, 6) * Math.exp(-c.d * 0.11);
      const near = Math.exp(-c.d * 0.7);
      dummy.position.set(c.x, 0.04 + pulse * 0.42 + near * 0.16, c.z);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      color.copy(COMB).lerp(HONEY, Math.min(1, pulse * 1.5 + near * 0.6));
      m.setColorAt(i, color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[geometry, material, cells.length]} frustumCulled={false} />;
}

/* ---------------- Soft additive aura behind the logo ---------------- */
function Aura({ morph, fade, scene }: { morph: React.RefObject<number>; fade: React.RefObject<number>; scene: SceneConfig }) {
  const sprite = useRef<THREE.Sprite>(null);
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(223,181,118,0.5)");
    g.addColorStop(0.35, "rgba(184,137,74,0.2)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
  useFrame(() => {
    const m = morph.current;
    const on = scene.heroBars ? Math.max(1 - fade.current, at(scene.glow, m)) : at(scene.glow, m);
    if (sprite.current) (sprite.current.material as THREE.SpriteMaterial).opacity = on;
  });
  return (
    <sprite ref={sprite} position={[0, 2.4, -1.8]} scale={[9, 9, 1]}>
      <spriteMaterial map={texture} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

/* ---------------- Particle swarm ---------------- */
const vertex = /* glsl */ `
  uniform float uMorph;
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform vec3 uMouse;
  uniform float uWave;
  uniform float uPulse;
  uniform float uLast;
  attribute vec3 p1;
  attribute vec3 p2;
  attribute vec3 p3;
  attribute vec3 p4;
  attribute vec3 p5;
  attribute float aRand;
  varying float vAlpha;
  varying float vRand;

  vec3 pick(float i) {
    if (i < 0.5) return position;
    if (i < 1.5) return p1;
    if (i < 2.5) return p2;
    if (i < 3.5) return p3;
    if (i < 4.5) return p4;
    return p5;
  }

  void main() {
    float m = clamp(uMorph, 0.0, uLast);
    float fi = min(floor(m), uLast - 1.0);
    float t = m - fi;
    float d = aRand * 0.35;
    float tt = smoothstep(d, d + 0.65, t);
    vec3 pos = mix(pick(fi), pick(fi + 1.0), tt);

    // Particles scatter mid-flight, then settle into the next shape.
    vec3 dir = normalize(vec3(sin(aRand * 91.0), cos(aRand * 57.0), sin(aRand * 23.0)) + 0.001);
    pos += dir * sin(tt * 3.14159) * (1.0 + aRand * 1.6);

    // Gentle idle drift.
    pos += vec3(
      sin(uTime * 0.6 + aRand * 40.0),
      cos(uTime * 0.5 + aRand * 30.0),
      sin(uTime * 0.4 + aRand * 20.0)
    ) * 0.045;

    // Wave shapes keep rolling; column shapes pulse upward.
    pos.y += uWave * sin(pos.x * 0.7 + pos.z * 0.4 - uTime * 1.3) * 0.3;
    pos.y += uPulse * sin(uTime * 2.0 + pos.x) * 0.05 * pos.y;

    vec4 world = modelMatrix * vec4(pos, 1.0);
    vec2 dm = world.xy - uMouse.xy;
    float dist = length(dm);
    world.xy += normalize(dm + 0.0001) * smoothstep(1.5, 0.0, dist) * 0.55;

    vec4 mv = viewMatrix * world;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uPixelRatio * (0.45 + aRand * 1.1) * (1.0 + uWave * 0.5) / -mv.z;
    vAlpha = 0.55 + 0.45 * sin(uTime * 1.7 + aRand * 60.0);
    vRand = aRand;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vRand;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 col = mix(uColorA, uColorB, step(0.82, vRand));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
  }
`;

function Swarm({
  count,
  motion,
  morph,
  mobile,
  scene,
}: {
  count: number;
  motion: number;
  morph: React.RefObject<number>;
  mobile: boolean;
  scene: SceneConfig;
}) {
  const { shapes, rand } = useMemo(() => buildShapes(scene.shapes, count), [scene, count]);
  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(shapes[0], 3));
    g.setAttribute("p1", new THREE.BufferAttribute(shapes[1], 3));
    g.setAttribute("p2", new THREE.BufferAttribute(shapes[2], 3));
    g.setAttribute("p3", new THREE.BufferAttribute(shapes[3], 3));
    g.setAttribute("p4", new THREE.BufferAttribute(shapes[4], 3));
    g.setAttribute("p5", new THREE.BufferAttribute(shapes[5], 3));
    g.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 2, 0), 30);
    return g;
  }, [shapes, rand]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMorph: { value: 0 },
          uTime: { value: 0 },
          uSize: { value: 62 },
          uPixelRatio: { value: 1 },
          uMouse: { value: new THREE.Vector3(99, 99, 0) },
          uColorA: { value: new THREE.Color("#DFB576") },
          uColorB: { value: new THREE.Color("#FFF1D6") },
          uOpacity: { value: 1 },
          uWave: { value: 0 },
          uPulse: { value: 0 },
          uLast: { value: scene.stages - 1 },
        },
      }),
    [scene],
  );

  const points = useRef<THREE.Points>(null);
  const spin = useRef(0);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame((state, dt) => {
    const m = morph.current;
    const u = material.uniforms;
    u.uMorph.value = m;
    u.uTime.value = state.clock.elapsedTime * motion;
    u.uPixelRatio.value = state.gl.getPixelRatio();
    // Quieter behind text on phones; brighter where the swarm is the focus.
    u.uOpacity.value = at(mobile ? scene.opacity.mobile : scene.opacity.desktop, m);
    u.uWave.value = at(scene.wave, m);
    u.uPulse.value = at(scene.pulse, m);

    raycaster.setFromCamera(state.pointer, state.camera);
    if (raycaster.ray.intersectPlane(plane, hit)) u.uMouse.value.copy(hit);

    // Spin where the scene asks for it, then ease back to a resting angle.
    const w1 = at(scene.spin, m);
    spin.current += dt * 0.25 * w1 * motion;
    const rest = Math.round(spin.current / (Math.PI * 2)) * Math.PI * 2;
    spin.current += (rest - spin.current) * (1 - w1) * Math.min(1, dt * 2);
    if (points.current) points.current.rotation.y = spin.current;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------------- Rig: camera, stage transforms, scroll → morph ---------------- */
function Rig({ motion, scene }: { motion: number; scene: SceneConfig }) {
  const get = useThree((s) => s.get);
  const size = useThree((s) => s.size);
  const stage = useRef<THREE.Group>(null);
  const morph = useRef(0);
  const fade = useRef(0);
  const mobile = size.width / size.height < 1.05;
  const stages = mobile ? scene.mobile : scene.desktop;
  const last = scene.stages - 1;
  useEnvironment();

  useEffect(() => {
    const cam = get().camera as THREE.PerspectiveCamera;
    cam.fov = mobile ? 40 : 32;
    cam.position.set(0, 2.9, mobile ? 13 : 12.5);
    cam.lookAt(0, mobile ? 0.4 : 1.7, 0);
    cam.updateProjectionMatrix();
  }, [get, mobile]);

  useFrame((_, dt) => {
    const target = readMorph(last);
    // Damped so fast scrolls still read as one smooth motion.
    morph.current += (target - morph.current) * Math.min(1, dt * 4.5);
    const m = morph.current;
    fade.current += (Math.max(readHeroFade(), clamp01(m / 0.7)) - fade.current) * Math.min(1, dt * 6);
    const i = Math.min(last - 1, Math.floor(m));
    const t = ease(m - i);
    const a = stages[i];
    const b = stages[Math.min(last, i + 1)];
    const g = stage.current;
    if (g) {
      g.position.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
      g.scale.setScalar(a.s + (b.s - a.s) * t);
    }
  });

  return (
    <group ref={stage}>
      <Aura morph={morph} fade={fade} scene={scene} />
      {scene.heroBars ? (
        <>
          <Bars motion={motion} fade={fade} />
          <HiveFloor motion={motion} fade={fade} />
        </>
      ) : null}
      <Swarm count={mobile ? 4200 : 9000} motion={motion} morph={morph} mobile={mobile} scene={scene} />
      <pointLight position={[0, 3, 3]} intensity={18} color="#ffd59a" distance={14} />
      <pointLight position={[-4, 6, -2]} intensity={10} color="#ffffff" distance={16} />
    </group>
  );
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(REDUCED_QUERY);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}

export default function Experience({ scene = "home", shape }: { scene?: SceneName; shape?: ShapeName }) {
  const config = useMemo(() => (shape ? serviceScene(shape) : scenes[scene]), [scene, shape]);
  const reduced = usePrefersReducedMotion();
  const motion = reduced ? 0 : 1;

  // Pages you navigate away from stay mounted but hidden (Next.js keeps them in <Activity>), and so
  // does this canvas. React runs effect cleanups on hide and effects again on show: pause rendering
  // while hidden so old pages don't keep drawing in the background.
  const setFrameloop = useRef<((mode: "always" | "never") => void) | null>(null);
  useEffect(() => {
    setFrameloop.current?.("always");
    return () => setFrameloop.current?.("never");
  }, []);

  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 32, position: [0, 2.9, 12.5], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      onCreated={({ gl, scene, setFrameloop: set }) => {
        setFrameloop.current = set;
        gl.setClearColor("#000000");
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
        scene.fog = new THREE.Fog("#000000", 10, 24);
      }}
      fallback={null}
      aria-hidden
    >
      <ambientLight intensity={0.15} />
      <Rig motion={motion} scene={config} />
    </Canvas>
  );
}
