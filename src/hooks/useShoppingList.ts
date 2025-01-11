import { useState } from 'react';
import { Alert } from 'react-native';
import { Item, Language } from '../types';
import { getTranslation } from '../translations';
import { getRecipeWithIngredients } from '../services/openai';

export const useShoppingList = (language: Language) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRecipe, setLastRecipe] = useState<string>('');

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
      
      const recipeSection = response.split(/Рецепт:|Recipe:/)[1];
      if (recipeSection) {
        setLastRecipe(recipeSection.trim());
      }
      
      if (ingredients.length > 0) {
        const newItems = ingredients.map(ingredient => ({
          id: Date.now().toString() + Math.random(),
          name: ingredient,
          purchased: false,
        }));
        
        setItems(prevItems => [...prevItems, ...newItems]);
        setItem('');
      } else {
        setItems(prevItems => [...prevItems, { 
          id: Date.now().toString(), 
          name: item.trim(), 
          purchased: false 
        }]);
        setItem('');
      }
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
    Alert.alert(
      t.alerts.clearTitle,
      t.alerts.clearConfirm,
      [
        {
          text: t.buttons.cancel,
          style: 'cancel'
        },
        {
          text: t.buttons.confirm,
          style: 'destructive',
          onPress: () => setItems([])
        }
      ]
    );
  };

  const showRecipe = () => {
    if (items.length === 0 || !lastRecipe) return;
    
    const t = getTranslation(language);
    Alert.alert(t.alerts.recipe, lastRecipe);
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