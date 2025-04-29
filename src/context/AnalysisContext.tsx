
import React, { createContext, useContext, useState } from 'react';

interface AnalysisContextType {
  analysisId: string | null;
  setAnalysisId: (id: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [analysisId, setAnalysisId] = useState<string | null>(null);

  return (
    <AnalysisContext.Provider value={{ analysisId, setAnalysisId }}>
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};
