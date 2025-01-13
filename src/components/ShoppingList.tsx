import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, Modal } from 'react-native';
import { Theme, Language } from '../types';
import { styles } from '../styles/styles';
import { AddItem } from './AddItem';
import { getTranslation } from '../translations';
import { useShoppingList } from '../hooks/useShoppingList';
import { Ionicons } from '@expo/vector-icons';
import { RecipeBottomSheet } from './RecipeBottomSheet';

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
    recipe,
    setItem,
    setEditingItem,
    addItem,
    deleteItem,
    startEditing,
    saveEdit,
    togglePurchased,
    clearAllItems,
    showRecipe,
    deleteRecipe
  } = useShoppingList(language, theme);

  const t = getTranslation(language);

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

      {recipe && (
        <TouchableOpacity
          onPress={() => setIsBottomSheetVisible(true)}
        >
          <View style={[
            styles.recipeCard,
            theme === 'dark' && styles.darkRecipeCard
          ]}>
            <Text style={[
              styles.recipeTitle,
              theme === 'dark' && styles.darkRecipeTitle
            ]}>
              {recipe.name}
            </Text>
            <TouchableOpacity
              onPress={deleteRecipe}
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
      )}

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
          items={items}
          onShowRecipe={showRecipe}
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