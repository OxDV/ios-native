import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { View, Alert, Animated, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Item, Theme, Language } from './src/types';
import { styles } from './src/styles/styles';
import { ShoppingItem } from './src/components/ShoppingItem';
import { DrawerMenu } from './src/components/DrawerMenu';
import { Header } from './src/components/Header';
import { AddItem } from './src/components/AddItem';
import { getTranslation } from './src/translations';
import { getIngredientsForDish } from './src/services/openai';

export default function App() {
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ru');
  const [isLoading, setIsLoading] = useState(false);
  const drawerAnimation = useState(new Animated.Value(-300))[0];

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'ru' ? 'en' : 'ru');
  };

  const toggleDrawer = () => {
    const toValue = isDrawerOpen ? -300 : 0;
    Animated.timing(drawerAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsDrawerOpen(!isDrawerOpen);
  };

  const addItem = async () => {
    if (item.trim() === '') {
      const t = getTranslation(language);
      Alert.alert(t.alerts.error, t.errors.emptyItem);
      return;
    }

    try {
      setIsLoading(true);
      const t = getTranslation(language);
      
      // Try to get ingredients if it's a dish
      const ingredients = await getIngredientsForDish(item);
      
      if (ingredients.length > 0) {
        // Add all ingredients as separate items
        const newItems = ingredients.map(ingredient => ({
          id: Date.now().toString() + Math.random(),
          name: ingredient,
          purchased: false,
        }));
        
        setItems(prevItems => [...prevItems, ...newItems]);
        setItem('');
      } else {
        // If no ingredients found, add as a regular item
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
        <TouchableOpacity
          style={[styles.clearButton, theme === 'dark' && styles.clearButtonDark]}
          onPress={clearAllItems}
        >
          <Text style={styles.clearButtonText}>
            {getTranslation(language).buttons.clearAll}
          </Text>
        </TouchableOpacity>
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
