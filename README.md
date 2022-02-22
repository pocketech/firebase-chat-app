# FireChat

## :star2: OverView

Slack ライクなリアルタイムチャットアプリ

## :bulb: Inspiration

- ポーリングを使わずにリアルタイムなチャットを構築したい
- 本格的なチャットアプリを作ってみたい

## :wrench: Technology Stack

TypeScript, Next.js, ChakraUI,
Firebase(Authentication, Cloud Firestore, Storage,
Cloud Functions, Emulator Suite)

<!-- ## :zap: Feature -->

## :earth_africa: Demo

[デモページ (Vercel)](https://firechat-web.vercel.app/)

<img width="500" alt="スクリーンショット 2022-02-14 9 38 41" src="https://user-images.githubusercontent.com/68690824/153782904-5826af90-9e2e-42c0-b1f4-679ad6fe403e.png"><img width="500" alt="スクリーンショット 2022-02-14 9 39 35" src="https://user-images.githubusercontent.com/68690824/153782908-19656092-4eb2-4e55-b4da-3fc47956956f.png">
<img width="500" alt="スマホ" src="https://user-images.githubusercontent.com/68690824/153783132-62ebface-bfef-43db-a256-5c215563bafa.jpg">

## :clap: Best Parts

- [Identicon](https://zenn.dev/lulzneko/articles/library-for-generating-cute-face-icon-identicons)によるキャッチーなデフォルトアイコンの生成
- Slack ライクなチャット画面
  - 日付による Divider
  - レスポンシブ対応
  - 画像の複数枚アップロード, プレビュー機能
  - 入力文字数によって可変するテキストエリア
  - チャットの作成, メンバーの招待, 退出, 退会時のメタメッセージの表示
  - 投稿メッセージの編集, 削除機能
  - 人数によって切り替わるチャットアイコン
  - メンバー選択 UI
- 画像アップロード時の圧縮処理
  - モバイルからのアップロードサイズを抑えるため
- yup による入力欄のバリデーション
- メール, パスワードによる新規登録フロー
  - アクション URL のカスタマイズ
  - 元のブラウザと、メール認証による遷移先のブラウザで UX を損なわないようフローを若干変えている
- 省データフェッチ
  - チャットリスト取得時のメンバーの取得を 1 クエリにまとめる
  - メッセージ作成者の情報を冗長化してドキュメントに持たせる
  - メッセージ取得の際に全件取得を避けるため onSnapshot をそのまま使わず、過去と未来の取得に分けてページング実装
- 書き込み処理を極力 CloudFunctions に寄せてクライアントからのリクエストを減らす
- アカウント, メッセージ, チャット削除時の Cloud Functions でのバッチ処理
- PWA 化(マニフェストファイルで出来る範囲で)
  - A2HS(AddToHomeScreen)
  - Rich Installer
  - App Shortcut
- 関心事で分離したディレクトリ構成
