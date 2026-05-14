import pluginJson from './plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;
export const PLUGIN_ID = pluginJson.id;

export enum ROUTES {
  Matches  = 'matches',
  Teams    = 'teams',
  Players  = 'players',
  Bracket  = 'bracket',
}

export const FOOTBALL_API_BASE = 'https://api.football-data.org/v4';
export const WC_COMPETITION = 'WC';
export const WC_SEASON = '2026';
