export type ToolCategory = 'power' | 'hand' | 'safety' | 'measurement' | 'other';

export interface Tool {
    id: string;
    formalName: string;
    colloquialNames: string[];
    description: string;
    imageUrl: string;
    category: ToolCategory;
    difficulty: 1 | 2 | 3;
}

export interface GameState {
    currentQuestionIndex: number;
    score: number;
    correctCount: number;
    timeLeft: number;
    isGameOver: boolean;
    isPlaying: boolean;
    mode: 'learning' | 'score_attack' | null;
    history: GameHistory[];
}

export interface GameHistory {
    toolId: string;
    isCorrect: boolean;
    userAnswer?: string;
}
