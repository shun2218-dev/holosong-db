'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {    
    // エラーログ収集サービス等があればここに記述
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong!</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        予期せぬエラーが発生しました。<br />
        時間をおいて再度お試しください。
      </p>
      <button
        onClick={
          // セグメントを再レンダリングしてリカバリーを試みる
          () => reset()
        }
        className="px-6 py-3 bg-gray-900 text-white font-bold rounded hover:bg-gray-700 transition-colors"
      >
        再読み込みする
      </button>
    </div>
  );
}