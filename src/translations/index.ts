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
      settings: 'Настройки',
      appearance: 'Внешний вид',
      language: 'Язык',
      selectLanguage: 'Выберите язык',
      darkTheme: 'Темная тема',
      lightTheme: 'Светлая тема',
      appName: 'Список покупок',
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
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
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
      settings: 'Settings',
      appearance: 'Appearance',
      language: 'Language',
      selectLanguage: 'Select Language',
      darkTheme: 'Dark Theme',
      lightTheme: 'Light Theme',
      appName: 'Shopping List',
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
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  uk: {
    errors: {
      emptyItem: 'Будь ласка, введіть назву продукту',
      aiError: 'Помилка при отриманні інгредієнтів. Спробуйте ще раз',
    },
    alerts: {
      error: 'Помилка',
      loading: 'Завантаження',
      clearConfirm: 'Ви впевнені, що хочете очистити весь список?',
      clearTitle: 'Очистити список',
      recipe: 'Рецепт',
      settings: 'Налаштування',
      appearance: 'Зовнішній вигляд',
      language: 'Мова',
      selectLanguage: 'Оберіть мову',
      darkTheme: 'Темна тема',
      lightTheme: 'Світла тема',
      appName: 'Список покупок',
    },
    messages: {
      loadingIngredients: 'Отримуємо список інгредієнтів...',
      gettingRecipe: 'Отримуємо рецепт...',
    },
    buttons: {
      clearAll: 'Очистити все',
      cancel: 'Скасувати',
      confirm: 'Підтвердити',
      recipe: 'Рецепт',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  de: {
    errors: {
      emptyItem: 'Bitte geben Sie einen Produktnamen ein',
      aiError: 'Fehler beim Abrufen der Zutaten. Bitte versuchen Sie es erneut',
    },
    alerts: {
      error: 'Fehler',
      loading: 'Laden',
      clearConfirm: 'Möchten Sie die gesamte Liste wirklich löschen?',
      clearTitle: 'Liste löschen',
      recipe: 'Rezept',
      settings: 'Einstellungen',
      appearance: 'Erscheinungsbild',
      language: 'Sprache',
      selectLanguage: 'Sprache auswählen',
      darkTheme: 'Dunkles Thema',
      lightTheme: 'Helles Thema',
      appName: 'Einkaufsliste',
    },
    messages: {
      loadingIngredients: 'Zutatenliste wird abgerufen...',
      gettingRecipe: 'Rezept wird abgerufen...',
    },
    buttons: {
      clearAll: 'Alles löschen',
      cancel: 'Abbrechen',
      confirm: 'Bestätigen',
      recipe: 'Rezept',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  fr: {
    errors: {
      emptyItem: 'Veuillez entrer un nom de produit',
      aiError: 'Erreur lors de l\'obtention des ingrédients. Veuillez réessayer',
    },
    alerts: {
      error: 'Erreur',
      loading: 'Chargement',
      clearConfirm: 'Êtes-vous sûr de vouloir effacer toute la liste ?',
      clearTitle: 'Effacer la liste',
      recipe: 'Recette',
      settings: 'Paramètres',
      appearance: 'Apparence',
      language: 'Langue',
      selectLanguage: 'Choisir la langue',
      darkTheme: 'Thème sombre',
      lightTheme: 'Thème clair',
      appName: 'Liste de courses',
    },
    messages: {
      loadingIngredients: 'Obtention de la liste des ingrédients...',
      gettingRecipe: 'Obtention de la recette...',
    },
    buttons: {
      clearAll: 'Tout effacer',
      cancel: 'Annuler',
      confirm: 'Confirmer',
      recipe: 'Recette',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  zh: {
    errors: {
      emptyItem: '请输入产品名称',
      aiError: '获取配料时出错。请重试',
    },
    alerts: {
      error: '错误',
      loading: '加载中',
      clearConfirm: '您确定要清除整个列表吗？',
      clearTitle: '清除列表',
      recipe: '食谱',
      settings: '设置',
      appearance: '外观',
      language: '语言',
      selectLanguage: '选择语言',
      darkTheme: '深色主题',
      lightTheme: '浅色主题',
      appName: '购物清单',
    },
    messages: {
      loadingIngredients: '正在获取配料列表...',
      gettingRecipe: '正在获取食谱...',
    },
    buttons: {
      clearAll: '清除全部',
      cancel: '取消',
      confirm: '确认',
      recipe: '食谱',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  pl: {
    errors: {
      emptyItem: 'Proszę wprowadzić nazwę produktu',
      aiError: 'Błąd podczas pobierania składników. Spróbuj ponownie',
    },
    alerts: {
      error: 'Błąd',
      loading: 'Ładowanie',
      clearConfirm: 'Czy na pewno chcesz wyczyścić całą listę?',
      clearTitle: 'Wyczyść listę',
      recipe: 'Przepis',
      settings: 'Ustawienia',
      appearance: 'Wygląd',
      language: 'Język',
      selectLanguage: 'Wybierz język',
      darkTheme: 'Ciemny motyw',
      lightTheme: 'Jasny motyw',
      appName: 'Lista zakupów',
    },
    messages: {
      loadingIngredients: 'Pobieranie listy składników...',
      gettingRecipe: 'Pobieranie przepisu...',
    },
    buttons: {
      clearAll: 'Wyczyść wszystko',
      cancel: 'Anuluj',
      confirm: 'Potwierdź',
      recipe: 'Przepis',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  it: {
    errors: {
      emptyItem: 'Inserisci il nome del prodotto',
      aiError: 'Errore durante il recupero degli ingredienti. Riprova',
    },
    alerts: {
      error: 'Errore',
      loading: 'Caricamento',
      clearConfirm: 'Sei sicuro di voler cancellare l\'intera lista?',
      clearTitle: 'Cancella lista',
      recipe: 'Ricetta',
      settings: 'Impostazioni',
      appearance: 'Aspetto',
      language: 'Lingua',
      selectLanguage: 'Seleziona lingua',
      darkTheme: 'Tema scuro',
      lightTheme: 'Tema chiaro',
      appName: 'Lista della spesa',
    },
    messages: {
      loadingIngredients: 'Recupero lista ingredienti...',
      gettingRecipe: 'Recupero ricetta...',
    },
    buttons: {
      clearAll: 'Cancella tutto',
      cancel: 'Annulla',
      confirm: 'Conferma',
      recipe: 'Ricetta',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
  es: {
    errors: {
      emptyItem: 'Por favor, ingrese un nombre de producto',
      aiError: 'Error al obtener los ingredientes. Inténtalo de nuevo',
    },
    alerts: {
      error: 'Error',
      loading: 'Cargando',
      clearConfirm: '¿Estás seguro de que quieres borrar toda la lista?',
      clearTitle: 'Borrar lista',
      recipe: 'Receta',
      settings: 'Ajustes',
      appearance: 'Apariencia',
      language: 'Idioma',
      selectLanguage: 'Seleccionar idioma',
      darkTheme: 'Tema oscuro',
      lightTheme: 'Tema claro',
      appName: 'Lista de compras',
    },
    messages: {
      loadingIngredients: 'Obteniendo lista de ingredientes...',
      gettingRecipe: 'Obteniendo receta...',
    },
    buttons: {
      clearAll: 'Borrar todo',
      cancel: 'Cancelar',
      confirm: 'Confirmar',
      recipe: 'Receta',
    },
    languages: {
      ru: 'Русский',
      en: 'English',
      uk: 'Українська',
      de: 'Deutsch',
      fr: 'Français',
      zh: '中文',
      pl: 'Polski',
      it: 'Italiano',
      es: 'Español',
    },
  },
};

export const getTranslation = (language: Language): Translations => translations[language]; 