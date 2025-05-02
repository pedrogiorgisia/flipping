import React, { createContext, useContext, useState, useEffect } from "react";

interface AnalysisContextType {
  currentAnalysisId: string | null;
  setCurrentAnalysisId: (id: string | null) => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(
  undefined,
);

export const AnalysisProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentAnalysisId, setCurrentAnalysisId] = useState<string | null>(
    () => {
      const savedId = sessionStorage.getItem("idAnalise");
      return savedId;
    },
  );

  useEffect(() => {
    if (currentAnalysisId) {
      sessionStorage.setItem("idAnalise", currentAnalysisId);
    } else {
      sessionStorage.removeItem("idAnalise");
    }
  }, [currentAnalysisId]);

  return (
    <AnalysisContext.Provider
      value={{ currentAnalysisId, setCurrentAnalysisId }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error(
      "useAnalysisContext must be used within an AnalysisProvider",
    );
  }
  return context;
};
