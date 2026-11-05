import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// A soft round sprite drawn once, used for stars and nebula clouds.
function makeSprite(inner: string, outer: string, size = 128) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, inner);
  grad.addColorStop(1, outer);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const STAR_TINTS = ['#ffffff', '#cfe8ff', '#ffe9c7', '#bff3ea'];

function Stars({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null);
  const sprite = useMemo(() => makeSprite('rgba(255,255,255,1)', 'rgba(255,255,255,0)', 64), []);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // Points in a thick spherical shell around the camera.
      const r = 60 + Math.random() * 240;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.set([r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)], i * 3);
      c.set(STAR_TINTS[i % STAR_TINTS.length]).multiplyScalar(0.55 + Math.random() * 0.45);
      col.set([c.r, c.g, c.b], i * 3);
    }
    return [pos, col];
  }, [count]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.4}
        map={sprite}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

const NEBULAE = [
  { color: 'rgba(42,143,149,0.55)', pos: [70, 30, -160], scale: 190 },
  { color: 'rgba(29,63,143,0.6)', pos: [-90, 40, -190], scale: 230 },
  { color: 'rgba(138,85,35,0.45)', pos: [20, -70, -170], scale: 170 },
] as const;

function Nebulae() {
  const textures = useMemo(() => NEBULAE.map((n) => makeSprite(n.color, 'rgba(0,0,0,0)')), []);
  return (
    <>
      {NEBULAE.map((n, i) => (
        <sprite key={i} position={n.pos as unknown as THREE.Vector3Tuple} scale={[n.scale, n.scale, 1]}>
          <spriteMaterial map={textures[i]} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.8} />
        </sprite>
      ))}
    </>
  );
}

// Fresnel glow shader for the planet's atmosphere.
const atmosphere = {
  uniforms: { glow: { value: new THREE.Color('#7ee0d2') } },
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`,
  fragmentShader: `
    uniform vec3 glow;
    varying vec3 vNormal;
    void main() {
      float i = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
      gl_FragColor = vec4(glow, 1.0) * i;
    }`,
};

function Planet() {
  const ref = useRef<THREE.Group>(null);
  const bands = useMemo(() => {
    // Banded surface texture, drawn once.
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 256;
    const g = c.getContext('2d')!;
    const grad = g.createLinearGradient(0, 0, 0, 256);
    ['#0c2236', '#153a52', '#0f2c40', '#1d4d63', '#0b2133', '#183f56', '#0d2538'].forEach((col, i, arr) =>
      grad.addColorStop(i / (arr.length - 1), col),
    );
    g.fillStyle = grad;
    g.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 40; i++) {
      g.fillStyle = `rgba(126,224,210,${Math.random() * 0.06})`;
      g.fillRect(0, Math.random() * 256, 512, 1 + Math.random() * 6);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <group position={[-34, -20, -60]}>
      <group ref={ref}>
        <mesh>
          <sphereGeometry args={[18, 64, 64]} />
          <meshStandardMaterial map={bands} roughness={0.9} metalness={0} />
        </mesh>
      </group>
      <mesh scale={1.14}>
        <sphereGeometry args={[18, 64, 64]} />
        <shaderMaterial args={[atmosphere]} blending={THREE.AdditiveBlending} side={THREE.BackSide} transparent depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2.35, 0.25, 0]}>
        <ringGeometry args={[24, 34, 128]} />
        <meshBasicMaterial color="#f5d9a8" transparent opacity={0.16} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
    </group>
  );
}

// A streak that crosses the sky every few seconds.
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null);
  const state = useRef({ t: 0, next: 3, dir: new THREE.Vector3(), start: new THREE.Vector3() });

  useFrame((_, dt) => {
    const s = state.current;
    const m = ref.current;
    if (!m) return;
    s.t += dt;
    if (s.t > s.next) {
      s.t = 0;
      s.next = 6 + Math.random() * 6;
      s.start.set(20 + Math.random() * 60, 25 + Math.random() * 20, -80);
      s.dir.set(-1, -0.45, 0).normalize();
      m.rotation.z = Math.atan2(s.dir.y, s.dir.x);
    }
    const life = s.t / 1.1;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = life < 1 ? Math.sin(life * Math.PI) * 0.9 : 0;
    m.position.copy(s.start).addScaledVector(s.dir, s.t * 90);
  });

  return (
    <mesh ref={ref}>
      <planeGeometry args={[14, 0.12]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

// Eases the camera toward the pointer for a gentle parallax.
function Rig() {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.x = (e.clientX / innerWidth - 0.5) * 6;
      target.current.y = -(e.clientY / innerHeight - 0.5) * 4;
    };
    addEventListener('pointermove', onMove);
    return () => removeEventListener('pointermove', onMove);
  }, []);
  useFrame(() => {
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (target.current.y - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -60);
  });
  return null;
}

export default function SpaceScene({ still }: { still: boolean }) {
  const count = typeof innerWidth !== 'undefined' && innerWidth < 700 ? 1800 : 4200;
  return (
    <Canvas
      camera={{ position: [0, 0, 30], fov: 60, near: 0.1, far: 1000 }}
      dpr={[1, 1.75]}
      frameloop={still ? 'demand' : 'always'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
    >
      <ambientLight intensity={0.06} />
      <directionalLight position={[40, 30, 20]} intensity={2.4} color="#ffe7c4" />
      <Nebulae />
      <Stars count={count} />
      <Planet />
      {!still && <ShootingStar />}
      {!still && <Rig />}
    </Canvas>
  );
}
