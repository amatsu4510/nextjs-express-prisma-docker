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

### 🔍 データベースに直接アクセスする (SQL操作)

GUI（Prisma Studio）を通さず、ターミナルから直接SQLを実行してデータを操作・学習する手順です。

#### 1. PostgreSQL コンソール（psql）への接続

Dockerで動いているデータベースサーバーの中に直接入り、対話型コンソールを起動します。

```bash
# プロジェクトのルートディレクトリ（docker-compose.ymlがある場所）で実行
sudo docker compose exec db psql -U user -d my_database
```

- ユーザー名 (-U): user
- データベース名 (-d): my_database
- 終了方法: \q と打ってエンター

#### 2. よく使う SQL コマンド（逆引き）

コンソール（my_database=#）に入った後にコピー＆ペーストで試せます。

| 操作 | コマンド |
| :--- | :--- |
|テーブル一覧を見る | \dt
|テーブルの構造を見る| \d "Post" |
|データを全件取得する | SELECT * FROM "Post"; |
|データを1件追加する | INSERT INTO "Post" (title, content) VALUES ('SQLテスト', '直接入力しました'); |
|表示を日本時間にする | SET TIMEZONE TO 'Asia/Tokyo'; |
|表示を綺麗にする(縦並び) | \x （もう一度打つと元に戻ります） |

**⚠️ 重要なポイント**
- セミコロン ;: SQL文の最後には必ず ; をつけてください。つけ忘れると ...> と表示されて入力待ちになります（その場合は ; だけ打ってエンター）。
- ダブルクォーテーション ": Prismaで作られた大文字を含むテーブル名（Postなど）は、"Post" のように二重引用符で囲む必要があります。
- シングルクォーテーション ': 文字列（データの内容）は、'テスト' のように一重引用符で囲みます。
- 保存時刻 (UTC): DB内の時間は世界標準時で保存されています。表示が9時間ずれているのは正常です。


### 📝 開発中の基本操作

**データの永続化について**

- データベースのデータは db_data ボリュームに保存されます。
- PCをシャットダウンしたり、コンテナを停止してもデータは消えません。
- データを完全にリセットしたい場合のみ、以下のコマンドを実行してください。

```bash
sudo docker compose down -v
```

### エディタに赤線が出たとき

VSCodeなどで型が見つからず赤線が表示された場合は、setup.sh を実行してください。コンテナ内の最新のライブラリ（node_modules）をローカルに同期し、所有権を自分に戻します。

```bash
./setup.sh
```

※実行後、VSCodeで Ctrl + Shift + P -> TypeScript: Restart TS Server を行うとより確実です。

**ログの確認方法**

プログラムがエラーで止まった場合は、ログを確認してください。

```bash
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

## 🛠️ データベース構造（テーブル）の変更手順

新しくテーブルを追加したり、項目（カラム）を増やしたりする方法は2通りあります。

### パターンA：SQLで直接データベースを変更した場合

SQLコンソール（psql）から `CREATE TABLE` や `ALTER TABLE` を実行した後の同期手順です。

```bash
# ① DB（実物）の状態を schema.prisma（設計図）へ逆輸入
sudo docker compose exec backend npx prisma db pull

# ② 型定義を再生成（コード上の入力補完を有効にする）
sudo docker compose exec backend npx prisma generate

# ③ ローカル環境（VSCode）へ型を同期
./setup.sh
```

### パターンB：Prismaスキーマから変更した場合

`backend/prisma/schema.prisma` ファイルを編集して構造を変える。

#### 1. スキーマファイルの編集例
ファイル末尾に新しい `model` を追加します。

```prisma
// 例：新しいテーブル「Tag」を追加する場合
model Tag {
  id   Int    @id @default(autoincrement())
  name String @unique
}
```
#### 2. 反映コマンド

```bash
# ① schema.prisma（設計図）の内容を DB（実物）へ反映
sudo docker compose exec backend npx prisma db push

# ② 型定義を再生成
sudo docker compose exec backend npx prisma generate

# ③ ローカル環境（VSCode）へ型を同期
./setup.sh
```

**⚠️ 重要なポイント**

- db pull: 「データベースが正解」としてスキーマファイルを上書きします。
- db push: 「スキーマファイルが正解」としてデータベースを上書きします。スキーマに書いていないテーブルは削除される可能性があるので注意してください。

---

## 💡 サンプルの動作確認方法
1. **Prisma Studio** ([http://localhost:51212](http://localhost:51212)) で `Post` テーブルにいくつかデータを保存します。
2. **Backend API** ([http://localhost:3001/posts](http://localhost:3001/posts)) をブラウザで開き、データが JSON 形式で返ってくるか確認します。
3. **Frontend** ([http://localhost:3000](http://localhost:3000)) を開き、データが画面に表示されているか確認します。