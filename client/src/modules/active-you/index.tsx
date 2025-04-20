import React from 'react';
import Layout from './layout';
import Dashboard from './components/dashboard';
import { ExerciseType } from './context/module-context';

interface ActiveYouModuleProps {
  defaultTab?: ExerciseType;
}

export default function ActiveYouModule({ defaultTab = 'meditation' }: ActiveYouModuleProps) {
  return (
    <Layout defaultTab={defaultTab}>
      <Dashboard />
    </Layout>
  );
}