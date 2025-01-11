import { useState } from 'react';
import { Language } from '../types';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>('ru');

  const toggleLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { language, toggleLanguage };
}; 