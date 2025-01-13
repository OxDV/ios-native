import React, { useState } from 'react';
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
    toggleFavorite
  } = useShoppingList(language, theme);

  const t = getTranslation(language);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsBottomSheetVisible(true);
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
          items={selectedRecipe ? selectedRecipe.ingredients.map(createShoppingItem) : []}
          onShowRecipe={() => selectedRecipe && showRecipe(selectedRecipe)}
          onClearAll={clearAllItems}
          editingId={editingId}
          editingItem={editingItem}
          onEdit={startEditing}
          onSaveEdit={saveEdit}
          onDelete={deleteItem}
          onToggle={togglePurchased}
          setEditingItem={setEditingItem}
        />
      </Modal>
    </View>
  );
}; 