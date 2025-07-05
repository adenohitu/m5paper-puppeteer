# M5Paper Puppeteer Screenshot API

Puppeteer を使用した Web ページスクリーンショット撮影 API サービスです。Hono.js をベースとしたモダンな Web アプリケーションで、フロントエンド UI と REST API の両方を提供します。

## 🚀 機能

- **Web ページスクリーンショット撮影**: 任意の URL のスクリーンショットを撮影
- **カスタマイズ可能な設定**: 幅、高さ、形式、品質、フルページ撮影の設定
- **モダンな UI**: レスポンシブな Web インターフェース
- **REST API**: プログラムからのアクセス可能
- **Docker 対応**: コンテナ化による簡単デプロイ

## 📋 API 仕様

### エンドポイント

```
GET /screenshot
```

### パラメータ

- `url` (必須): スクリーンショットを撮影する URL
- `width` (オプション): 幅 (px, デフォルト: 1200, 1-4000)
- `height` (オプション): 高さ (px, デフォルト: 800, 1-4000)
- `format` (オプション): 画像形式 (png|jpeg, デフォルト: png)
- `quality` (オプション): JPEG 品質 (1-100, デフォルト: 90)
- `fullPage` (オプション): フルページ撮影 (true|false, デフォルト: false)

### 使用例

```bash
# PNGでスクリーンショット撮影
curl "http://localhost:3000/screenshot?url=https://example.com&width=1200&height=800"

# JPEGでフルページ撮影
curl "http://localhost:3000/screenshot?url=https://example.com&format=jpeg&quality=90&fullPage=true"
```

## 🛠️ 開発環境のセットアップ

### 前提条件

- Node.js 18 以上
- npm

### インストール

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

### ビルド

```bash
# TypeScriptビルド
npm run build

# 本番環境での実行
npm start
```

## 🐳 Docker 環境での実行

### 基本的な実行

```bash
# Dockerイメージのビルド
docker build -t m5paper-puppeteer .

# コンテナの実行
docker run -p 3000:3000 m5paper-puppeteer
```

### Docker Compose での実行

```bash
# サービスの起動
docker-compose up -d

# ログの確認
docker-compose logs -f

# サービスの停止
docker-compose down
```

## 📁 プロジェクト構造

```
m5paper-puppeteer/
├── src/
│   ├── index.ts              # メインサーバー
│   ├── screenshot.ts         # スクリーンショット機能
│   └── utils/
│       └── validation.ts     # パラメータ検証
├── public/
│   ├── index.html           # フロントエンドHTML
│   ├── style.css            # スタイルシート
│   └── script.js            # フロントエンドJS
├── dist/                    # ビルド出力
├── package.json
├── tsconfig.json
├── Dockerfile
├── compose.yaml
├── nginx.conf
└── README.md
```

## 🔧 設定

### 環境変数

- `PORT`: サーバーポート (デフォルト: 3000)
- `NODE_ENV`: 実行環境 (development|production)

### Puppeteer 設定

- ヘッドレスモード
- サンドボックス無効化 (Docker 環境用)
- 最大待機時間: 30 秒

## 🚀 デプロイ

### 本番環境

```bash
# 本番ビルド
npm run build

# 本番サーバー起動
NODE_ENV=production npm start
```

### Docker Compose での本番デプロイ

```bash
# バックグラウンドでサービス起動
docker-compose up -d

# Nginxリバースプロキシ付き
docker-compose -f compose.yaml up -d
```

## 📊 ヘルスチェック

```bash
# ヘルスチェックエンドポイント
curl http://localhost:3000/health
```

## 🔍 API ドキュメント

```bash
# APIドキュメントの表示
curl http://localhost:3000/api-docs
```

## 🎯 使用例

### フロントエンド

1. `http://localhost:3000` にアクセス
2. URL と設定を入力
3. スクリーンショット撮影
4. 画像のプレビューとダウンロード

### プログラムからの利用

```javascript
// JavaScript例
const response = await fetch(
  "/screenshot?url=https://example.com&width=1200&height=800"
);
const blob = await response.blob();
const imageUrl = URL.createObjectURL(blob);
```

## 🛡️ セキュリティ

- URL 検証
- パラメータ検証
- タイムアウト設定
- サンドボックス環境

## 📝 ライセンス

MIT License

## 🤝 貢献

1. フォークしてください
2. 機能ブランチを作成してください
3. 変更をコミットしてください
4. プルリクエストを作成してください

## 🐛 トラブルシューティング

### よくある問題

1. **Chrome/Chromium が見つからない**: Docker を使用するか、適切な Chromium をインストールしてください
2. **メモリ不足**: `--max-old-space-size`オプションを使用してください
3. **タイムアウト**: ネットワーク接続やターゲットサイトの応答時間を確認してください

### ログ確認

```bash
# Docker環境でのログ確認
docker-compose logs -f m5paper-puppeteer
```
