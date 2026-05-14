import React, { useState } from 'react';
import { AppPluginMeta, GrafanaTheme2, PluginConfigPageProps } from '@grafana/data';
export type AppConfigProps = PluginConfigPageProps<AppPluginMeta>;
import { PluginPage } from '@grafana/runtime';
import { Field, Input, Button, useStyles2, Alert } from '@grafana/ui';
import { css } from '@emotion/css';
import { setApiKey, getApiKey } from '../../api/footballApi';

export default function AppConfig(_props: PluginConfigPageProps<AppPluginMeta>) {
  const styles = useStyles2(getStyles);
  const [key, setKey] = useState(getApiKey());
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('wc_api_key', key);
    setApiKey(key);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PluginPage>
      <div className={styles.page}>
        <h2>World Cup 2026 — Configuration</h2>
        <p className={styles.description}>
          This app uses the <a href="https://www.football-data.org" target="_blank" rel="noreferrer">football-data.org</a> API.
          Sign up for a free account and paste your API key below.
        </p>
        {saved && <Alert title="API key saved!" severity="success" />}
        <Field label="football-data.org API Key" description="Free tier: 10 calls/min, full World Cup data included">
          <Input
            value={key}
            onChange={(e) => setKey(e.currentTarget.value)}
            type="password"
            placeholder="Your API key..."
            width={40}
          />
        </Field>
        <Button onClick={handleSave} disabled={!key}>Save</Button>
      </div>
    </PluginPage>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  page: css`padding: ${theme.spacing(3)}; max-width: 600px;`,
  description: css`color: ${theme.colors.text.secondary}; margin-bottom: ${theme.spacing(3)}; a { color: ${theme.colors.primary.text}; }`,
});
