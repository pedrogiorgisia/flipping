
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnalysis } from '../context/AnalysisContext';

export function useEffectiveAnalysisId() {
  const { id } = useParams();
  const { analysisId, setAnalysisId } = useAnalysis();
  const navigate = useNavigate();

  useEffect(() => {
    if (!analysisId && !id) {
      navigate('/analyses');
      return;
    }
    
    if (!analysisId && id) {
      setAnalysisId(id);
    }
  }, [analysisId, id, navigate]);

  const effectiveId = analysisId || id;
  return effectiveId || null;
}
