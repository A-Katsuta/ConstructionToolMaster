# 実装計画

## 目標
「建設工具マスター」の開発環境を構築し、ゲームロジック、UI、各画面を実装する。

## 提案される変更
### プロジェクトセットアップ
- `c:/Games/Antigravity` で `npm create vite@latest . -- --template react-ts` を実行。
- 依存関係のインストール: `npm install`。
- Tailwind CSS のインストールと設定 (v4)。

### ドキュメント
#### [NEW] [game_design.md](file:///c:/Games/Antigravity/docs/game_design.md)
- ゲームループ、画面遷移（タイトル、クイズ、リザルト）、スコアルールの定義。
- 初期の工具カテゴリのリストアップ。

#### [NEW] [tech_specs.md](file:///c:/Games/Antigravity/docs/tech_specs.md)
- 技術スタックの定義 (Vite + React + Tailwind CSS)。
- データ構造の定義 (JSON)。
- プロジェクトディレクトリ構造の定義。

### コア実装
#### [NEW] [src/types/index.ts](file:///c:/Games/Antigravity/src/types/index.ts)
- `Tool` インターフェース定義。
- `GameState` インターフェース定義。

#### [NEW] [src/data/tools.ts](file:///c:/Games/Antigravity/src/data/tools.ts)
- `Tool` オブジェクトの配列を作成。

#### [NEW] [src/hooks/useGame.ts](file:///c:/Games/Antigravity/src/hooks/useGame.ts)
- ゲームロジック（インデックス管理、スコア、タイマー）を管理するフックの実装。

### 機能実装
- **タイトル画面**: モード選択ボタン。
- **ゲーム画面**: 画像表示、選択肢ボタン、スコア表示。
- **リザルト画面**: 結果表示、履歴リスト。

## 検証計画
- `npm run dev` で起動し、各画面の遷移とゲームプレイが正常に動作することを確認。
- `npm run build` でビルドエラーがないことを確認。
