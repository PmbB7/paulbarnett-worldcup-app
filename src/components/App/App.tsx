import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppRootProps } from '@grafana/data';
import { ROUTES } from '../../constants';

const MatchesPage = React.lazy(() => import('../../pages/Matches'));
const TeamsPage   = React.lazy(() => import('../../pages/Teams'));
const PlayersPage = React.lazy(() => import('../../pages/Players'));
const BracketPage = React.lazy(() => import('../../pages/Bracket'));

export default function App(_props: AppRootProps) {
  return (
    <Routes>
      <Route path={ROUTES.Teams}   element={<TeamsPage />} />
      <Route path={ROUTES.Players} element={<PlayersPage />} />
      <Route path={ROUTES.Bracket} element={<BracketPage />} />
      <Route path="*"              element={<MatchesPage />} />
    </Routes>
  );
}
