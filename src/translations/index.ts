import { Language, Translations } from '../types';

const translations: Record<Language, Translations> = {
  ru: {
    errors: {
      emptyItem: 'Пожалуйста, введите название продукта',
      aiError: 'Ошибка при получении ингредиентов. Попробуйте еще раз',
    },
    alerts: {
      error: 'Ошибка',
      loading: 'Загрузка',
      clearConfirm: 'Вы уверены, что хотите очистить весь список?',
      clearTitle: 'Очистить список',
      recipe: 'Рецепт',
    },
    messages: {
      loadingIngredients: 'Получаем список ингредиентов...',
      gettingRecipe: 'Получаем рецепт...',
    },
    buttons: {
      clearAll: 'Очистить всё',
      cancel: 'Отмена',
      confirm: 'Подтвердить',
      recipe: 'Рецепт',
    },
  },
  en: {
    errors: {
      emptyItem: 'Please enter a product name',
      aiError: 'Error getting ingredients. Please try again',
    },
    alerts: {
      error: 'Error',
      loading: 'Loading',
      clearConfirm: 'Are you sure you want to clear the entire list?',
      clearTitle: 'Clear List',
      recipe: 'Recipe',
    },
    messages: {
      loadingIngredients: 'Getting ingredients list...',
      gettingRecipe: 'Getting recipe...',
    },
    buttons: {
      clearAll: 'Clear All',
      cancel: 'Cancel',
      confirm: 'Confirm',
      recipe: 'Recipe',
    },
  },
};

export const getTranslation = (language: Language): Translations => translations[language]; 