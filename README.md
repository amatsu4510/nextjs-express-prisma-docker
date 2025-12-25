# 🚀 フルスタック開発プロジェクト (Docker & Prisma & Next.js)

このプロジェクトは、Dockerを使用して環境構築を自動化し、バックエンド（Express/Prisma）とフロントエンド（Next.js）を連携させた開発テンプレートです。

## 📁 フォルダ構成

- backend/: APIサーバー、Prismaスキーマ、データベース接続設定
- frontend/: Next.js Webアプリケーション
- setup.sh: 型定義同期用の便利スクリプト

## 💻 開発環境（作成者）
- **OS**: Windows 11 + WSL2 (Ubuntu 24.04.3 LTS)
- **IDE**: VSCode (WSL 拡張機能を使用)
- **確認コマンド**: `wsl -l -v` / `lsb_release -a`

## 📋 前提条件

このプロジェクトを動かすには、以下のツールがインストールされている必要があります。

| ツール | 推奨バージョン (動作確認済み) | 確認コマンド |
| :--- | :--- | :--- |
| **Docker** | 28.5.1 以上 | `docker --version` |
| **Docker Compose** | v2.40.2 | `docker compose version` |
| **Node.js** | v20.19.6 | `node -v` |
| **npm** | 10.8.2 | `npm -v` |

## 🛠️ クイックスタート

### 1. 初回起動・環境構築

以下のコマンドを実行して、コンテナの起動とエディタの型補完設定を一括で行います。

```bash
# 実行権限を付与（最初の一回のみ）
chmod +x setup.sh

# セットアップ実行
./setup.sh
```

### 2. 各サービスへのアクセス

起動後、以下のURLで各ツールにアクセスできます。

| サービス | URL | 内容 |
| :--- | :--- | :--- |
| **フロントエンド** | http://localhost:3000 | Next.js アプリケーション |
| **バックエンド** | http://localhost:3001 | Express API サーバー |
| **Prisma Studio** | http://localhost:51212 | データベースのGUI管理画面 |


### 📝 開発中の基本操作

**データの永続化について**

- データベースのデータは db_data ボリュームに保存されます。
- PCをシャットダウンしたり、コンテナを停止してもデータは消えません。
- データを完全にリセットしたい場合のみ、以下のコマンドを実行してください。

```sh
sudo docker compose down -v
```

### エディタに赤線が出たとき

VSCodeなどで型が見つからず赤線が表示された場合は、setup.sh を実行してください。コンテナ内の最新のライブラリ（node_modules）をローカルに同期し、所有権を自分に戻します。

```sh
./setup.sh
```

※実行後、VSCodeで Ctrl + Shift + P -> TypeScript: Restart TS Server を行うとより確実です。

**ログの確認方法**

プログラムがエラーで止まった場合は、ログを確認してください。

```sh
# バックエンドのログ
sudo docker compose logs -f backend

# フロントエンドのログ
sudo docker compose logs -f frontend
```

### 🏗️ 技術スタック
- **DB**: PostgreSQL 15
- **ORM**: Prisma (Postgres用アダプター使用)
- **Backend**: Node.js (Express), TypeScript
- **Frontend**: Next.js, TypeScript
- **Infra**: Docker, Docker Compose V2

### ⚠️ 注意事項

- **ポートの競合**: ローカルで既に PostgreSQL (5432) や Node.js アプリ (3000, 3001) を動かしている場合は、停止してから実行してください。
- **絶対パス**: docker-compose.yml の volumes 設定を変更する際は、必ず /app などの絶対パスを指定してください。

## 📂 主要なファイルの場所（サンプルプログラム）

開発時に編集する主なファイルは以下の通りです。

| 役割 | ファイルパス | 内容 |
| :--- | :--- | :--- |
| **DB定義** | `backend/prisma/schema.prisma` | テーブル構造（スキーマ）を定義 |
| **APIロジック** | `backend/index.ts` | ExpressのルーティングとDB操作 |
| **画面表示** | `frontend/src/app/page.tsx` | Next.jsのメイン画面（API呼び出し） |

---

## 🛠️ スキーマ定義（テーブル構造）の変更手順

新しくテーブルを追加したり、カラム（項目）を増やしたい場合は、以下の手順で行います。

### 1. スキーマファイルを編集
`backend/prisma/schema.prisma` を開いて、`model` 部分を修正します。

```prisma
// 例：Postモデルに content を追加する場合
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?  // ← ここを追加（?は空でもOKの意味）
  createdAt DateTime @default(now())
}
```

### 2. 定義をデータベースに反映
ファイルを保存した後、以下のコマンドを実行すると**即座に実際のDBと型定義に反映**されます。

```bash
# 1. データベースのテーブル構造を更新
sudo docker compose exec backend npx prisma db push

# 2. Prisma Client の型（@prisma/client）を再生成
sudo docker compose exec backend npx prisma generate

# 3. ローカルの node_modules に反映（以前作成した setup.sh を使うのが確実です）
./setup.sh
```

**⚠️ 注意：db push について:** `db push` は開発用の便利なコマンドですが、実行するとDBの構造が書き換わります。
大幅な変更を加える際は、念のため `setup.sh` でデータの同期状態を確認してください。

---

## 💡 サンプルの動作確認方法
1. **Prisma Studio** ([http://localhost:51212](http://localhost:51212)) で `Post` テーブルにいくつかデータを保存します。
2. **Backend API** ([http://localhost:3001/posts](http://localhost:3001/posts)) をブラウザで開き、データが JSON 形式で返ってくるか確認します。
3. **Frontend** ([http://localhost:3000](http://localhost:3000)) を開き、データが画面に表示されているか確認します。