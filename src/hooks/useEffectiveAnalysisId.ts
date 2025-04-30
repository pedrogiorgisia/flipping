
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

export function useEffectiveAnalysisId() {
  const { id } = useParams();
  const { analysisId, setAnalysisId } = useAnalysis();

  useEffect(() => {
    if (!analysisId && id) {
      setAnalysisId(id);
    }
  }, [analysisId, id]);

  return analysisId || id || null;
}
