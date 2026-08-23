'use client';

import * as THREE from 'three';
import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { CITY, DemoBuilding } from '@/lib/demoCity';

const BLOCK_PLOTS = 2;
const BLOCK_SIZE = CITY.pitch * BLOCK_PLOTS;
const CITY_HALF = CITY.size / 2;
const BLOCK_INSET = 1.4;

interface Block {
  bx: number;
  bz: number;
}

interface Dot {
  x: number;
  y: number;
  z: number;
  color: string;
}

export function DemoCity({ buildings }: { buildings: DemoBuilding[] }) {
  const blocks = useMemo(() => {
    const map = new Map<string, Block>();

    buildings.forEach((b) => {
      const bx = Math.floor((b.x + CITY_HALF) / BLOCK_SIZE);
      const bz = Math.floor((b.z + CITY_HALF) / BLOCK_SIZE);
      const key = `${bx}_${bz}`;

      if (!map.has(key)) {
        map.set(key, { bx, bz });
      }
    });

    return Array.from(map.values());
  }, [buildings]);

  const dots = useMemo(() => {
    const list: Dot[] = [];

    buildings.forEach((b) => {
      const count = Math.min(12, Math.max(2, Math.round(b.commits / 450)));

      for (let i = 0; i < count; i++) {
        list.push({
          x: b.x + (Math.random() - 0.5) * b.w * 0.9,
          y: 0.25 + Math.random() * 0.1,
          z: b.z + (Math.random() - 0.5) * b.d * 0.9,
          color: Math.random() > 0.5 ? '#00e5ff' : '#4aa3ff',
        });
      }
    });

    return list;
  }, [buildings]);

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

  return (
    <group>
      <Ground />

      <BlockBorders blocks={blocks} />
      <BlockFloors blocks={blocks} />
      <CommitDots dots={dots} />

      {groups.low.length > 0 && (
        <InstancedBuildings
          items={groups.low}
          repeatX={3}
          repeatY={5}
          sparkleOffset={0}
        />
      )}

      {groups.mid.length > 0 && (
        <InstancedBuildings
          items={groups.mid}
          repeatX={4}
          repeatY={9}
          sparkleOffset={1.7}
        />
      )}

      {groups.high.length > 0 && (
        <InstancedBuildings
          items={groups.high}
          repeatX={5}
          repeatY={16}
          sparkleOffset={3.4}
        />
      )}

      <Landmark />
      <Stars />
    </group>
  );
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[CITY.size + 60, CITY.size + 60]} />
      <meshStandardMaterial color="#05070c" roughness={1} metalness={0} />
    </mesh>
  );
}

function BlockBorders({ blocks }: { blocks: Block[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#ffffff',
        transparent: true,
        opacity: 0.9,
        toneMapped: false,
      }),
    []
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();

    const t = 0.3;
    const y = 0.15;
    const edgeLen = BLOCK_SIZE - BLOCK_INSET * 2;

    let index = 0;

    blocks.forEach((block) => {
      const minX = block.bx * BLOCK_SIZE - CITY_HALF;
      const minZ = block.bz * BLOCK_SIZE - CITY_HALF;
      const maxX = minX + BLOCK_SIZE;
      const maxZ = minZ + BLOCK_SIZE;

      const cx = minX + BLOCK_SIZE / 2;
      const cz = minZ + BLOCK_SIZE / 2;

      const accent =
        (block.bx + block.bz) % 2 === 0 ? '#00e5ff' : '#4aa3ff';

      const edges = [
        { pos: [cx, y, minZ + BLOCK_INSET], scale: [edgeLen, t, t] },
        { pos: [cx, y, maxZ - BLOCK_INSET], scale: [edgeLen, t, t] },
        { pos: [minX + BLOCK_INSET, y, cz], scale: [t, t, edgeLen] },
        { pos: [maxX - BLOCK_INSET, y, cz], scale: [t, t, edgeLen] },
      ];

      edges.forEach((edge) => {
        dummy.position.set(edge.pos[0], edge.pos[1], edge.pos[2]);
        dummy.scale.set(edge.scale[0], edge.scale[1], edge.scale[2]);
        dummy.updateMatrix();

        mesh.setMatrixAt(index, dummy.matrix);
        color.set(accent);
        mesh.setColorAt(index, color);

        index++;
      });
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blocks]);

  if (!blocks.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, blocks.length * 4]}
      frustumCulled={false}
    />
  );
}

function BlockFloors({ blocks }: { blocks: Block[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);

  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#0a1018',
        transparent: true,
        opacity: 0.55,
      }),
    []
  );

  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();

    const floorSize = BLOCK_SIZE - BLOCK_INSET * 2;

    blocks.forEach((block, i) => {
      const cx = block.bx * BLOCK_SIZE - CITY_HALF + BLOCK_SIZE / 2;
      const cz = block.bz * BLOCK_SIZE - CITY_HALF + BLOCK_SIZE / 2;

      dummy.position.set(cx, 0.02, cz);
      dummy.scale.set(floorSize, 0.04, floorSize);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  if (!blocks.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, blocks.length]}
      frustumCulled={false}
    />
  );
}

function CommitDots({ dots }: { dots: Dot[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  const geometry = useMemo(() => new THREE.SphereGeometry(0.16, 6, 6), []);

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

    dots.forEach((dot, i) => {
      dummy.position.set(dot.x, dot.y, dot.z);
      dummy.scale.set(1, 1, 1);
      dummy.updateMatrix();

      mesh.setMatrixAt(i, dummy.matrix);
      color.set(dot.color);
      mesh.setColorAt(i, color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [dots]);

  if (!dots.length) return null;

  return (
    <instancedMesh
      ref={ref}
      args={[geometry, material, dots.length]}
      frustumCulled={false}
    />
  );
}

function InstancedBuildings({
  items,
  repeatX,
  repeatY,
  sparkleOffset = 0,
}: {
  items: DemoBuilding[];
  repeatX: number;
  repeatY: number;
  sparkleOffset?: number;
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

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;

    const mats = mesh.material;
    if (!Array.isArray(mats)) return;

    const side = mats[0] as THREE.MeshStandardMaterial;
    if (!side) return;

    const t = state.clock.elapsedTime;

    const intro = Math.min(1, t / 3.2);

    const pulse =
      1.05 +
      Math.sin(t * 0.8 + sparkleOffset) * 0.35 +
      Math.sin(t * 6.5 + sparkleOffset * 2.3) * 0.08;

    side.emissiveIntensity = Math.max(0.05, intro * pulse);
  });

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

function Landmark() {
  const ring = useRef<THREE.Mesh>(null);
  const sphereMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (ring.current) {
      ring.current.rotation.z = t * 0.18;
    }

    if (sphereMat.current) {
      sphereMat.current.opacity = 0.75 + Math.sin(t * 2.2) * 0.25;
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
        <meshBasicMaterial
          ref={sphereMat}
          color="#b9f7ff"
          transparent
          opacity={1}
          toneMapped={false}
        />
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
