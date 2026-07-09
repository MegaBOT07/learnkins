import { useCallback, useRef } from "react";
import { useGame } from "../context/GameContext";
import { useTokens } from "../context/TokenContext";
import { progressAPI } from "../utils/api";
import { storeNewAchievements } from "../utils/achievements";

export function useGameProgress(_gameId: string, gameTitle: string) {
  const { playGame, addExperience, addPoints, logActivity } = useGame();
  const { award } = useTokens();
  const startedRef = useRef(false);
  const syncingRef = useRef(false);

  const startGame = useCallback(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    playGame();
    logActivity(3);
  }, [playGame, logActivity]);

  const syncToBackend = useCallback(
    async (score: number, maxScore: number, difficulty: string = "Medium") => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await progressAPI.logGameActivity({
          gameTitle,
          score,
          maxScore,
          difficulty,
        });
        const rawAchievements = res?.data?.newAchievements;
        if (rawAchievements && rawAchievements.length > 0) {
          storeNewAchievements(
            rawAchievements.map((a: any) => ({
              icon: a.icon || '🏆',
              name: a.name || 'Achievement Unlocked',
              points: a.points || 0,
            }))
          );
        }
      } catch {
      } finally {
        syncingRef.current = false;
      }
    },
    [gameTitle]
  );

  const completeGame = useCallback(
    (score: number, maxScore: number, difficulty: string = "Medium") => {
      const pct = Math.min(score / maxScore, 1);
      const xp = Math.round(pct * 50);

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

      syncToBackend(score, maxScore, difficulty);
    },
    [addExperience, addPoints, award, gameTitle, syncToBackend]
  );

  const completeWithTokenBonus = useCallback(
    (score: number, maxScore: number, extraTokens: number, difficulty: string = "Medium") => {
      const pct = Math.min(score / maxScore, 1);
      const xp = Math.round(pct * 50);

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

      syncToBackend(score, maxScore, difficulty);
    },
    [addExperience, addPoints, award, gameTitle, syncToBackend]
  );

  return { startGame, completeGame, completeWithTokenBonus };
}
