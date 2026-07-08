import { useCallback, useRef } from "react";
import { useGame } from "../context/GameContext";
import { useTokens } from "../context/TokenContext";

export function useGameProgress(_gameId: string, gameTitle: string) {
  const { playGame, addExperience, addPoints, logActivity } = useGame();
  const { award } = useTokens();
  const startedRef = useRef(false);

  const startGame = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    playGame();
    logActivity(3);
  }, [playGame, logActivity]);

  const completeGame = useCallback(
    (score: number, maxScore: number, difficulty: string = "Medium") => {
      const pct = Math.min(score / maxScore, 1);
      const xp = Math.round(pct * 100);

      let tokens = 2;
      if (pct >= 0.9) tokens = 10;
      else if (pct >= 0.7) tokens = 7;
      else if (pct >= 0.5) tokens = 5;

      const difficultyMultiplier =
        difficulty === "Hard" ? 1.5 : difficulty === "Easy" ? 0.5 : 1;
      const finalTokens = Math.round(tokens * difficultyMultiplier);

      addExperience(xp);
      addPoints(finalTokens);
      award(finalTokens, `Completed ${gameTitle}: ${score}/${maxScore}`);
    },
    [addExperience, addPoints, award, gameTitle]
  );

  const completeWithTokenBonus = useCallback(
    (score: number, maxScore: number, extraTokens: number, difficulty: string = "Medium") => {
      const pct = Math.min(score / maxScore, 1);
      const xp = Math.round(pct * 100);

      let baseTokens = 2;
      if (pct >= 0.9) baseTokens = 10;
      else if (pct >= 0.7) baseTokens = 7;
      else if (pct >= 0.5) baseTokens = 5;

      const difficultyMultiplier =
        difficulty === "Hard" ? 1.5 : difficulty === "Easy" ? 0.5 : 1;
      const finalTokens = Math.round(baseTokens * difficultyMultiplier) + extraTokens;

      addExperience(xp);
      addPoints(finalTokens);
      award(finalTokens, `Completed ${gameTitle}: ${score}/${maxScore} (+${extraTokens} bonus)`);
    },
    [addExperience, addPoints, award, gameTitle]
  );

  return { startGame, completeGame, completeWithTokenBonus };
}
