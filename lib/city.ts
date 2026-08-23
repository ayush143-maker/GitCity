import { CityData, GitHubRepo, GitHubUser, RepositoryBuilding } from '@/types';

const LANGUAGE_ACCENTS: Record<string, string> = {
  TypeScript: '#4aa3ff',
  JavaScript: '#00e5ff',
  Python: '#7ad9ff',
  Rust: '#63b8ff',
  Go: '#5fd0ff',
  'C++': '#80c8ff',
  Java: '#57c6ff',
  C: '#6ec7ff',
  'C#': '#79c3ff',
  Ruby: '#9ad8ff',
  PHP: '#6fd1ff',
};
const DEFAULT_ACCENT = '#00c2ff';

function accentFor(lang: string | null): string {
  return (lang && LANGUAGE_ACCENTS[lang]) || DEFAULT_ACCENT;
}

function heightFromCommits(commits: number): number {
  const base = 1.0;
  const h = base + Math.log2(commits + 1) * 1.25;
  return Math.min(h, 36);
}

function classify(repo: GitHubRepo): {
  type: RepositoryBuilding['buildingType'];
  district: RepositoryBuilding['district'];
} {
  if (repo.archived) return { type: 'standard', district: 'archived' };
  if (repo.stargazers_count > 50 || repo.forks_count > 20)
    return { type: 'popular', district: 'dense' };
  if (repo.commits_count > 300) return { type: 'active', district: 'dense' };
  if (repo.commits_count < 20) return { type: 'standard', district: 'lowrise' };
  return { type: 'standard', district: 'dense' };
}

function spiralCoords(gridSize: number): { x: number; z: number }[] {
  const coords: { x: number; z: number }[] = [];
  const half = Math.floor(gridSize / 2);
  const used = new Set<string>();
  used.add('0,0');

  let x = 0,
    z = 0,
    dx = 0,
    dz = -1;
  for (let i = 0; i < gridSize * gridSize; i++) {
    if (
      x >= -half &&
      x <= half &&
      z >= -half &&
      z <= half &&
      !used.has(`${x},${z}`)
    ) {
      if (!(x === 0 && z === 0)) {
        coords.push({ x, z });
        used.add(`${x},${z}`);
      }
    }
    if (x === -z || (x < 0 && x === z) || (x > 0 && x === 1 - z)) {
      const t = dx;
      dx = -dz;
      dz = t;
    }
    x += dx;
    z += dz;
  }
  return coords;
}

export function buildCity(user: GitHubUser, repos: GitHubRepo[]): CityData {
  const gridSize = Math.max(3, Math.min(8, Math.ceil(Math.sqrt(repos.length + 1))));
  const blockSpacing = 14;
  const roadWidth = 3;

  const sorted = [...repos].sort((a, b) => b.commits_count - a.commits_count);
  const buildings: RepositoryBuilding[] = [];
  const coords = spiralCoords(gridSize);

  sorted.forEach((repo, idx) => {
    const { x, z } = coords[idx] ?? coords[coords.length - 1] ?? { x: 0, z: 0 };
    const { type, district } = classify(repo);
    const height = heightFromCommits(repo.commits_count);

    buildings.push({
      id: repo.id,
      name: repo.name,
      description: repo.description || undefined,
      commits: repo.commits_count,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updatedAt: repo.pushed_at,
      url: repo.html_url,
      gridX: x,
      gridZ: z,
      height,
      width: 3 + Math.min(2, Math.log2(repo.size / 1000 + 1)),
      depth: 3 + Math.min(2, Math.log2(repo.size / 1000 + 1)),
      buildingType: type,
      district,
      accentColor: accentFor(repo.language),
    });
  });

  const totalCommits = repos.reduce((s, r) => s + r.commits_count, 0);
  const totalStars = repos.reduce((s, r) => s + r.stargazers_count, 0);
  const langCount: Record<string, number> = {};
  repos.forEach(
    (r) => r.language && (langCount[r.language] = (langCount[r.language] || 0) + 1)
  );
  const topLanguage =
    Object.entries(langCount).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    user,
    repos,
    buildings,
    stats: { totalRepos: repos.length, totalCommits, totalStars, topLanguage },
    gridSize,
    blockSpacing,
    roadWidth,
  };
}
