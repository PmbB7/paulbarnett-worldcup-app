import { FOOTBALL_API_BASE, WC_COMPETITION } from '../constants';

export interface Match {
  id: number;
  utcDate: string;
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED';
  matchday: number;
  stage: string;
  group?: string;
  homeTeam: { id: number; name: string; shortName: string; crest: string };
  awayTeam: { id: number; name: string; shortName: string; crest: string };
  score: {
    winner: string | null;
    fullTime: { home: number | null; away: number | null };
    halfTime: { home: number | null; away: number | null };
  };
}

export interface Standing {
  position: number;
  team: { id: number; name: string; shortName: string; crest: string };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface Scorer {
  player: { id: number; name: string; nationality: string };
  team: { id: number; name: string; shortName: string; crest: string };
  goals: number;
  assists: number | null;
  penalties: number | null;
}

// Default API key — can be overridden in Configuration
const DEFAULT_API_KEY = 'f6e9d9d5ea6041598c2ae854fd3a025b';

export function getApiKey(): string {
  return localStorage.getItem('wc_api_key') || DEFAULT_API_KEY;
}

export function setApiKey(key: string) {
  localStorage.setItem('wc_api_key', key);
}

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${FOOTBALL_API_BASE}${path}`, {
    headers: { 'X-Auth-Token': getApiKey() },
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }
  return res.json();
}

export async function getMatches(matchday?: number): Promise<Match[]> {
  const qs = matchday ? `?matchday=${matchday}` : '';
  const data = await apiFetch<{ matches: Match[] }>(
    `/competitions/${WC_COMPETITION}/matches${qs}`
  );
  return data.matches;
}

export async function getStandings(): Promise<Array<{ stage: string; group: string; table: Standing[] }>> {
  const data = await apiFetch<{ standings: Array<{ stage: string; group: string; table: Standing[] }> }>(
    `/competitions/${WC_COMPETITION}/standings`
  );
  return data.standings;
}

export async function getScorers(): Promise<Scorer[]> {
  const data = await apiFetch<{ scorers: Scorer[] }>(
    `/competitions/${WC_COMPETITION}/scorers?limit=20`
  );
  return data.scorers;
}
