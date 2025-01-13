import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Recipe } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'shopping_list_items',
  RECIPES: 'shopping_list_recipes',
} as const;

export const saveItems = async (items: Item[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving items:', error);
  }
};

export const loadItems = async (): Promise<Item[]> => {
  try {
    const items = await AsyncStorage.getItem(STORAGE_KEYS.ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Error loading items:', error);
    return [];
  }
};

export const saveRecipes = async (recipes: Recipe[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  } catch (error) {
    console.error('Error saving recipes:', error);
  }
};

export const loadRecipes = async (): Promise<Recipe[]> => {
  try {
    const recipes = await AsyncStorage.getItem(STORAGE_KEYS.RECIPES);
    return recipes ? JSON.parse(recipes) : [];
  } catch (error) {
    console.error('Error loading recipes:', error);
    return [];
  }
}; 