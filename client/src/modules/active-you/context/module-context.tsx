import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ExerciseType = 'activeyou' | 'meditation' | 'weightlifting' | 'yoga' | 'running' | 'hiit' | 'stretch';

interface ActiveYouContextType {
  activeTab: ExerciseType;
  setActiveTab: (tab: ExerciseType) => void;
  yogaSessionActive: boolean;
  setYogaSessionActive: (active: boolean) => void;
  runningSessionActive: boolean;
  setRunningSessionActive: (active: boolean) => void;
  hiitSessionActive: boolean;
  setHiitSessionActive: (active: boolean) => void;
  selectedExerciseId: string | null;
  setSelectedExerciseId: (id: string | null) => void;
  openExerciseDetail: boolean;
  setOpenExerciseDetail: (open: boolean) => void;
}

const initialContext: ActiveYouContextType = {
  activeTab: 'meditation',
  setActiveTab: () => {},
  yogaSessionActive: false,
  setYogaSessionActive: () => {},
  runningSessionActive: false,
  setRunningSessionActive: () => {},
  hiitSessionActive: false,
  setHiitSessionActive: () => {},
  selectedExerciseId: null,
  setSelectedExerciseId: () => {},
  openExerciseDetail: false,
  setOpenExerciseDetail: () => {}
};

const ActiveYouContext = createContext<ActiveYouContextType>(initialContext);

export const useActiveYouContext = () => useContext(ActiveYouContext);

export const ActiveYouProvider: React.FC<{ children: ReactNode; defaultTab?: ExerciseType }> = ({
  children,
  defaultTab = 'meditation'
}) => {
  const [activeTab, setActiveTab] = useState<ExerciseType>(defaultTab);
  const [yogaSessionActive, setYogaSessionActive] = useState(false);
  const [runningSessionActive, setRunningSessionActive] = useState(false);
  const [hiitSessionActive, setHiitSessionActive] = useState(false);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [openExerciseDetail, setOpenExerciseDetail] = useState(false);

  return (
    <ActiveYouContext.Provider
      value={{
        activeTab,
        setActiveTab,
        yogaSessionActive,
        setYogaSessionActive,
        runningSessionActive,
        setRunningSessionActive,
        hiitSessionActive,
        setHiitSessionActive,
        selectedExerciseId,
        setSelectedExerciseId,
        openExerciseDetail,
        setOpenExerciseDetail
      }}
    >
      {children}
    </ActiveYouContext.Provider>
  );
};

export function useModuleContext() {
  const context = useContext(ActiveYouContext);
  if (context === undefined) {
    throw new Error('useModuleContext must be used within an ActiveYouProvider');
  }
  return context;
}

export default ActiveYouContext;