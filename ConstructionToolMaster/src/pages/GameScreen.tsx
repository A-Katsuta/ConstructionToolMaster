import React, { useMemo } from 'react';
import { ToolCard } from '../components/ToolCard';
import { Button } from '../components/Button';
import type { Tool } from '../types';
import { tools } from '../data/tools';

interface GameScreenProps {
    currentTool: Tool;
    currentQuestionIndex: number;
    totalQuestions: number;
    score: number;
    timeLeft: number;
    mode: 'learning' | 'score_attack' | null;
    onAnswer: (isCorrect: boolean, userAnswer: string) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
    currentTool,
    currentQuestionIndex,
    totalQuestions,
    score,
    timeLeft,
    mode,
    onAnswer,
}) => {
    // Generate options (1 correct + 3 distractors)
    const options = useMemo(() => {
        const distractors = tools
            .filter(t => t.id !== currentTool.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const allOptions = [currentTool, ...distractors]
            .sort(() => Math.random() - 0.5);

        return allOptions;
    }, [currentTool]);

    const handleOptionClick = (selectedTool: Tool) => {
        const isCorrect = selectedTool.id === currentTool.id;
        onAnswer(isCorrect, selectedTool.formalName);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            {/* Header Info */}
            <div className="w-full max-w-md flex justify-between items-center mb-6 text-white">
                <div className="text-lg font-mono">
                    Q. {currentQuestionIndex + 1} / {totalQuestions}
                </div>
                <div className="flex gap-4">
                    {mode === 'score_attack' && (
                        <div className={`text-xl font-bold font-mono ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-yellow-500'}`}>
                            Time: {timeLeft}
                        </div>
                    )}
                    <div className="text-xl font-bold text-blue-400">
                        Score: {score}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-md space-y-6">
                <ToolCard tool={currentTool} showName={false} />

                <div className="grid grid-cols-1 gap-3">
                    {options.map((option) => (
                        <Button
                            key={option.id}
                            variant="secondary"
                            className="w-full py-4 text-lg justify-start px-6"
                            onClick={() => handleOptionClick(option)}
                        >
                            {option.formalName}
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    );
};
