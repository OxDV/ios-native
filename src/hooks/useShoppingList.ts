import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Item, Language, Theme, Recipe } from '../types';
import { getTranslation } from '../translations';
import { getRecipeWithIngredients } from '../services/openai';
import { createShoppingItem } from '../utils/shopping';
import { saveItems, loadItems, saveRecipes, loadRecipes } from '../utils/storage';

export const useShoppingList = (language: Language, theme: Theme) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modifiedRecipeItems, setModifiedRecipeItems] = useState<Record<string, Item[]>>({});

  // Загрузка сохраненных данных при инициализации
  useEffect(() => {
    const loadSavedData = async () => {
      const [savedItems, savedRecipes] = await Promise.all([
        loadItems(),
        loadRecipes()
      ]);
      setItems(savedItems);
      setRecipes(savedRecipes);
    };
    loadSavedData();
  }, []);

  // Сохранение рецептов при изменении
  useEffect(() => {
    if (recipes.length > 0) {
      console.log('Saving recipes:', recipes);
      saveRecipes(recipes);
    }
  }, [recipes]);

  const addItem = async () => {
    if (item.trim() === '') {
      const t = getTranslation(language);
      Alert.alert(t.alerts.error, t.errors.emptyItem);
      return;
    }

    try {
      setIsLoading(true);
      const t = getTranslation(language);
      
      const newRecipe = await getRecipeWithIngredients(item, language);
      setRecipes(prevRecipes => [...prevRecipes, { 
        ...newRecipe, 
        isFavorite: false,
        purchasedStates: newRecipe.ingredients.map(() => false)
      }]);
      
      const newItems = newRecipe.ingredients.map(ingredient => createShoppingItem(ingredient));
      setItems(prevItems => [...prevItems, ...newItems]);
      setItem('');
    } catch (error) {
      console.error('Error processing OpenAI response:', error);
      const t = getTranslation(language);
      Alert.alert(t.alerts.error, t.errors.aiError);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingItem(name);
  };

  const saveEdit = (id: string) => {
    if (editingItem.trim() === '') return;

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, name: editingItem.trim() } : item
      )
    );
    setEditingId(null);
    setEditingItem('');
  };

  const togglePurchased = (id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      )
    );
  };

  const clearAllItems = () => {
    const t = getTranslation(language);
    Alert.alert(
      t.alerts.clearTitle,
      t.alerts.clearConfirm,
      [
        { text: t.buttons.cancel, style: 'cancel' },
        {
          text: t.buttons.confirm,
          style: 'destructive',
          onPress: () => {
            setItems([]);
            setRecipes([]);
            setSelectedRecipe(null);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const showRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    Alert.alert(
      recipe.name,
      recipe.instructions,
      [{ text: 'OK', style: 'default' }],
      {
        cancelable: true,
        userInterfaceStyle: theme,
      }
    );
  };

  const deleteRecipe = (recipeToDelete: Recipe) => {
    // Удаляем рецепт из основного списка рецептов
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.filter(r => r.name !== recipeToDelete.name);
      saveRecipes(newRecipes);
      return newRecipes;
    });

    // Очищаем modifiedRecipeItems для удаленного рецепта
    setModifiedRecipeItems(prev => {
      const { [recipeToDelete.name]: _, ...rest } = prev;
      return rest;
    });

    // Сбрасываем выбранный рецепт, если это был он
    if (selectedRecipe?.name === recipeToDelete.name) {
      setSelectedRecipe(null);
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    console.log('Toggling favorite for recipe:', recipe.name);
    console.log('Current favorite state:', recipe.isFavorite);
    
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.map(r =>
        r.name === recipe.name ? { ...r, isFavorite: !r.isFavorite } : r
      );
      console.log('Updated recipes:', newRecipes);
      saveRecipes(newRecipes);
      return newRecipes;
    });
  };

  const getFavoriteRecipes = () => {
    console.log('Getting favorite recipes from:', recipes);
    const favorites = recipes.filter(recipe => recipe.isFavorite);
    console.log('Filtered favorite recipes:', favorites);
    return favorites;
  };

  const updateRecipeIngredients = (recipeName: string, ingredients: Item[]) => {
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.map(recipe =>
        recipe.name === recipeName
          ? {
              ...recipe,
              ingredients: ingredients.map(item => item.name),
              purchasedStates: ingredients.map(item => item.purchased)
            }
          : recipe
      );
      saveRecipes(newRecipes);
      return newRecipes;
    });
  };

  return {
    items,
    item,
    editingItem,
    editingId,
    isLoading,
    recipes,
    selectedRecipe,
    modifiedRecipeItems,
    setItem,
    setEditingItem,
    setSelectedRecipe,
    setModifiedRecipeItems,
    addItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe,
    deleteRecipe,
    toggleFavorite,
    getFavoriteRecipes,
    updateRecipeIngredients
  };
}; 