# 技術仕様書 - 建設工具マスター

## 1. 技術スタック
*   **フレームワーク:** React (v18+)
*   **ビルドツール:** Vite
*   **言語:** TypeScript
*   **スタイリング:** Tailwind CSS (迅速かつモバイルファーストなUI構築のため)
*   **状態管理:** React Context API (この規模であれば十分)
*   **ルーティング:** React Router DOM

## 2. プロジェクト構造
```
/src
  /assets        # 画像、フォント
  /components    # 再利用可能なUIコンポーネント (Button, Card, Timer)
  /data          # 工具データのJSON
  /pages         # 画面コンポーネント (Home, Game, Result)
  /hooks         # カスタムフック (useGameLogic, useScore)
  /types         # TypeScript型定義
  App.tsx        # メインエントリ
  main.tsx       # DOMレンダラー
```

## 3. データスキーマ (TypeScript Interface)
```typescript
interface Tool {
  id: string;
  formalName: string;      // 正式名称
  colloquialNames: string[]; // 通称・あだ名
  description: string;     // 解説
  imageUrl: string;        // 画像パス
  category: 'power' | 'hand' | 'safety' | 'measurement'; // カテゴリ
  difficulty: 1 | 2 | 3;   // 難易度
}

interface GameState {
  currentQuestionIndex: number; // 現在の問題番号
  score: number;                // スコア
  timeLeft: number;             // 残り時間
  isGameOver: boolean;          // ゲーム終了フラグ
  history: { toolId: string; correct: boolean }[]; // 回答履歴
}
```

## 4. 主要コンポーネント
*   **`GameEngine`**: ゲームループ、タイマー、スコア計算を管理。
*   **`ToolCard`**: 工具画像を表示し、ユーザーの回答操作を受け付ける。
*   **`ResultSummary`**: ゲーム終了時に成績レポートを表示する。

## 5. デプロイ
*   **プラットフォーム:** 静的Webホスティング (Vercel, Netlify, GitHub Pagesなど)。
*   **CI/CD:** GitHub Actionsによる基本的なビルド検証。
