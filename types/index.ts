export interface GitHubUser {
  login: string;
  name?: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  bio?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  size: number;
  pushed_at: string;
  archived: boolean;
  commits_count: number;
}

export interface RepositoryBuilding {
  id: number;
  name: string;
  description?: string;
  commits: number;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: string;
  url: string;
  gridX: number;
  gridZ: number;
  height: number;
  width: number;
  depth: number;
  buildingType: 'standard' | 'active' | 'popular' | 'landmark';
  district: 'dense' | 'lowrise' | 'archived' | 'core';
  accentColor: string;
}

export interface CityData {
  user: GitHubUser;
  repos: GitHubRepo[];
  buildings: RepositoryBuilding[];
  stats: {
    totalRepos: number;
    totalCommits: number;
    totalStars: number;
    topLanguage: string | null;
  };
  gridSize: number;
  blockSpacing: number;
  roadWidth: number;
}

export type CameraTarget = {
  position: [number, number, number];
  lookAt?: [number, number, number];
} | null;
