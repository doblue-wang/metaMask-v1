
'use client'; 
import { useState } from 'react';
import ClipboardJS from 'clipboard';

interface UseClipboardReturn {
  copied: boolean;
  error: string | null;
  copyToClipboard: (text: string) => void;
}

const useClipboard = (): UseClipboardReturn => {
  const [copied, setCopied] = useState<boolean>(false); // 记录是否成功复制
  const [error, setError] = useState<string | null>(null); // 记录错误信息

  const copyToClipboard = (text: string): void => {
    try {
      // 创建一个按钮元素来触发复制
      const button = document.createElement('button');
      button.setAttribute('data-clipboard-text', text); // 设置复制文本

      // 创建 ClipboardJS 实例
      const clipboard = new ClipboardJS(button);

      // 监听复制成功的事件
      clipboard.on('success', () => {
        setCopied(true); 
        setError(null);
        clipboard.destroy(); 
      });

      // 监听复制失败的事件
      clipboard.on('error', (err: any) => {
        setCopied(false); // 复制失败
        setError(err.message); // 记录错误信息
        clipboard.destroy(); // 清除 ClipboardJS 实例
      });
      button.click();
    } catch (err: any) {
      setCopied(false);
      setError(err.message); 
    }
  };

  return { copied, error, copyToClipboard };
};

export default useClipboard;
