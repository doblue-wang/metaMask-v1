'use client';

import { useState } from 'react';
const useLocale = () => {
  const [locale, setLocale] = useState('en-US');  // 初始设置为中文

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
  };

  return {
    locale,
    changeLocale,
  };
};

export default useLocale;
