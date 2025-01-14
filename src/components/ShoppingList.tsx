import React, { useState, SetStateAction } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, Modal, ScrollView } from 'react-native';
import { Theme, Language, Recipe, Item } from '../types';
import { styles } from '../styles/styles';
import { AddItem } from './AddItem';
import { getTranslation } from '../translations';
import { useShoppingList } from '../context/ShoppingListContext';
import { useMergedIngredients } from '../hooks/useMergedIngredients';
import { Ionicons } from '@expo/vector-icons';
import { RecipeBottomSheet } from './RecipeBottomSheet';
import { createShoppingItem } from '../utils/shopping';

type Props = {
  theme: Theme;
  language: Language;
};

export const ShoppingList: React.FC<Props> = ({ theme, language }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [isMergedIngredientsVisible, setIsMergedIngredientsVisible] = useState(false);
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
    modifiedRecipeItems,
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
    setModifiedRecipeItems,
    toggleFavorite,
    updateRecipeIngredients
  } = useShoppingList();

  const {
    mergedItems,
    isMergingIngredients,
    handleToggleMergedItem,
    handleDeleteMergedItem,
    handleClearMergedItems,
    handleUpdateMergedItem
  } = useMergedIngredients(recipes, language);

  const t = getTranslation(language);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe({...recipe, isFavorite: recipe.isFavorite ?? false});
    if (!modifiedRecipeItems[recipe.name]) {
      setModifiedRecipeItems((prev: Record<string, Item[]>) => {
        const newItems: Record<string, Item[]> = {
          ...prev,
          [recipe.name]: recipe.ingredients.map((ingredient: string, index: number) => ({
            ...createShoppingItem(ingredient),
            purchased: recipe.purchasedStates?.[index] || false
          }))
        };
        return newItems;
      });
    }
    setIsBottomSheetVisible(true);
  };

  const handleShowMergedIngredients = () => {
    setIsMergedIngredientsVisible(true);
  };

  const handleStartEditingMerged = (id: string, name: string) => {
    setRecipeEditingId(id);
    setRecipeEditingItem(name);
  };

  const handleSaveEditMerged = (id: string) => {
    if (!recipeEditingItem.trim()) return;
    handleUpdateMergedItem(id, recipeEditingItem);
    setRecipeEditingId(null);
    setRecipeEditingItem('');
  };

  const handleToggleRecipeItem = (id: string) => {
    if (!selectedRecipe) return;
    
    setModifiedRecipeItems((prev: Record<string, Item[]>) => {
      const newItems: Record<string, Item[]> = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].map((item: Item) => 
          item.id === id ? { ...item, purchased: !item.purchased } : item
        )
      };
      updateRecipeIngredients(selectedRecipe.name, newItems[selectedRecipe.name]);
      return newItems;
    });
  };

  const handleDeleteRecipeItem = (id: string) => {
    if (!selectedRecipe) return;

    setModifiedRecipeItems((prev: Record<string, Item[]>) => {
      const newItems: Record<string, Item[]> = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].filter((item: Item) => item.id !== id)
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

    setModifiedRecipeItems((prev: Record<string, Item[]>) => {
      const newItems: Record<string, Item[]> = {
        ...prev,
        [selectedRecipe.name]: prev[selectedRecipe.name].map((item: Item) =>
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
      setModifiedRecipeItems((prev: Record<string, Item[]>) => {
        const newItems: Record<string, Item[]> = {
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

      {(isLoading || isMergingIngredients) && (
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

        {recipes.length >= 2 && (
          <TouchableOpacity
            onPress={handleShowMergedIngredients}
            style={[
              styles.showMergedButton,
              theme === 'dark' && styles.darkShowMergedButton
            ]}
          >
            <Text style={[
              styles.showMergedButtonText,
              theme === 'dark' && styles.darkText
            ]}>
              {t.buttons.showMergedIngredients}
            </Text>
          </TouchableOpacity>
        )}
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

      <Modal
        visible={isMergedIngredientsVisible}
        transparent
        animationType="none"
        onRequestClose={() => setIsMergedIngredientsVisible(false)}
      >
        <RecipeBottomSheet
          visible={isMergedIngredientsVisible}
          onClose={() => setIsMergedIngredientsVisible(false)}
          theme={theme}
          language={language}
          items={mergedItems}
          onShowRecipe={() => {}}
          onClearAll={handleClearMergedItems}
          editingId={recipeEditingId}
          editingItem={recipeEditingItem}
          onEdit={handleStartEditingMerged}
          onSaveEdit={handleSaveEditMerged}
          onDelete={handleDeleteMergedItem}
          onToggle={handleToggleMergedItem}
          setEditingItem={setRecipeEditingItem}
          hideRecipeButton
        />
      </Modal>
    </View>
  );
}; 