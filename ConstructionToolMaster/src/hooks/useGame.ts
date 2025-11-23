import { useState, useEffect, useCallback } from 'react';
import type { Tool, GameState, GameHistory } from '../types';
import { tools } from '../data/tools';

const QUESTIONS_PER_ROUND = 5;
const TIME_LIMIT = 60; // 60 seconds for Score Attack

export const useGame = () => {
    const [gameState, setGameState] = useState<GameState>({
        currentQuestionIndex: 0,
        score: 0,
        correctCount: 0,
        timeLeft: TIME_LIMIT,
        isGameOver: false,
        isPlaying: false,
        mode: null,
        history: [],
    });

    const [shuffledTools, setShuffledTools] = useState<Tool[]>([]);

    const startGame = useCallback((mode: 'learning' | 'score_attack') => {
        // Shuffle tools
        const shuffled = [...tools].sort(() => Math.random() - 0.5).slice(0, QUESTIONS_PER_ROUND);
        setShuffledTools(shuffled);

        setGameState({
            currentQuestionIndex: 0,
            score: 0,
            correctCount: 0,
            timeLeft: TIME_LIMIT,
            isGameOver: false,
            isPlaying: true,
            mode,
            history: [],
        });
    }, []);

    const answerQuestion = useCallback((isCorrect: boolean, userAnswer?: string) => {
        setGameState(prev => {
            const newScore = isCorrect ? prev.score + (prev.mode === 'score_attack' ? 100 : 10) : prev.score;
            const newHistory: GameHistory = {
                toolId: shuffledTools[prev.currentQuestionIndex].id,
                isCorrect,
                userAnswer
            };

            const isLastQuestion = prev.currentQuestionIndex >= shuffledTools.length - 1;

            if (isLastQuestion) {
                return {
                    ...prev,
                    score: newScore,
                    correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
                    history: [...prev.history, newHistory],
                    isGameOver: true,
                    isPlaying: false,
                };
            }

            return {
                ...prev,
                score: newScore,
                correctCount: isCorrect ? prev.correctCount + 1 : prev.correctCount,
                history: [...prev.history, newHistory],
                currentQuestionIndex: prev.currentQuestionIndex + 1,
            };
        });
    }, [shuffledTools]);

    useEffect(() => {
        let timer: number;
        if (gameState.isPlaying && gameState.mode === 'score_attack' && gameState.timeLeft > 0) {
            timer = window.setInterval(() => {
                setGameState(prev => {
                    if (prev.timeLeft <= 1) {
                        return { ...prev, timeLeft: 0, isGameOver: true, isPlaying: false };
                    }
                    return { ...prev, timeLeft: prev.timeLeft - 1 };
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState.isPlaying, gameState.mode, gameState.timeLeft]);

    const currentTool = shuffledTools[gameState.currentQuestionIndex];

    return {
        gameState,
        currentTool,
        startGame,
        answerQuestion,
        totalQuestions: shuffledTools.length,
    };
};
