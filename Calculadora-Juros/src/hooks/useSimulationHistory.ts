import { useCallback, useEffect, useState } from "react";
import { readScenarios, readSimulationHistory, saveScenario, saveSimulationSnapshot } from "../services/simulation-history";
import type { Scenario } from "../types/scenario";
import type { SimulationSnapshot } from "../types/simulation";

export function useSimulationHistory() {
  const [history, setHistory] = useState<SimulationSnapshot[]>([]);
  const [scenarios, setScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    setHistory(readSimulationHistory());
    setScenarios(readScenarios());
  }, []);

  const addSnapshot = useCallback((snapshot: SimulationSnapshot) => {
    setHistory(saveSimulationSnapshot(snapshot));
  }, []);

  const addScenario = useCallback((scenario: Scenario) => {
    setScenarios(saveScenario(scenario));
  }, []);

  return {
    history,
    scenarios,
    addSnapshot,
    addScenario,
  };
}

