# 語源で貫く 英単語4000 PWA

大学受験英単語4,000語を、語根・コアイメージ・意味の守備範囲・例文・復習で学ぶ縦向きの静的PWAです。アプリ本体と語彙データは `index.html` に収録され、初回読み込み後はオフラインでも起動できます。

## ローカル確認

PWAは `file://` では動作しません。リポジトリのルートでローカルサーバーを起動してください。

```bash
python3 -m http.server 8080
```

その後、`http://localhost:8080/` を開きます。通常のブラウザではホーム画面のメニューに「アプリをインストール」が表示され、インストール済みのstandalone画面では表示されません。

## GitHub Pagesへ公開

1. このリポジトリをGitHubへpushします。
2. リポジトリの `Settings > Pages` を開きます。
3. `Source` に `Deploy from a branch`、ブランチに `main`、フォルダーに `/ (root)` を選びます。
4. 保存すると、リポジトリ直下のPWAが公開されます。

## 構成

- `index.html` — アプリ本体・4,000語データ・フォント
- `manifest.webmanifest` — PWA情報、通常／maskableアイコン、ショートカット
- `sw.js` — アプリシェルの事前キャッシュとオフライン起動
- `*.png` — PWA、Apple Touch Icon、favicon（すべて直下）

## 対応

- Android Chrome／Edge：メニューのボタンから標準インストール画面を表示
- iPhone／iPad：共有メニューの「ホーム画面に追加」を案内
- 非対応ブラウザ：ブラウザメニューからのインストール方法を案内
- インストールにはHTTPSまたはlocalhostが必要
