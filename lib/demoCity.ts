const GRID = 32;
const PITCH = 18;
const SIZE = GRID * PITCH;

export const CITY = {
  grid: GRID,
  pitch: PITCH,
  road: 6,
  size: SIZE,
  planeSize: SIZE + 40,
  radius: SIZE / 2 + 20,
} as const;

export interface DemoBuilding {
  id: number;
  name: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  color: string;
  accent: string;
  commits: number;
  stars: number;
  language: string;
}

export interface DemoCityData {
  buildings: DemoBuilding[];
  meta: {
    count: number;
    totalCommits: number;
    totalStars: number;
  };
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = [
  'cyber',
  'neo',
  'quantum',
  'null',
  'dark',
  'hyper',
  'pixel',
  'byte',
  'astro',
  'void',
  'stack',
  'git',
  'cloud',
  'net',
  'node',
  'rust',
  'crypto',
  'data',
  'flux',
  'ion',
];

const SECOND = [
  'dev',
  'labs',
  'core',
  'api',
  'engine',
  'forge',
  'matrix',
  'systems',
  'repo',
  'os',
  'grid',
  'wave',
  'code',
  'hub',
  'terminal',
  'daemon',
  'kernel',
  'bot',
  'vision',
  'sync',
];

const LANGS = [
  'TypeScript',
  'JavaScript',
  'Python',
  'Rust',
  'Go',
  'C++',
  'Java',
  'C#',
];

const BASE_COLORS = [
  '#93aac2',
  '#7e93a7',
  '#98b7cc',
  '#6f859a',
  '#88a0b8',
  '#7d90a8',
];

const ACCENTS = ['#00e5ff', '#4aa3ff', '#8fdcff', '#59d7ff'];

function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length)];
}

export function generateDemoCity(count = 1000): DemoCityData {
  const rand = mulberry32(20260214);

  const cells: { x: number; z: number; dist: number }[] = [];
  const half = CITY.grid / 2;

  for (let gx = 0; gx < CITY.grid; gx++) {
    for (let gz = 0; gz < CITY.grid; gz++) {
      const x = (gx - half + 0.5) * CITY.pitch;
      const z = (gz - half + 0.5) * CITY.pitch;
      cells.push({ x, z, dist: Math.hypot(x, z) });
    }
  }

  // Sort by distance from center, leave central plaza for landmark.
  cells.sort((a, b) => a.dist - b.dist);

  // 1024 total cells - 24 central plaza cells = 1000 buildings.
  const buildCells = cells.slice(24, 24 + count);

  const buildings: DemoBuilding[] = buildCells.map((cell, i) => {
    const r1 = rand();
    const r2 = rand();
    const r3 = rand();
    const r4 = rand();

    const centerFactor = Math.max(0, 1 - cell.dist / 260);

    let h =
      4 +
      r1 * 8 +
      Math.pow(r2, 1.7) * 18 +
      centerFactor * centerFactor * 62;

    if (r3 > 0.94) h += 18;
    h = Math.min(92, h);

    const w = Math.min(10, 4.4 + r4 * 2.2 + centerFactor * 2.2);
    const d = Math.min(10, 4.4 + rand() * 2.2 + centerFactor * 2.2);

    const name = `${pick(FIRST, rand())}-${pick(SECOND, rand())}-${String(
      i + 1
    ).padStart(3, '0')}`;

    const commits = Math.floor(
      10 + Math.pow(rand(), 2) * 4200 + centerFactor * 2600
    );

    const stars = Math.floor(rand() * rand() * 8200);

    return {
      id: i + 1,
      name,
      x: cell.x,
      z: cell.z,
      w,
      d,
      h,
      color: pick(BASE_COLORS, rand()),
      accent: pick(ACCENTS, rand()),
      commits,
      stars,
      language: pick(LANGS, rand()),
    };
  });

  const totalCommits = buildings.reduce((sum, b) => sum + b.commits, 0);
  const totalStars = buildings.reduce((sum, b) => sum + b.stars, 0);

  return {
    buildings,
    meta: {
      count: buildings.length,
      totalCommits,
      totalStars,
    },
  };
}
