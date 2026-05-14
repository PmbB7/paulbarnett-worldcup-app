import React, { useEffect, useState } from 'react';
import { EmbeddedScene, SceneFlexLayout, SceneFlexItem, SceneReactObject, SceneVariableSet, CustomVariable } from '@grafana/scenes';
import { PluginPage } from '@grafana/runtime';
import { useStyles2, Select, Badge, Spinner } from '@grafana/ui';
import { GrafanaTheme2, SelectableValue } from '@grafana/data';
import { css } from '@emotion/css';
import { getMatches, Match } from '../api/footballApi';

function statusColor(status: Match['status']): 'green' | 'orange' | 'blue' | 'red' | 'purple' {
  switch (status) {
    case 'FINISHED': return 'blue';
    case 'IN_PLAY':
    case 'LIVE': return 'green';
    case 'PAUSED': return 'orange';
    default: return 'purple';
  }
}

function MatchCard({ match }: { match: Match }) {
  const styles = useStyles2(getMatchCardStyles);
  const date = new Date(match.utcDate);
  const isFinished = match.status === 'FINISHED';
  const isLive = match.status === 'IN_PLAY' || match.status === 'LIVE';

  return (
    <div className={styles.card}>
      <div className={styles.meta}>
        <span>{match.group ?? match.stage}</span>
        <Badge
          text={isLive ? '● LIVE' : match.status}
          color={statusColor(match.status)}
        />
      </div>
      <div className={styles.date}>
        {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
        {' · '}
        {date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div className={styles.teams}>
        <div className={styles.team}>
          {match.homeTeam.crest && <img src={match.homeTeam.crest} alt="" className={styles.crest} />}
          <span>{match.homeTeam.shortName}</span>
        </div>
        <div className={styles.score}>
          {isFinished || isLive
            ? `${match.score.fullTime.home ?? 0} – ${match.score.fullTime.away ?? 0}`
            : 'vs'}
        </div>
        <div className={`${styles.team} ${styles.teamRight}`}>
          {match.awayTeam.crest && <img src={match.awayTeam.crest} alt="" className={styles.crest} />}
          <span>{match.awayTeam.shortName}</span>
        </div>
      </div>
    </div>
  );
}

function MatchesPage() {
  const styles = useStyles2(getStyles);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [matchday, setMatchday] = useState<SelectableValue<number>>({ label: 'All', value: undefined });

  const matchdayOptions: Array<SelectableValue<number>> = [
    { label: 'All Matchdays', value: undefined },
    ...Array.from({ length: 8 }, (_, i) => ({ label: `Matchday ${i + 1}`, value: i + 1 })),
  ];

  useEffect(() => {
    setLoading(true);
    getMatches(matchday.value)
      .then(setMatches)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [matchday.value]);

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  const grouped = matches.reduce<Record<string, Match[]>>((acc, m) => {
    const key = m.group ?? m.stage;
    acc[key] = acc[key] ?? [];
    acc[key].push(m);
    return acc;
  }, {});

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <Select options={matchdayOptions} value={matchday} onChange={setMatchday} width={20} />
      </div>
      {loading ? (
        <Spinner />
      ) : (
        Object.entries(grouped).map(([group, groupMatches]) => (
          <div key={group} className={styles.group}>
            <h3 className={styles.groupTitle}>{group}</h3>
            <div className={styles.grid}>
              {groupMatches.map((m) => <MatchCard key={m.id} match={m} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const getMatchCardStyles = (theme: GrafanaTheme2) => ({
  card: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    padding: ${theme.spacing(2)};
    display: flex; flex-direction: column; gap: ${theme.spacing(1)};
  `,
  meta: css`display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: ${theme.colors.text.secondary};`,
  date: css`font-size: 12px; color: ${theme.colors.text.secondary};`,
  teams: css`display: flex; align-items: center; justify-content: space-between; gap: ${theme.spacing(1)};`,
  team: css`display: flex; align-items: center; gap: ${theme.spacing(1)}; flex: 1; font-weight: 500;`,
  teamRight: css`justify-content: flex-end; text-align: right;`,
  crest: css`width: 28px; height: 28px; object-fit: contain;`,
  score: css`font-size: 20px; font-weight: 700; color: ${theme.colors.text.primary}; min-width: 60px; text-align: center;`,
});

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`padding: ${theme.spacing(2)};`,
  toolbar: css`margin-bottom: ${theme.spacing(2)};`,
  error: css`color: ${theme.colors.error.text}; padding: ${theme.spacing(4)};`,
  group: css`margin-bottom: ${theme.spacing(3)};`,
  groupTitle: css`color: ${theme.colors.text.secondary}; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: ${theme.spacing(1.5)};`,
  grid: css`display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: ${theme.spacing(2)};`,
});

export default function MatchesPageWrapper() {
  return (
    <PluginPage>
      <MatchesPage />
    </PluginPage>
  );
}
