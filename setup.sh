#!/bin/bash

# docker-compose (V1) ではなく docker compose (V2) を使用
DOCKER_CMD="sudo docker compose"

echo "🛑 Stopping containers (keeping DB data)..."
# down -v ではなく stop を使うことで、ボリューム(DBの中身)を保護します
$DOCKER_CMD stop

echo "🗑️ Removing local node_modules (for type refresh)..."
sudo rm -rf backend/node_modules frontend/node_modules

echo "🛠️ Starting containers..."
# すでにイメージがある場合は高速に起動します
$DOCKER_CMD up -d --build

echo "⏳ Waiting for initialization (Prisma generate, etc.)..."
# コンテナ内の npm install や generate が終わるのを待ちます
sleep 15

echo "📦 Syncing node_modules from container to host..."
BACKEND_ID=$($DOCKER_CMD ps -q backend)
FRONTEND_ID=$($DOCKER_CMD ps -q frontend)

# もしコンテナが起動していればコピーを実行
if [ -n "$BACKEND_ID" ]; then
    sudo docker cp $BACKEND_ID:/app/node_modules ./backend/
    echo "✅ Backend sync completed."
fi

if [ -n "$FRONTEND_ID" ]; then
    sudo docker cp $FRONTEND_ID:/app/node_modules ./frontend/
    echo "✅ Frontend sync completed."
fi

echo "🔑 Adjusting file permissions to $USER..."
sudo chown -R $USER:$USER ./backend/node_modules ./frontend/node_modules

echo "--------------------------------------------------"
echo "✅ All set! Data preserved and types synced."
echo "💡 To COMPLETELY reset everything (and lose data), run:"
echo "   sudo docker compose down -v"
echo "--------------------------------------------------"