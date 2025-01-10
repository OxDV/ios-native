export type Item = {
  id: string;
  name: string;
  purchased: boolean;
};

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en';

export type Translations = {
  errors: {
    emptyItem: string;
    aiError: string;
  };
  alerts: {
    error: string;
    loading: string;
  };
  messages: {
    loadingIngredients: string;
  };
}; 