import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Language, Recipe } from '../types';
import { mergeRecipeIngredients } from '../services/openai';
import { createShoppingItem } from '../utils/shopping';

const MERGED_INGREDIENTS_STORAGE_KEY = 'mergedIngredients';

export const useMergedIngredients = (recipes: Recipe[], language: Language) => {
  const [mergedItems, setMergedItems] = useState<Item[]>([]);
  const [isMergingIngredients, setIsMergingIngredients] = useState(false);
  const [previousRecipesLength, setPreviousRecipesLength] = useState(0);

  // Загрузка сохраненных ингредиентов при инициализации
  useEffect(() => {
    const loadMergedIngredients = async () => {
      try {
        const savedItems = await AsyncStorage.getItem(MERGED_INGREDIENTS_STORAGE_KEY);
        if (savedItems) {
          setMergedItems(JSON.parse(savedItems));
        }
      } catch (error) {
        console.error('Error loading merged ingredients:', error);
      }
    };

    loadMergedIngredients();
  }, []);

  // Обновление и сохранение объединенных ингредиентов
  useEffect(() => {
    const updateMergedIngredients = async () => {
      if (recipes.length === 2 && previousRecipesLength === 1) {
        setIsMergingIngredients(true);
        try {
          const merged = await mergeRecipeIngredients(recipes, language);
          const newMergedItems = merged.map(ingredient => createShoppingItem(ingredient));
          setMergedItems(newMergedItems);
          await AsyncStorage.setItem(MERGED_INGREDIENTS_STORAGE_KEY, JSON.stringify(newMergedItems));
        } catch (error) {
          console.error('Error merging ingredients:', error);
        } finally {
          setIsMergingIngredients(false);
        }
      } else if (recipes.length < 2) {
        setMergedItems([]);
        await AsyncStorage.removeItem(MERGED_INGREDIENTS_STORAGE_KEY);
      }
      setPreviousRecipesLength(recipes.length);
    };

    updateMergedIngredients();
  }, [recipes.length, language]);

  const handleToggleMergedItem = async (id: string) => {
    const newItems = mergedItems.map(item =>
      item.id === id ? { ...item, purchased: !item.purchased } : item
    );
    setMergedItems(newItems);
    await AsyncStorage.setItem(MERGED_INGREDIENTS_STORAGE_KEY, JSON.stringify(newItems));
  };

  const handleDeleteMergedItem = async (id: string) => {
    const newItems = mergedItems.filter(item => item.id !== id);
    setMergedItems(newItems);
    await AsyncStorage.setItem(MERGED_INGREDIENTS_STORAGE_KEY, JSON.stringify(newItems));
  };

  const handleClearMergedItems = async () => {
    setMergedItems([]);
    await AsyncStorage.removeItem(MERGED_INGREDIENTS_STORAGE_KEY);
  };

  const handleUpdateMergedItem = async (id: string, newName: string) => {
    if (!newName.trim()) return;

    const newItems = mergedItems.map(item =>
      item.id === id ? { ...item, name: newName.trim() } : item
    );
    setMergedItems(newItems);
    await AsyncStorage.setItem(MERGED_INGREDIENTS_STORAGE_KEY, JSON.stringify(newItems));
  };

  return {
    mergedItems,
    isMergingIngredients,
    handleToggleMergedItem,
    handleDeleteMergedItem,
    handleClearMergedItems,
    handleUpdateMergedItem
  };
}; 