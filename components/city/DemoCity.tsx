'use client';

import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { CITY, DemoBuilding } from '@/lib/demoCity';

export function DemoCity({ buildings }: { buildings: DemoBuilding[] }) {
  const groups = useMemo(() => {
    const low: DemoBuilding[] = [];
    const mid: DemoBuilding[] = [];
    const high: DemoBuilding[] = [];

    buildings.forEach((b) => {
      if (b.h < 14) low.push(b);
      else if (b.h < 34) mid.push(b);
      else high.push(b);
    });

    return { low, mid, high };
  }, [buildings]);

  const ground = useMemo(() => makeGroundTexture(), []);

  return (
    <group>
      <Ground map={ground.map} emissiveMap={ground.emissiveMap} />

      {groups.low.length > 0 && (
        <InstancedBuildings items={groups.low} repeatX={3} repeatY={5} />
      )}

      {groups.mid.length > 0 && (
        <InstancedBuildings items={groups.mid} repeatX={4} repeatY={9} />
      )}

      {groups.high.length > 0 && (
        <InstancedBuildings items={groups.high} repeatX={5} repeatY={16} />
      )}

      {groups.high.length > 0 && <Beacons items={groups.high.slice(0, 220)} />}

      <Landmark />
      <Stars />
    </group>
  );
}

function Ground({
  map,
  emissiveMap,
}: {
  map: THREE.Texture;
  emissiveMap: THREE.Texture;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[CITY.planeSize, CITY.planeSize]} />
      <meshStandardMaterial
        map={map}
        emissiveMap={emissiveMap}
        emissive="#ffffff"
        emissiveIntensity={0.25}
        color="#8fa5b8"
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}

function InstancedBuildings({
  items,
  repeatX,
  repeatY,
}: {
  items: DemoBuilding[];
  repeatX: number;
  repeatY: number;
}) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const materials = useMemo(() => {
    const { map, emissiveMap } = createFacadeTextures(repeatX, repeatY);

    const side = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      map,
      emissiveMap,
      emissive: new THREE.Color('#ffffff'),
      emissiveIntensity: 1.25,
      roughness: 0.78,
      metalness: 0.18,
    });

    side.toneMapped = false;

    const roof = new THREE.MeshStandardMaterial({
      color: '#04060a',
      roughness: 0.95,
      metalness: 0.05,
    });

    return [side, side, roof, roof, side, side];
  }, [repeatX, repeatY]);

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    items.forEach((b, i) => {
      dummy.position.set(b.x, 0, b.z);
      dummy.scale.set(b.w, b.h, b.d);
      dummy.rotation.set(0, 0, 0);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      color.set(b.color);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  if (!items.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, materials as any, items.length]}
      frustumCulled={false}
    />
  );
}

function Beacons({ items }: { items: DemoBuilding[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => {
    const g = new THREE.BoxGeometry(0.4, 1, 0.4);
    g.translate(0, 0.5, 0);
    return g;
  }, []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        toneMapped: false,
      }),
    []
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    items.forEach((b, i) => {
      dummy.position.set(b.x, b.h, b.z);
      dummy.scale.set(1, 2 + (b.id % 5), 1);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      color.set(i % 3 === 0 ? '#4aa3ff' : '#00e5ff');
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [items]);

  if (!items.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, items.length]}
      frustumCulled={false}
    />
  );
}

function Landmark() {
  const ring = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ring.current) {
      ring.current.rotation.z = state.clock.elapsedTime * 0.18;
    }
  });

  return (
    <group>
      <mesh position={[0, 45, 0]}>
        <cylinderGeometry args={[2.2, 7, 90, 8, 1, true]} />
        <meshStandardMaterial
          color="#091019"
          emissive="#00e5ff"
          emissiveIntensity={0.45}
          metalness={0.7}
          roughness={0.25}
          transparent
          opacity={0.96}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 92, 0]}>
        <sphereGeometry args={[2.4, 16, 16]} />
        <meshBasicMaterial color="#b9f7ff" toneMapped={false} />
      </mesh>

      <mesh ref={ring} position={[0, 14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[16, 0.35, 8, 64]} />
        <meshBasicMaterial
          color="#00e5ff"
          transparent
          opacity={0.65}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(650 * 3);

    for (let i = 0; i < 650; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 1600;
      arr[i * 3 + 1] = 120 + Math.random() * 420;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 1600;
    }

    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.1}
        color="#8feaff"
        transparent
        opacity={0.45}
        sizeAttenuation
        fog={false}
      />
    </points>
  );
}

