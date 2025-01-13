import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, ScrollView, SafeAreaView } from 'react-native';
import { Theme, Language, Recipe } from '../types';
import { styles } from '../styles/styles';
import { getTranslation } from '../translations';
import { useShoppingList } from '../hooks/useShoppingList';
import { Ionicons } from '@expo/vector-icons';
import { RecipeBottomSheet } from './RecipeBottomSheet';
import { createShoppingItem } from '../utils/shopping';

type Props = {
  theme: Theme;
  language: Language;
};

export const Favorites: React.FC<Props> = ({ theme, language }) => {
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const {
    items,
    editingItem,
    editingId,
    recipes,
    selectedRecipe,
    setEditingItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe,
    deleteRecipe,
    toggleFavorite,
    getFavoriteRecipes,
    setSelectedRecipe
  } = useShoppingList(language, theme);

  const t = getTranslation(language);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    console.log('Favorites component - Current recipes:', recipes);
    const favorites = recipes.filter(recipe => recipe.isFavorite);
    console.log('Favorites component - Filtered favorites:', favorites);
    setFavoriteRecipes(favorites);
  }, [recipes]);

  const handleRecipePress = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsBottomSheetVisible(true);
  };

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <View style={[styles.header, theme === 'dark' && styles.darkHeader]}>
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
          {t.titles.favorites}
        </Text>
      </View>
      <View style={styles.favoritesContent}>
        {favoriteRecipes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
              {t.alerts.noFavorites || 'У вас пока нет избранных рецептов'}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.recipesContainer}>
            {favoriteRecipes.map((recipe, index) => (
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
        )}
      </View>

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
    </SafeAreaView>
  );
}; 