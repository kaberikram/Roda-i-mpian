import { useEffect, useRef, useState } from 'react';
import { useWebHaptics } from 'web-haptics/react';
import HomeScreen from './screens/HomeScreen.jsx';
import InstructionsScreen from './screens/InstructionsScreen.jsx';
import GameScreen from './screens/GameScreen.jsx';
import ResultScreen from './screens/ResultScreen.jsx';
import EndScreen from './screens/EndScreen.jsx';
import { MAX_ROUNDS, STORAGE_KEYS } from './constants/game.js';
import { pickTerms } from './utils/random.js';
import { setHapticsTrigger } from './utils/haptics.js';

const TRANSITION_MS = 420;

const PRELOAD_IMAGES = [
  '/host.webp',
  '/hostInstruction1.webp',
  '/hostInstructionDone.webp',
  '/fortune-wheel.svg',
];

function preloadImages(srcs) {
  return Promise.all(
    srcs.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          // Resolve regardless of error so a missing file doesn't block the app.
          img.onload = resolve;
          img.onerror = resolve;
          img.src = src;
        }),
    ),
  );
}

function LoadingScreen() {
  return (
    <div
      className="screen"
      style={{
        background: 'radial-gradient(ellipse at 50% -10%, #2A86D6 0%, #185FA5 40%, #0f2d57 100%)',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
      }}
    >
      <img
        src="/fortune-wheel.svg"
        alt=""
        aria-hidden
        style={{ width: 72, height: 72, opacity: 0.9, animation: 'home-wheel-rot 1.4s linear infinite' }}
      />
      <div style={{ fontWeight: 900, fontSize: 28, color: '#fff', letterSpacing: -0.5, textShadow: '0 3px 0 rgba(0,0,0,0.18)' }}>
        Roda i-mpian
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: -8 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#FCD34D',
              opacity: 0.4,
              animation: `home-spark 1s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const { trigger } = useWebHaptics();
  useEffect(() => {
    setHapticsTrigger(trigger);
  }, [trigger]);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    preloadImages(PRELOAD_IMAGES).then(() => setReady(true));
  }, []);

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
    setTerms(pickTerms());
    setRoundIdx(0);
    setScores([]);
    setTotalScore(0);
    setGameStart(Date.now());
    setShowResult(false);
    setScreen('game');
  }

  function handleRoundEnd(roundScore) {
    setScores((prev) => [...prev, roundScore]);
    setTotalScore((prev) => prev + roundScore);
    setLastRoundScore(roundScore);
    setShowResult(true);
  }

  function handleNextRound() {
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
  }

  if (!ready) {
    return <LoadingScreen />;
  }

  let key = 'home';
  let node = null;
  if (screen === 'home') {
    key = 'home';
    node = <HomeScreen highScore={highScore} bestTime={bestTime} onStart={() => setScreen('instructions')} />;
  } else if (screen === 'instructions') {
    key = 'instructions';
    node = <InstructionsScreen onStart={startGame} />;
  } else if (showResult && terms.length) {
    key = `result:${roundIdx}`;
    node = (
      <ResultScreen
        term={terms[roundIdx]}
        roundScore={lastRoundScore}
        totalEarnings={totalScore}
        roundNum={roundIdx + 1}
        totalRounds={MAX_ROUNDS}
        onNext={handleNextRound}
      />
    );
  } else if (screen === 'game' && terms.length) {
    key = `game:${roundIdx}`;
    node = (
      <GameScreen
        key={roundIdx}
        term={terms[roundIdx]}
        roundNum={roundIdx + 1}
        totalScore={totalScore}
        onRoundEnd={handleRoundEnd}
      />
    );
  } else if (screen === 'end') {
    key = 'end';
    node = (
      <EndScreen
        finalScore={totalScore}
        totalTime={finalTime}
        highScore={Math.max(highScore, totalScore)}
        bestTime={bestTime}
        onPlayAgain={startGame}
      />
    );
  }

  if (!node) return null;

  return (
    <ScreenSwitcher screenKey={key} node={node} />
  );
}

function ScreenSwitcher({ screenKey, node }) {
  const [outgoing, setOutgoing] = useState(null);
  const prevRef = useRef({ key: screenKey, node });
  const safetyTimer = useRef(null);

  if (prevRef.current.key !== screenKey && (!outgoing || outgoing.key !== prevRef.current.key)) {
    setOutgoing(prevRef.current);
  }
  prevRef.current = { key: screenKey, node };

  useEffect(() => {
    if (!outgoing) return;
    clearTimeout(safetyTimer.current);
    safetyTimer.current = setTimeout(() => setOutgoing(null), TRANSITION_MS + 80);
    return () => clearTimeout(safetyTimer.current);
  }, [outgoing]);

  function handleExitEnd(e) {
    if (e.target !== e.currentTarget) return;
    if (e.animationName !== 'screen-cross-out') return;
    setOutgoing(null);
  }

  return (
    <>
      {outgoing && (
        <div
          key={outgoing.key}
          className="screen-layer screen-exit"
          onAnimationEnd={handleExitEnd}
          aria-hidden="true"
        >
          {outgoing.node}
        </div>
      )}
      <div key={screenKey} className="screen-layer screen-enter">
        {node}
      </div>
    </>
  );
}
