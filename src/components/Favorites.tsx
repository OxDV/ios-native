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
  const [recipeEditingId, setRecipeEditingId] = useState<string | null>(null);
  const [recipeEditingItem, setRecipeEditingItem] = useState('');
  const {
    editingItem,
    editingId,
    recipes,
    selectedRecipe,
    modifiedRecipeItems,
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
    setSelectedRecipe,
    setModifiedRecipeItems,
    updateRecipeIngredients
  } = useShoppingList(language, theme);

  const t = getTranslation(language);
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const favorites = recipes.filter(recipe => recipe.isFavorite);
    setFavoriteRecipes(favorites);
  }, [recipes]);

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
    </SafeAreaView>
  );
}; 