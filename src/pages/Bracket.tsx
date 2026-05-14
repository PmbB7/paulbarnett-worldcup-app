import React, { useEffect, useState } from 'react';
import { PluginPage } from '@grafana/runtime';
import { useStyles2, Spinner } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { css } from '@emotion/css';
import { getMatches, Match } from '../api/footballApi';

const KNOCKOUT_STAGES = ['ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL'];
const STAGE_LABELS: Record<string, string> = {
  ROUND_OF_16: 'Round of 16',
  QUARTER_FINALS: 'Quarter-Finals',
  SEMI_FINALS: 'Semi-Finals',
  THIRD_PLACE: '3rd Place',
  FINAL: 'Final',
};

function BracketMatch({ match }: { match: Match }) {
  const styles = useStyles2(getBracketMatchStyles);
  const isFinished = match.status === 'FINISHED';
  const homeWon = isFinished && match.score.winner === 'HOME_TEAM';
  const awayWon = isFinished && match.score.winner === 'AWAY_TEAM';

  return (
    <div className={styles.match}>
      <div className={`${styles.team} ${homeWon ? styles.winner : ''}`}>
        {match.homeTeam.crest && <img src={match.homeTeam.crest} alt="" className={styles.crest} />}
        <span className={styles.name}>{match.homeTeam.shortName || 'TBD'}</span>
        <span className={styles.score}>{isFinished ? match.score.fullTime.home : ''}</span>
      </div>
      <div className={`${styles.team} ${awayWon ? styles.winner : ''}`}>
        {match.awayTeam.crest && <img src={match.awayTeam.crest} alt="" className={styles.crest} />}
        <span className={styles.name}>{match.awayTeam.shortName || 'TBD'}</span>
        <span className={styles.score}>{isFinished ? match.score.fullTime.away : ''}</span>
      </div>
    </div>
  );
}

export default function BracketPage() {
  const styles = useStyles2(getStyles);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMatches()
      .then((all) => setMatches(all.filter((m) => KNOCKOUT_STAGES.includes(m.stage))))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PluginPage><Spinner /></PluginPage>;
  if (error) return <PluginPage><div className={styles.error}>{error}</div></PluginPage>;

  const byStage = KNOCKOUT_STAGES.reduce<Record<string, Match[]>>((acc, s) => {
    acc[s] = matches.filter((m) => m.stage === s);
    return acc;
  }, {});

  const hasKnockout = matches.length > 0;

  return (
    <PluginPage>
      <div className={styles.page}>
        {!hasKnockout ? (
          <div className={styles.placeholder}>
            <div className={styles.trophy}>🏆</div>
            <h2>Knockout stage hasn't started yet</h2>
            <p>Check back once the group stage is complete.</p>
          </div>
        ) : (
          <div className={styles.bracket}>
            {KNOCKOUT_STAGES.filter((s) => s !== 'THIRD_PLACE').map((stage) => (
              <div key={stage} className={styles.round}>
                <h3 className={styles.roundTitle}>{STAGE_LABELS[stage]}</h3>
                <div className={styles.matches}>
                  {byStage[stage].map((m) => <BracketMatch key={m.id} match={m} />)}
                  {byStage[stage].length === 0 && <div className={styles.tbd}>TBD</div>}
                </div>
              </div>
            ))}
          </div>
        )}
        {byStage['THIRD_PLACE']?.length > 0 && (
          <div className={styles.thirdPlace}>
            <h3 className={styles.roundTitle}>3rd Place Play-off</h3>
            {byStage['THIRD_PLACE'].map((m) => <BracketMatch key={m.id} match={m} />)}
          </div>
        )}
      </div>
    </PluginPage>
  );
}

const getBracketMatchStyles = (theme: GrafanaTheme2) => ({
  match: css`
    background: ${theme.colors.background.secondary};
    border: 1px solid ${theme.colors.border.weak};
    border-radius: ${theme.shape.radius.default};
    overflow: hidden; min-width: 180px;
  `,
  team: css`
    display: flex; align-items: center; gap: ${theme.spacing(1)};
    padding: ${theme.spacing(0.75, 1)};
    border-bottom: 1px solid ${theme.colors.border.weak};
    &:last-child { border-bottom: none; }
  `,
  winner: css`background: ${theme.colors.success.transparent}; font-weight: 700;`,
  crest: css`width: 18px; height: 18px; object-fit: contain;`,
  name: css`flex: 1; font-size: 13px;`,
  score: css`font-weight: 700; font-size: 14px; color: ${theme.colors.text.primary}; min-width: 16px; text-align: right;`,
});

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`padding: ${theme.spacing(2)};`,
  error: css`color: ${theme.colors.error.text}; padding: ${theme.spacing(4)};`,
  bracket: css`display: flex; gap: ${theme.spacing(4)}; overflow-x: auto; padding-bottom: ${theme.spacing(2)};`,
  round: css`display: flex; flex-direction: column; gap: ${theme.spacing(2)}; min-width: 200px;`,
  roundTitle: css`font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${theme.colors.text.secondary}; margin-bottom: ${theme.spacing(1)};`,
  matches: css`display: flex; flex-direction: column; gap: ${theme.spacing(2)};`,
  tbd: css`color: ${theme.colors.text.disabled}; font-style: italic;`,
  thirdPlace: css`margin-top: ${theme.spacing(3)}; max-width: 220px;`,
  placeholder: css`text-align: center; padding: ${theme.spacing(8)}; color: ${theme.colors.text.secondary};`,
  trophy: css`font-size: 64px; margin-bottom: ${theme.spacing(2)};`,
});
