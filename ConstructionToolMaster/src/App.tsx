import { useGame } from './hooks/useGame';
import { TitleScreen } from './pages/TitleScreen';
import { GameScreen } from './pages/GameScreen';
import { ResultScreen } from './pages/ResultScreen';

function App() {
  const { gameState, currentTool, startGame, answerQuestion, resetGame, totalQuestions } = useGame();

  // Render Title Screen
  if (!gameState.isPlaying && !gameState.isGameOver) {
    return <TitleScreen onStart={startGame} />;
  }

  // Render Result Screen
  if (gameState.isGameOver) {
    return (
      <ResultScreen
        score={gameState.score}
        history={gameState.history}
        onRetry={resetGame}
      />
    );
  }

  // Render Game Screen
  if (gameState.isPlaying && currentTool) {
    return (
      <GameScreen
        currentTool={currentTool}
        currentQuestionIndex={gameState.currentQuestionIndex}
        totalQuestions={totalQuestions}
        score={gameState.score}
        timeLeft={gameState.timeLeft}
        mode={gameState.mode}
        onAnswer={answerQuestion}
      />
    );
  }

  return null;
}

export default App;
