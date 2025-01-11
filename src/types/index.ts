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
    clearConfirm: string;
    clearTitle: string;
    recipe: string;
  };
  messages: {
    loadingIngredients: string;
    gettingRecipe: string;
  };
  buttons: {
    clearAll: string;
    cancel: string;
    confirm: string;
    recipe: string;
  };
}; 