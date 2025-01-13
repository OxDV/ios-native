export type Item = {
  id: string;
  name: string;
  purchased: boolean;
};

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en' | 'uk' | 'de' | 'fr' | 'zh' | 'pl' | 'it' | 'es';

export type Translations = {
  buttons: {
    clearAll: string;
    cancel: string;
    confirm: string;
    recipe: string;
  };
  titles: {
    favorites: string;
    shoppingList: string;
    settings: string;
  };
  alerts: {
    error: string;
    loading: string;
    clearConfirm: string;
    clearTitle: string;
    recipe: string;
    settings: string;
    appearance: string;
    language: string;
    selectLanguage: string;
    darkTheme: string;
    lightTheme: string;
    appName: string;
    noFavorites: string;
  };
  errors: {
    emptyItem: string;
    aiError: string;
  };
  languages: {
    ru: string;
    en: string;
    uk: string;
    de: string;
    fr: string;
    zh: string;
    pl: string;
    it: string;
    es: string;
  };
};

export type Recipe = {
  name: string;
  ingredients: string[];
  instructions: string;
  isFavorite: boolean;
}; 