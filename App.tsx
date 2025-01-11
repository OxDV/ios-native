import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Text, FlatList } from 'react-native';
import { styles } from './src/styles/styles';
import { ShoppingItem } from './src/components/ShoppingItem';
import { DrawerMenu } from './src/components/DrawerMenu';
import { Header } from './src/components/Header';
import { AddItem } from './src/components/AddItem';
import { getTranslation } from './src/translations';
import { useTheme, useLanguage, useDrawer, useShoppingList } from './src/hooks';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { isDrawerOpen, drawerAnimation, toggleDrawer } = useDrawer();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
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

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      
      <DrawerMenu
        theme={theme}
        language={language}
        drawerAnimation={drawerAnimation}
      />

      <Header
        theme={theme}
        language={language}
        isSettingsOpen={isSettingsOpen}
        onToggleDrawer={toggleDrawer}
        onToggleSettings={toggleSettings}
        onToggleTheme={toggleTheme}
        onToggleLanguage={toggleLanguage}
      />
      
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

      {(isDrawerOpen || isSettingsOpen) && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => {
            if (isDrawerOpen) toggleDrawer();
            if (isSettingsOpen) setIsSettingsOpen(false);
          }}
        />
      )}
    </View>
  );
}
