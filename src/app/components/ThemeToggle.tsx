'use client';

import { useEffect } from 'react';
import { useTheme } from '../providers/theme-provider'; // 引入自定義的 Hook

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // 使用 useEffect 來將主題 class 應用到 html 標籤上
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <button onClick={toggleTheme} className="p-2 border rounded">
      {theme === 'light' ? '切換成暗色模式' : '切換成亮色模式'}
    </button>
  );
}