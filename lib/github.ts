import { GitHubRepo, GitHubUser } from '@/types';

const API = 'https://api.github.com';

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) {
    const err: any = new Error(`GitHub API ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

async function getCommitCount(owner: string, repo: string): Promise<number> {
  try {
    const res = await fetch(
      `${API}/repos/${owner}/${repo}/commits?per_page=1`,
      { headers: { Accept: 'application/vnd.github+json' } }
    );
    if (!res.ok) return 0;
    const link = res.headers.get('Link') || '';
    const match = link.match(/page=(\d+)>; rel="last"/);
    return match ? parseInt(match[1], 10) : 1;
  } catch {
    return 0;
  }
}

export async function fetchUserProfile(username: string): Promise<GitHubUser> {
  return fetchJSON<GitHubUser>(`${API}/users/${encodeURIComponent(username)}`);
}

export async function fetchUserRepos(username: string): Promise<GitHubRepo[]> {
  const raw = await fetchJSON<any[]>(
    `${API}/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`
  );

  const limited = raw.slice(0, 40);
  const counts = await Promise.all(
    limited.map((r) => getCommitCount(username, r.name))
  );

  return limited.map((r, i) => ({
    id: r.id,
    name: r.name,
    full_name: r.full_name,
    description: r.description,
    html_url: r.html_url,
    language: r.language,
    stargazers_count: r.stargazers_count,
    forks_count: r.forks_count,
    size: r.size,
    pushed_at: r.pushed_at,
    archived: r.archived ?? false,
    commits_count: counts[i],
  }));
}
