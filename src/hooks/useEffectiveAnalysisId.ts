import { useParams, useLocation } from "react-router-dom";
import { useAnalysisContext } from "../context/AnalysisContext";

export const useEffectiveAnalysisId = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { currentAnalysisId } = useAnalysisContext();

  const analysisIdFromParams = id;
  const analysisIdFromState = (location.state as any)?.id_analise;
  const analysisIdFromStorage = sessionStorage.getItem("idAnalise");

  return (
    analysisIdFromParams ||
    analysisIdFromState ||
    currentAnalysisId ||
    analysisIdFromStorage ||
    null
  );
};
