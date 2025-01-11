import React from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, FlatList } from 'react-native';
import { Theme, Language } from '../types';
import { styles } from '../styles/styles';
import { ShoppingItem } from './ShoppingItem';
import { AddItem } from './AddItem';
import { getTranslation } from '../translations';
import { useShoppingList } from '../hooks/useShoppingList';

type Props = {
  theme: Theme;
  language: Language;
};

export const ShoppingList: React.FC<Props> = ({ theme, language }) => {
  const {
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
  } = useShoppingList(language);

  return (
    <View style={styles.container}>
      <AddItem
        theme={theme}
        language={language}
        item={item}
        onChangeItem={setItem}
        onAddItem={addItem}
        isLoading={isLoading}
      />

      {items.length > 0 && (
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.recipeButton, theme === 'dark' && styles.recipeButtonDark]}
            onPress={showRecipe}
          >
            <Text style={styles.buttonText}>
              {getTranslation(language).buttons.recipe}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.clearButton, theme === 'dark' && styles.clearButtonDark]}
            onPress={clearAllItems}
          >
            <Text style={styles.buttonText}>
              {getTranslation(language).buttons.clearAll}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {isLoading && (
        <View style={[styles.overlay, styles.loadingOverlay]}>
          <ActivityIndicator size="large" color={theme === 'dark' ? '#fff' : '#000'} />
        </View>
      )}

      <FlatList
        data={items}
        renderItem={({ item: listItem }) => (
          <ShoppingItem
            item={listItem}
            theme={theme}
            editingId={editingId}
            editingItem={editingItem}
            onEdit={startEditing}
            onSaveEdit={saveEdit}
            onDelete={deleteItem}
            onToggle={togglePurchased}
            setEditingItem={setEditingItem}
          />
        )}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}; 