import React, { useState, useCallback } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, Modal, ScrollView } from 'react-native';
import { Theme, Language, Recipe } from '../types';
import { styles } from '../styles/styles';
import { AddItem } from './AddItem';
import { getTranslation } from '../translations';
import { useShoppingList } from '../hooks/useShoppingList';
import { Ionicons } from '@expo/vector-icons';
import { RecipeBottomSheet } from './RecipeBottomSheet';
import { createShoppingItem } from '../utils/shopping';

type Props = {
  theme: Theme;
  language: Language;
};

export const ShoppingList: React.FC<Props> = ({ theme, language }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [modifiedRecipeItems, setModifiedRecipeItems] = useState<Record<string, Item[]>>({});
  const [recipeEditingId, setRecipeEditingId] = useState<string | null>(null);
  const [recipeEditingItem, setRecipeEditingItem] = useState('');
  const {
    items,
    item,
    editingItem,
    editingId,
    isLoading,
    recipes,
    selectedRecipe,
    setItem,
    setEditingItem,
    addItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe,
    deleteRecipe,
    setSelectedRecipe,
    toggleFavorite,
    updateRecipeIngredients
  } = useShoppingList(language, theme);

  const t = getTranslation(language);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    if (!modifiedRecipeItems[recipe.name]) {
      setModifiedRecipeItems(prev => ({
        ...prev,
        [recipe.name]: recipe.ingredients.map((ingredient, index) => ({
          ...createShoppingItem(ingredient),
          purchased: recipe.purchasedStates?.[index] || false
        }))
      }));
    }
    setIsBottomSheetVisible(true);
  };

  const handleToggleRecipeItem = (id: string) => {
    if (!selectedRecipe) return;
    
    setModifiedRecipeItems(prev => {
      const newItems = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].map(item => 
          item.id === id ? { ...item, purchased: !item.purchased } : item
        )
      };
      updateRecipeIngredients(selectedRecipe.name, newItems[selectedRecipe.name]);
      return newItems;
    });
  };

  const handleDeleteRecipeItem = (id: string) => {
    if (!selectedRecipe) return;

    setModifiedRecipeItems(prev => {
      const newItems = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].filter(item => item.id !== id)
      };
      updateRecipeIngredients(selectedRecipe.name, newItems[selectedRecipe.name]);
      return newItems;
    });
  };

  const handleStartEditing = (id: string, name: string) => {
    setRecipeEditingId(id);
    setRecipeEditingItem(name);
  };

  const handleSaveEdit = (id: string) => {
    if (!selectedRecipe || !recipeEditingItem.trim()) return;

    setModifiedRecipeItems(prev => {
      const newItems = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].map(item =>
          item.id === id ? { ...item, name: recipeEditingItem.trim() } : item
        )
      };
      updateRecipeIngredients(selectedRecipe.name, newItems[selectedRecipe.name]);
      return newItems;
    });
    setRecipeEditingId(null);
    setRecipeEditingItem('');
  };

  const handleClearAll = () => {
    if (selectedRecipe) {
      setModifiedRecipeItems(prev => {
        const newItems = {
          ...prev,
          [selectedRecipe.name]: []
        };
        updateRecipeIngredients(selectedRecipe.name, []);
        return newItems;
      });
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <AddItem
        theme={theme}
        language={language}
        item={item}
        onChangeItem={setItem}
        onAddItem={addItem}
        isLoading={isLoading}
      />

      {isLoading && (
        <View style={[styles.overlay, styles.loadingOverlay]}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
        </View>
      )}

      <ScrollView style={styles.recipesContainer}>
        {recipes.map((recipe, index) => (
          <TouchableOpacity
            key={recipe.name + index}
            onPress={() => handleRecipePress(recipe)}
            style={[
              styles.recipeCard,
              theme === 'dark' && styles.darkRecipeCard
            ]}
          >
            <View style={styles.recipeContent}>
              <Text style={[
                styles.recipeTitle,
                theme === 'dark' && styles.darkRecipeTitle
              ]}>
                {recipe.name}
              </Text>
              <Text style={[
                styles.recipeSubtitle,
                theme === 'dark' && styles.darkRecipeSubtitle
              ]}>
                {t.alerts.recipe}
              </Text>
            </View>
            <View style={styles.recipeButtons}>
              <TouchableOpacity
                onPress={() => toggleFavorite(recipe)}
                style={styles.deleteRecipeButton}
              >
                <Ionicons
                  name={recipe.isFavorite ? "star" : "star-outline"}
                  size={24}
                  color={recipe.isFavorite ? '#FFD700' : theme === 'dark' ? '#fff' : '#000'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => deleteRecipe(recipe)}
                style={styles.deleteRecipeButton}
              >
                <Ionicons
                  name="trash-outline"
                  size={24}
                  color={theme === 'dark' ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal
        visible={isBottomSheetVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsBottomSheetVisible(false)}
      >
        <RecipeBottomSheet
          visible={isBottomSheetVisible}
          onClose={() => setIsBottomSheetVisible(false)}
          theme={theme}
          language={language}
          items={selectedRecipe ? modifiedRecipeItems[selectedRecipe.name] || [] : []}
          onShowRecipe={() => selectedRecipe && showRecipe(selectedRecipe)}
          onClearAll={handleClearAll}
          editingId={recipeEditingId}
          editingItem={recipeEditingItem}
          onEdit={handleStartEditing}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDeleteRecipeItem}
          onToggle={handleToggleRecipeItem}
          setEditingItem={setRecipeEditingItem}
        />
      </Modal>
    </View>
  );
}; 