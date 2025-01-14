import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Alert } from 'react-native';
import { Item, Language, Theme, Recipe } from '../types';
import { getTranslation } from '../translations';
import { getRecipeWithIngredients } from '../services/openai';
import { createShoppingItem } from '../utils/shopping';
import { saveItems, loadItems, saveRecipes, loadRecipes } from '../utils/storage';

type ShoppingListContextType = {
  items: Item[];
  item: string;
  editingItem: string;
  editingId: string | null;
  isLoading: boolean;
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  modifiedRecipeItems: Record<string, Item[]>;
  setItem: (value: string) => void;
  setEditingItem: (value: string) => void;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setModifiedRecipeItems: Dispatch<SetStateAction<Record<string, Item[]>>>;
  addItem: () => Promise<void>;
  deleteItem: (id: string) => void;
  startEditing: (id: string, name: string) => void;
  saveEdit: (id: string) => void;
  togglePurchased: (id: string) => void;
  clearAllItems: () => void;
  showRecipe: (recipe: Recipe) => void;
  deleteRecipe: (recipe: Recipe) => void;
  toggleFavorite: (recipe: Recipe) => void;
  getFavoriteRecipes: () => Recipe[];
  updateRecipeIngredients: (recipeName: string, ingredients: Item[]) => void;
};

const ShoppingListContext = createContext<ShoppingListContextType | null>(null);

export const ShoppingListProvider: React.FC<{
  children: React.ReactNode;
  language: Language;
  theme: Theme;
}> = ({ children, language, theme }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [modifiedRecipeItems, setModifiedRecipeItems] = useState<Record<string, Item[]>>({});

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

  useEffect(() => {
    if (recipes.length > 0) {
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
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.filter(r => r.name !== recipeToDelete.name);
      saveRecipes(newRecipes);
      return newRecipes;
    });

    setModifiedRecipeItems(prev => {
      const { [recipeToDelete.name]: _, ...rest } = prev;
      return rest;
    });

    if (selectedRecipe?.name === recipeToDelete.name) {
      setSelectedRecipe(null);
    }
  };

  const toggleFavorite = (recipe: Recipe) => {
    setRecipes(prevRecipes => {
      const newRecipes = prevRecipes.map(r =>
        r.name === recipe.name ? { ...r, isFavorite: !r.isFavorite } : r
      );
      saveRecipes(newRecipes);
      return newRecipes;
    });
  };

  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => recipe.isFavorite);
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

  const value = {
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

  return (
    <ShoppingListContext.Provider value={value}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (!context) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}; 