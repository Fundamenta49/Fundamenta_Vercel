import React from 'react';
import QuestSystemDemoWithProvider from '../jungle-path/demo/QuestSystemDemo';

const JunglePathDemoPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Jungle Path Demo</h1>
      <p className="mb-6 text-gray-600">
        This demo showcases the gamified learning experience where standard modules are transformed into jungle-themed quests.
        Toggle "Adventure Mode" to see the jungle-themed version!
      </p>
      <QuestSystemDemoWithProvider />
    </div>
  );
};

export default JunglePathDemoPage;