import React from 'react';
import { render, screen } from '@testing-library/react';
import { PluginType } from '@grafana/data';
import AppConfig, { AppConfigProps } from './AppConfig';

const makeProps = (): AppConfigProps =>
  ({
    plugin: {
      meta: {
        id: 'paulbarnett-worldcup-app',
        name: 'World Cup 2026',
        type: PluginType.app,
        enabled: true,
        jsonData: {},
      },
    },
    query: {},
  } as unknown as AppConfigProps);

describe('AppConfig', () => {
  it('renders the API key input', () => {
    render(<AppConfig {...makeProps()} />);
    expect(screen.getByText(/football-data.org api key/i)).toBeInTheDocument();
  });

  it('renders the Save button', () => {
    render(<AppConfig {...makeProps()} />);
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });
});
