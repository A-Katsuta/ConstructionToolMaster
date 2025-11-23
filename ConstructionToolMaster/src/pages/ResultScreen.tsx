import React from 'react';
import { Button } from '../components/Button';
import type { GameHistory } from '../types';
import { tools } from '../data/tools';

interface ResultScreenProps {
    score: number;
    history: GameHistory[];
    onRetry: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ score, history, onRetry }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <h2 className="text-3xl font-bold text-white mb-4">結果発表</h2>

            <div className="bg-gray-800 rounded-xl p-8 mb-8 text-center w-full max-w-md border border-gray-700">
                <p className="text-gray-400 mb-2">今回のスコア</p>
                <p className="text-6xl font-bold text-yellow-500 mb-4">{score}</p>
                <p className="text-xl text-white">
                    正解数: {history.filter(h => h.isCorrect).length} / {history.length}
                </p>
            </div>

            <div className="w-full max-w-md mb-8">
                <h3 className="text-xl font-bold text-white mb-4">振り返り</h3>
                <div className="space-y-2">
                    {history.map((item, index) => {
                        const tool = tools.find(t => t.id === item.toolId);
                        if (!tool) return null;
                        return (
                            <div key={index} className={`p-3 rounded-lg flex justify-between items-center ${item.isCorrect ? 'bg-green-900/30 border border-green-800' : 'bg-red-900/30 border border-red-800'}`}>
                                <div className="flex items-center gap-3">
                                    <img src={tool.imageUrl} alt={tool.formalName} className="w-10 h-10 rounded object-cover" />
                                    <div>
                                        <p className="text-white font-medium">{tool.formalName}</p>
                                        <p className="text-xs text-gray-400">{tool.colloquialNames[0]}</p>
                                    </div>
                                </div>
                                <span className={item.isCorrect ? 'text-green-400' : 'text-red-400'}>
                                    {item.isCorrect ? '正解' : '不正解'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Button variant="primary" onClick={onRetry}>
                タイトルに戻る
            </Button>
        </div>
    );
};
