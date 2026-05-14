import React, { useEffect, useState } from 'react';
import { PluginPage } from '@grafana/runtime';
import { useStyles2, Spinner } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { getScorers, Scorer } from '../api/footballApi';

export default function PlayersPage() {
  const styles = useStyles2(getStyles);
  const [scorers, setScorers] = useState<Scorer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getScorers()
      .then(setScorers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PluginPage>
      <div className={styles.page}>
        <h2 className={styles.heading}>Top Scorers</h2>
        {loading ? <Spinner /> : error ? <div className={styles.error}>{error}</div> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Player</th>
                <th>Team</th>
                <th>Nationality</th>
                <th>Goals</th>
                <th>Assists</th>
                <th>Penalties</th>
              </tr>
            </thead>
            <tbody>
              {scorers.map((s, i) => (
                <tr key={s.player.id} className={i < 3 ? styles.top3 : ''}>
                  <td className={styles.rank}>
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                  </td>
                  <td className={styles.name}>{s.player.name}</td>
                  <td className={styles.teamCell}>
                    {s.team.crest && <img src={s.team.crest} alt="" className={styles.crest} />}
                    <span>{s.team.shortName}</span>
                  </td>
                  <td>{s.player.nationality}</td>
                  <td className={styles.goals}>{s.goals}</td>
                  <td>{s.assists ?? '–'}</td>
                  <td>{s.penalties ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`padding: ${theme.spacing(2)};`,
  heading: css`margin-bottom: ${theme.spacing(2)};`,
  error: css`color: ${theme.colors.error.text}; padding: ${theme.spacing(4)};`,
  table: css`
    width: 100%; border-collapse: collapse;
    background: ${theme.colors.background.secondary};
    border-radius: ${theme.shape.radius.default}; overflow: hidden;
    th, td { padding: ${theme.spacing(1.5, 2)}; text-align: left; border-bottom: 1px solid ${theme.colors.border.weak}; font-size: 14px; }
    th { background: ${theme.colors.background.canvas}; font-weight: 600; color: ${theme.colors.text.secondary}; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: ${theme.colors.action.hover}; }
  `,
  top3: css`font-weight: 500;`,
  rank: css`text-align: center; width: 40px; font-size: 16px;`,
  name: css`font-weight: 600;`,
  teamCell: css`display: flex; align-items: center; gap: ${theme.spacing(1)};`,
  crest: css`width: 22px; height: 22px; object-fit: contain;`,
  goals: css`font-weight: 700; color: ${theme.colors.success.text}; font-size: 16px;`,
});
