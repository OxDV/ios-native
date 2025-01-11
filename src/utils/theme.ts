import { Theme } from '../types';

export const getIconColor = (theme: Theme, isDisabled: boolean = false): string => {
  if (isDisabled) return theme === 'dark' ? '#666' : '#999';
  return theme === 'dark' ? '#fff' : '#333';
};

export const getAccentColor = (theme: Theme): string => {
  return theme === 'dark' ? '#4488ff' : 'blue';
};

export const commonDarkStyles = {
  backgroundColor: '#1a1a1a',
  textColor: '#fff',
  borderColor: '#333',
}; 