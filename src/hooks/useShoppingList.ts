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
    saveRecipes(recipes);
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
      setRecipes(prevRecipes => [...prevRecipes, newRecipe]);
      
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
    setRecipes(prevRecipes => prevRecipes.filter(r => r.name !== recipeToDelete.name));
    if (selectedRecipe?.name === recipeToDelete.name) {
      setSelectedRecipe(null);
    }
  };

  return {
    items,
    item,
    editingItem,
    editingId,
    isLoading,
    recipes,
    selectedRecipe,
    setItem,
    setEditingItem,
    setSelectedRecipe,
    addItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe,
    deleteRecipe
  };
}; 