import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item } from '../types';

const STORAGE_KEYS = {
  ITEMS: 'shopping_list_items',
  RECIPE: 'shopping_list_recipe',
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

export const saveRecipe = async (recipe: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.RECIPE, recipe);
  } catch (error) {
    console.error('Error saving recipe:', error);
  }
};

export const loadRecipe = async (): Promise<string> => {
  try {
    const recipe = await AsyncStorage.getItem(STORAGE_KEYS.RECIPE);
    return recipe || '';
  } catch (error) {
    console.error('Error loading recipe:', error);
    return '';
  }
}; 