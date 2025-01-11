import { useState, useEffect } from 'react';
import { Alert, AlertButton } from 'react-native';
import { Item, Language, Theme } from '../types';
import { getTranslation } from '../translations';
import { getRecipeWithIngredients } from '../services/openai';
import { createShoppingItem } from '../utils/shopping';
import { saveItems, loadItems, saveRecipe, loadRecipe } from '../utils/storage';

export const useShoppingList = (language: Language, theme: Theme) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRecipe, setLastRecipe] = useState<string>('');

  // Загрузка сохраненных данных при инициализации
  useEffect(() => {
    const loadSavedData = async () => {
      const [savedItems, savedRecipe] = await Promise.all([
        loadItems(),
        loadRecipe()
      ]);
      setItems(savedItems);
      setLastRecipe(savedRecipe);
    };
    loadSavedData();
  }, []);

  // Сохранение items при изменении
  useEffect(() => {
    saveItems(items);
  }, [items]);

  // Сохранение рецепта при изменении
  useEffect(() => {
    if (lastRecipe) {
      saveRecipe(lastRecipe);
    }
  }, [lastRecipe]);

  const addItem = async () => {
    if (item.trim() === '') {
      const t = getTranslation(language);
      Alert.alert(t.alerts.error, t.errors.emptyItem);
      return;
    }

    try {
      setIsLoading(true);
      const t = getTranslation(language);
      
      const response = await getRecipeWithIngredients(item);
      const ingredients = response
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.trim().substring(2).trim());
      
      // Получаем слово "Рецепт" на текущем языке
      const recipeWord = t.alerts.recipe;
      // Ищем рецепт после слова "Рецепт:" на любом языке
      const recipeSection = response.split(new RegExp(`${recipeWord}:|Recipe:|Rezept:|Recette:|食谱:|Przepis:|Ricetta:|Receta:`))[1];
      if (recipeSection) {
        setLastRecipe(recipeSection.trim());
      }
      
      if (ingredients.length > 0) {
        const newItems = ingredients.map(ingredient => createShoppingItem(ingredient));
        setItems(prevItems => [...prevItems, ...newItems]);
      } else {
        setItems(prevItems => [...prevItems, createShoppingItem(item)]);
      }
      setItem('');
    } catch (error) {
      const t = getTranslation(language);
      Alert.alert(t.alerts.error, t.errors.aiError);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingItem(name);
  };

  const saveEdit = (id: string) => {
    if (editingItem.trim() === '') return;
    
    setItems(items.map(currentItem => 
      currentItem.id === id ? { ...currentItem, name: editingItem.trim() } : currentItem
    ));
    setEditingId(null);
    setEditingItem('');
  };

  const togglePurchased = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, purchased: !item.purchased } : item
    ));
  };

  const clearAllItems = () => {
    const t = getTranslation(language);

    const buttons: AlertButton[] = [
      {
        text: t.buttons.cancel,
        style: 'cancel',
        isPreferred: false,
      },
      {
        text: t.buttons.confirm,
        style: 'destructive',
        isPreferred: true,
        onPress: () => {
          setItems([]);
          setLastRecipe('');
        },
      },
    ];

    Alert.alert(
      t.alerts.clearTitle,
      t.alerts.clearConfirm,
      buttons,
      {
        cancelable: true,
        userInterfaceStyle: theme,
      }
    );
  };

  const showRecipe = () => {
    if (items.length === 0 || !lastRecipe) return;
    
    const t = getTranslation(language);
    Alert.alert(
      t.alerts.recipe,
      lastRecipe,
      [{ text: 'OK', style: 'default' }],
      {
        cancelable: true,
        userInterfaceStyle: theme,
      }
    );
  };

  return {
    items,
    item,
    editingItem,
    editingId,
    isLoading,
    setItem,
    setEditingItem,
    addItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe
  };
}; 