import React from 'react';
import { Button } from '../components/Button';

interface TitleScreenProps {
    onStart: (mode: 'learning' | 'score_attack') => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-500 mb-2">
                建設工具マスター
            </h1>
            <p className="text-gray-400 mb-12 text-lg">
                正式名称と現場の通称を覚えよう！
            </p>

            <div className="space-y-4 w-full max-w-xs">
                <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => onStart('learning')}
                >
                    学習モード (時間無制限)
                </Button>

                <Button
                    variant="secondary"
                    size="lg"
                    className="w-full"
                    onClick={() => onStart('score_attack')}
                >
                    スコアアタック (60秒)
                </Button>
            </div>

            <div className="mt-12 text-gray-600 text-sm">
                &copy; 2025 Construction Tool Master
            </div>
        </div>
    );
};
