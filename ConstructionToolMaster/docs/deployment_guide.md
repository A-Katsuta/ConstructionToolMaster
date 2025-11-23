# デプロイガイド（公開手順）

このドキュメントでは、「建設工具マスター」をインターネット上に公開し、iPhoneから実際にアクセスできるようにする方法を説明します。

## 公開方法の選択

無料で簡単に公開できるサービスとして、以下の2つをお勧めします：

### 1. Vercel（バーセル） - 推奨
**特徴:** 最も簡単。GitHubと連携して自動デプロイ。

### 2. Netlify（ネットリファイ）
**特徴:** Vercelと同様に簡単。ドラッグ&ドロップでもデプロイ可能。

---

## Vercelでのデプロイ手順（推奨）

### ステップ1: GitHubにプッシュ
1.  GitHubアカウントを作成（まだの場合）。
2.  GitHubで新しいリポジトリを作成。
3.  ローカルのプロジェクトをGitHubにプッシュ:
    ```bash
    git remote add origin https://github.com/あなたのユーザー名/リポジトリ名.git
    git branch -M main
    git push -u origin main
    ```

### ステップ2: Vercelにデプロイ
1.  [Vercel](https://vercel.com/)にアクセスし、GitHubアカウントでサインアップ/ログイン。
2.  「New Project」をクリック。
3.  先ほど作成したGitHubリポジトリを選択。
4.  **Framework Preset** が「Vite」になっていることを確認。
5.  「Deploy」ボタンをクリック。
6.  数分でデプロイが完了し、URLが発行されます（例: `https://your-project.vercel.app`）。

### ステップ3: iPhoneでアクセス
1.  発行されたURLをiPhoneのSafariで開く。
2.  「ホーム画面に追加」でアプリ化。

---

## Netlifyでのデプロイ手順（ドラッグ&ドロップ版）

### ステップ1: ビルド
```bash
cd c:/Games/Antigravity/ConstructionToolMaster
npm run build
```

### ステップ2: Netlifyにアップロード
1.  [Netlify](https://www.netlify.com/)にアクセスし、アカウント作成/ログイン。
2.  「Add new site」→「Deploy manually」を選択。
3.  `dist` フォルダをドラッグ&ドロップ。
4.  数秒でデプロイが完了し、URLが発行されます。

---

## デプロイ後の確認事項

### PWAとして動作しているか確認
1.  公開されたURLをPCのChromeで開く。
2.  開発者ツール（F12）→「Application」タブ→「Manifest」を確認。
3.  「建設工具マスター」という名前が表示されていればOK。

### iPhoneでの動作確認
1.  iPhoneのSafariで公開URLを開く。
2.  「共有」→「ホーム画面に追加」。
3.  ホーム画面のアイコンをタップして起動。
4.  アドレスバーが表示されず、全画面で起動すればPWA化成功！

---

## トラブルシューティング

### Q. 「ホーム画面に追加」のオプションが出ない
**A.** HTTPSでアクセスしているか確認してください。VercelやNetlifyは自動的にHTTPSになります。

### Q. アイコンが表示されない
**A.** `public/pwa-192x192.png` と `public/pwa-512x512.png` が正しく配置されているか確認してください。

### Q. デプロイ後に変更が反映されない
**A.** ブラウザのキャッシュをクリアするか、シークレットモードで開いてください。
