import { useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { useWebHaptics } from 'web-haptics/react';
import HomeScreen from './screens/HomeScreen.jsx';
import GameScreen from './screens/GameScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import EndScreen from './screens/EndScreen.jsx';
import { MAX_ROUNDS, STORAGE_KEYS } from './constants/game.js';
import { pickTerms } from './utils/random.js';
import { runWithViewTransition } from './utils/viewTransition.js';
import { setHapticsTrigger } from './utils/haptics.js';

export default function App() {
  const { trigger, isSupported } = useWebHaptics();
  useEffect(() => {
    setHapticsTrigger(trigger, isSupported);
  }, [trigger, isSupported]);

  const [screen, setScreen] = useState('home');
  const [terms, setTerms] = useState([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [scores, setScores] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [gameStart, setGameStart] = useState(null);
  const [finalTime, setFinalTime] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastRoundScore, setLastRoundScore] = useState(0);

  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem(STORAGE_KEYS.highScore) || '0'));
  const [bestTime, setBestTime] = useState(() => {
    const v = localStorage.getItem(STORAGE_KEYS.bestTime);
    return v ? parseInt(v) : null;
  });

  function startGame() {
    runWithViewTransition(() => {
      flushSync(() => {
        setTerms(pickTerms());
        setRoundIdx(0);
        setScores([]);
        setTotalScore(0);
        setGameStart(Date.now());
        setShowResult(false);
        setScreen('game');
      });
    });
  }

  function handleRoundEnd(roundScore) {
    runWithViewTransition(() => {
      flushSync(() => {
        setScores((prev) => [...prev, roundScore]);
        setTotalScore((prev) => prev + roundScore);
        setLastRoundScore(roundScore);
        setShowResult(true);
      });
    });
  }

  function handleNextRound() {
    runWithViewTransition(() => {
      flushSync(() => {
        setShowResult(false);
        if (roundIdx >= MAX_ROUNDS - 1) {
          const elapsed = Date.now() - gameStart;
          setFinalTime(elapsed);
          if (totalScore >= highScore) {
            setHighScore(totalScore);
            localStorage.setItem(STORAGE_KEYS.highScore, String(totalScore));
          }
          if (!bestTime || elapsed < bestTime) {
            setBestTime(elapsed);
            localStorage.setItem(STORAGE_KEYS.bestTime, String(elapsed));
          }
          setScreen('end');
        } else {
          setRoundIdx(roundIdx + 1);
          setScreen('game');
        }
      });
    });
  }

  if (screen === 'home') {
    return <HomeScreen highScore={highScore} bestTime={bestTime} onStart={startGame} />;
  }

  if (screen === 'game' && !showResult && terms.length) {
    return (
      <GameScreen
        key={roundIdx}
        term={terms[roundIdx]}
        roundNum={roundIdx + 1}
        totalScore={totalScore}
        onRoundEnd={handleRoundEnd}
      />
    );
  }

  if (showResult && terms.length) {
    return (
      <ResultScreen
        term={terms[roundIdx]}
        roundScore={lastRoundScore}
        totalEarnings={totalScore}
        roundNum={roundIdx + 1}
        totalRounds={MAX_ROUNDS}
        onNext={handleNextRound}
      />
    );
  }

  if (screen === 'end') {
    return (
      <EndScreen
        finalScore={totalScore}
        totalTime={finalTime}
        highScore={Math.max(highScore, totalScore)}
        bestTime={bestTime}
        onPlayAgain={startGame}
      />
    );
  }

  return null;
}
