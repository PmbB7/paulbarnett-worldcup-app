import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { AppRootProps, PluginType } from '@grafana/data';
import { render } from '@testing-library/react';
import App from './App';

const makeProps = (): AppRootProps =>
  ({
    basename: '/a/paulbarnett-worldcup-app',
    meta: {
      id: 'paulbarnett-worldcup-app',
      name: 'World Cup 2026',
      type: PluginType.app,
      enabled: true,
      jsonData: {},
    },
    query: {},
    path: '',
    onNavChanged: jest.fn(),
  } as unknown as AppRootProps);

describe('App', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/matches']}>
        <App {...makeProps()} />
      </MemoryRouter>
    );
    expect(container).toBeInTheDocument();
  });
});
