/* backend/index.ts */
import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

/* 環境変数のバリデーション (厳密な型チェックのため) */
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in environment variables");
}

/* Prisma & DB 接続の初期化 */
const app = express();
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = 3001;

/* ミドルウェアの設定 */
app.use(cors());
app.use(express.json());

/* 型定義 (インターフェース) */
/* 新規投稿用型定義 */
interface CreatePostInput {
  title: string;
  content: string | null;
}

/* 投稿一覧取得用型定義 */
interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: Date;
}

/**
 * 1. 投稿一覧を取得するAPI
 */
app.get('/posts', async (_req: Request, res: Response): Promise<void> => {
  try {
    /* posts の型は Post[] になる */
    const posts: Post[] = await prisma.post.findMany({
      orderBy: { id: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: '取得失敗' });
  }
});

/**
 * 2. 新しく投稿するAPI
 */
app.post('/posts', async (req: Request<{}, {}, CreatePostInput>, res: Response): Promise<void> => {
  const { title, content } = req.body;

  if (!title) {
    res.status(400).json({ error: 'タイトルは必須です' });
    return;
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title,
        content: content ?? null,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Create error:', error);
    res.status(500).json({ error: '投稿に失敗しました' });
  }
});

/* サーバー起動 */
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});