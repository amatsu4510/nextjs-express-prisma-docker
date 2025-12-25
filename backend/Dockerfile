FROM node:20-alpine

WORKDIR /app

# 1. パッケージファイルをコピー
COPY package*.json ./

# 2. ライブラリをインストール
RUN npm install

# 3. ファイルをすべてコピー
COPY . .

# 4. DBの準備をしてからサーバーを起動する
# npx prisma generate: Prismaクライアントの生成
# npm run dev: サーバー起動
CMD ["sh", "-c", "npx prisma generate && npm run dev"]