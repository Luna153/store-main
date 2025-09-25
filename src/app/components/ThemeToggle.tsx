'use client';

import { useEffect } from 'react';
import { useTheme } from '../providers/theme-provider'; // 引入自定義的 Hook
import { Toggle } from "@/components/ui/toggle";
import { AiFillSun, AiFillMoon } from 'react-icons/ai';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // 使用 useEffect 來將主題 class 應用到 html 標籤上
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  return (
    <>
    {/* <div className="relative"></div> */}
      <Toggle onClick={toggleTheme} className=" border rounded-full absolute top-5 right-5">
        {theme === 'light' ? <AiFillSun /> : <AiFillMoon />}
      </Toggle>
    </>
  );
}