function makeGroundTexture() {
  const size = 1024;
  const plane = CITY.planeSize;
  const scale = size / plane;

  const to = (v: number) => (v + plane / 2) * scale;

  const base = document.createElement('canvas');
  base.width = size;
  base.height = size;

  const glow = document.createElement('canvas');
  glow.width = size;
  glow.height = size;

  const b = base.getContext('2d')!;
  const g = glow.getContext('2d')!;

  b.fillStyle = '#020408';
  b.fillRect(0, 0, size, size);

  g.fillStyle = '#000000';
  g.fillRect(0, 0, size, size);

  // Blocks
  const inner = CITY.pitch - CITY.road - 2;

  for (let gx = 0; gx < CITY.grid; gx++) {
    for (let gz = 0; gz < CITY.grid; gz++) {
      const x = (gx - CITY.grid / 2 + 0.5) * CITY.pitch;
      const z = (gz - CITY.grid / 2 + 0.5) * CITY.pitch;

      const px = to(x);
      const py = to(z);
      const s = inner * scale;

      b.fillStyle = 'rgba(5, 9, 14, 0.92)';
      b.fillRect(px - s / 2, py - s / 2, s, s);

      b.strokeStyle = 'rgba(0, 229, 255, 0.05)';
      b.strokeRect(px - s / 2, py - s / 2, s, s);
    }
  }

  // Roads
  const roadPx = CITY.road * scale;

  b.fillStyle = '#070c12';

  for (let k = -CITY.grid / 2; k <= CITY.grid / 2; k++) {
    const p = to(k * CITY.pitch);

    b.fillRect(p - roadPx / 2, 0, roadPx, size);
    b.fillRect(0, p - roadPx / 2, size, roadPx);
  }

  // Central plaza
  const cx = to(0);
  const cy = to(0);
  const plazaRadius = 30 * scale;

  const grad = b.createRadialGradient(cx, cy, 4, cx, cy, plazaRadius);
  grad.addColorStop(0, 'rgba(0, 229, 255, 0.22)');
  grad.addColorStop(0.5, 'rgba(0, 120, 180, 0.08)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  b.fillStyle = grad;
  b.beginPath();
  b.arc(cx, cy, plazaRadius, 0, Math.PI * 2);
  b.fill();

  // Neon road lines
  g.lineWidth = Math.max(1.2, 0.55 * scale);
  g.strokeStyle = 'rgba(0, 229, 255, 0.9)';
  g.shadowColor = 'rgba(0, 229, 255, 0.8)';
  g.shadowBlur = 8;

  for (let k = -CITY.grid / 2; k <= CITY.grid / 2; k++) {
    const p = to(k * CITY.pitch);

    g.beginPath();
    g.moveTo(p, 0);
    g.lineTo(p, size);
    g.stroke();

    g.beginPath();
    g.moveTo(0, p);
    g.lineTo(size, p);
    g.stroke();
  }

  const map = new THREE.CanvasTexture(base);
  const emissiveMap = new THREE.CanvasTexture(glow);

  map.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.colorSpace = THREE.SRGBColorSpace;

  map.anisotropy = 4;
  emissiveMap.anisotropy = 2;

  return { map, emissiveMap };
}

function createFacadeTextures(repeatX: number, repeatY: number) {
  const width = 256;
  const height = 512;

  const base = document.createElement('canvas');
  base.width = width;
  base.height = height;

  const glow = document.createElement('canvas');
  glow.width = width;
  glow.height = height;

  const b = base.getContext('2d')!;
  const g = glow.getContext('2d')!;

  b.fillStyle = '#05080d';
  b.fillRect(0, 0, width, height);

  g.fillStyle = '#000000';
  g.fillRect(0, 0, width, height);

  const cols = 10;
  const rows = 22;

  const cellW = width / cols;
  const cellH = height / rows;

  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const px = x * cellW + cellW * 0.22;
      const py = y * cellH + cellH * 0.24;
      const pw = cellW * 0.56;
      const ph = cellH * 0.5;

      b.fillStyle = 'rgba(4, 8, 14, 0.95)';
      b.fillRect(px, py, pw, ph);

      const lit = Math.random() < 0.24;

      if (lit) {
        const blue = Math.random() < 0.35;
        const alpha = 0.35 + Math.random() * 0.55;
        const color = blue
          ? `rgba(74, 163, 255, ${alpha})`
          : `rgba(0, 229, 255, ${alpha})`;

        g.fillStyle = color;
        g.fillRect(px, py, pw, ph);

        b.fillStyle = blue
          ? `rgba(74, 163, 255, ${alpha * 0.22})`
          : `rgba(0, 229, 255, ${alpha * 0.22})`;
        b.fillRect(px, py, pw, ph);
      }
    }
  }

  b.fillStyle = 'rgba(255, 255, 255, 0.02)';
  for (let y = 0; y < rows; y++) {
    b.fillRect(0, y * cellH, width, 1);
  }

  const map = new THREE.CanvasTexture(base);
  const emissiveMap = new THREE.CanvasTexture(glow);

  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  emissiveMap.wrapS = THREE.RepeatWrapping;
  emissiveMap.wrapT = THREE.RepeatWrapping;

  map.repeat.set(repeatX, repeatY);
  emissiveMap.repeat.set(repeatX, repeatY);

  map.colorSpace = THREE.SRGBColorSpace;
  emissiveMap.colorSpace = THREE.SRGBColorSpace;

  map.anisotropy = 4;
  emissiveMap.anisotropy = 2;

  return { map, emissiveMap };
}
