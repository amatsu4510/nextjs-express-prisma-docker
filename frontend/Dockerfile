FROM node:20-alpine

WORKDIR /app

# 1. package.json類を先にコピー
COPY package*.json ./

# 2. 依存関係をインストール
RUN npm install

# 3. 残りの全ファイルをコピー
COPY . .

# 4. コンテナ起動時にNext.jsを立ち上げる
CMD ["npm", "run", "dev"]