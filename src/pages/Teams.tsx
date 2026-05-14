import React, { useEffect, useState } from 'react';
import { PluginPage } from '@grafana/runtime';
import { useStyles2, Spinner } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { getStandings, Standing } from '../api/footballApi';

function StandingsTable({ group, table }: { group: string; table: Standing[] }) {
  const styles = useStyles2(getTableStyles);
  return (
    <div className={styles.section}>
      <h3 className={styles.groupTitle}>{group}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
          </tr>
        </thead>
        <tbody>
          {table.map((row) => (
            <tr key={row.team.id} className={row.position <= 2 ? styles.qualified : ''}>
              <td>{row.position}</td>
              <td className={styles.teamCell}>
                {row.team.crest && <img src={row.team.crest} alt="" className={styles.crest} />}
                <span>{row.team.shortName}</span>
              </td>
              <td>{row.playedGames}</td>
              <td>{row.won}</td>
              <td>{row.draw}</td>
              <td>{row.lost}</td>
              <td>{row.goalsFor}</td>
              <td>{row.goalsAgainst}</td>
              <td className={row.goalDifference > 0 ? styles.pos : row.goalDifference < 0 ? styles.neg : ''}>
                {row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}
              </td>
              <td className={styles.points}>{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const getTableStyles = (theme: GrafanaTheme2) => ({
  section: css`margin-bottom: ${theme.spacing(4)};`,
  groupTitle: css`font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.colors.text.secondary}; margin-bottom: ${theme.spacing(1)};`,
  table: css`
    width: 100%; border-collapse: collapse;
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.radius.default};
    overflow: hidden;
    th, td { padding: ${theme.spacing(1, 1.5)}; text-align: center; border-bottom: 1px solid ${theme.colors.border.weak}; font-size: 13px; }
    th { background: ${theme.colors.background.canvas}; font-weight: 600; color: ${theme.colors.text.secondary}; }
    td:nth-child(2) { text-align: left; }
    tr:last-child td { border-bottom: none; }
  `,
  teamCell: css`display: flex; align-items: center; gap: ${theme.spacing(1)};`,
  crest: css`width: 20px; height: 20px; object-fit: contain;`,
  qualified: css`background: ${theme.colors.success.transparent};`,
  points: css`font-weight: 700;`,
  pos: css`color: ${theme.colors.success.text};`,
  neg: css`color: ${theme.colors.error.text};`,
});

export default function TeamsPage() {
  const styles = useStyles2((t: GrafanaTheme2) => ({
    page: css`padding: ${t.spacing(2)};`,
    error: css`color: ${t.colors.error.text}; padding: ${t.spacing(4)};`,
    legend: css`font-size: 11px; color: ${t.colors.text.secondary}; margin-bottom: ${t.spacing(3)};`,
    grid: css`display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: ${t.spacing(3)};`,
  }));

  const [standings, setStandings] = useState<Array<{ stage: string; group: string; table: Standing[] }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStandings()
      .then(setStandings)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PluginPage>
      <div className={styles.page}>
        <p className={styles.legend}>🟢 Highlighted rows = qualified for knockout stage</p>
        {loading ? <Spinner /> : error ? <div className={styles.error}>{error}</div> : (
          <div className={styles.grid}>
            {standings.map((s) => (
              <StandingsTable key={s.group} group={s.group} table={s.table} />
            ))}
          </div>
        )}
      </div>
    </PluginPage>
  );
}
