/* frontend/app/page.tsx */
'use client';

import { useState, useEffect, useCallback } from 'react';

/* 投稿データの型定義 */
interface Post {
  id: number;
  title: string;
  content: string | null;
  createdAt: string;
}

export default function BulletinBoard() {
  /* 状態管理に型を適用 */
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /* APIのベースURL（環境変数から取得、未設定ならローカル） */
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  /**
   * 投稿一覧を取得する (useCallbackでメモ化)
   */
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch(`${API_URL}/posts`);
      if (!res.ok) throw new Error('サーバーエラーが発生しました');

      const data = await res.json();

      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        throw new Error('データの形式が正しくありません');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'データの取得に失敗しました';
      setErrorMessage(message);
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /**
   * 投稿を送信する
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // フォーム送信時のリロード防止
    if (!title.trim()) return;

    try {
      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content: '本文は固定サンプル'
        }),
      });

      if (!res.ok) throw new Error('投稿に失敗しました');

      setTitle(''); // 入力欄をクリア
      await fetchPosts(); // データを再取得
    } catch (err) {
      alert(err instanceof Error ? err.message : '不明なエラー');
    }
  };

  return (
    <div className="p-8 bg-white text-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Dockerフルスタック掲示板</h1>
      {/* 投稿フォーム */}
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="border p-2 mr-2 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="タイトルを入力..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="bg-blue-500 text-white p-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
        >
          {isLoading ? '送信中...' : '投稿'}
        </button>
      </form>

      {/* エラー表示 */}
      {errorMessage && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage}
        </div>
      )}

      {/* 投稿一覧 */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 shadow-sm transition-transform hover:scale-[1.01]">
              <h3 className="font-bold text-lg">{post.title}</h3>
              <p className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString('ja-JP')}
              </p>
            </div>
          ))
        ) : (
          !isLoading && <p className="text-gray-400">投稿がまだありません。</p>
        )}
      </div>
    </div>
  );
}