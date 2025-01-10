import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, FlatList, Alert, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Item = {
  id: string;
  name: string;
  purchased: boolean;
};

type Theme = 'light' | 'dark';
type Language = 'ru' | 'en';

export default function App() {
  const [item, setItem] = useState('');
  const [editingItem, setEditingItem] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguage] = useState<Language>('ru');
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

  const addItem = () => {
    if (item.trim() === '') {
      Alert.alert('Ошибка', 'Пожалуйста, введите название продукта');
      return;
    }
    
    setItems([...items, { id: Date.now().toString(), name: item.trim(), purchased: false }]);
    setItem('');
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

  const renderItem = ({ item: { id, name, purchased } }: { item: Item }) => (
    <View style={[
      styles.itemContainer,
      theme === 'dark' && styles.darkItemContainer
    ]}>
      {editingId === id ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[
              styles.editInput,
              theme === 'dark' && styles.darkEditInput
            ]}
            value={editingItem}
            onChangeText={setEditingItem}
            autoFocus
          />
          <TouchableOpacity onPress={() => saveEdit(id)}>
            <Ionicons name="checkmark-circle" size={24} color={theme === 'dark' ? '#4CAF50' : 'green'} />
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.itemLeftSection}>
            <TouchableOpacity 
              style={styles.checkbox} 
              onPress={() => togglePurchased(id)}
            >
              <Ionicons 
                name={purchased ? "checkbox" : "square-outline"} 
                size={24} 
                color={theme === 'dark' ? '#4488ff' : 'blue'} 
              />
            </TouchableOpacity>
            <Text style={[
              styles.itemText,
              theme === 'dark' && styles.darkText,
              purchased && styles.purchasedText,
              purchased && theme === 'dark' && styles.darkPurchasedText,
            ]}>
              {name}
            </Text>
          </View>
          <View style={styles.itemButtons}>
            <TouchableOpacity onPress={() => startEditing(id, name)}>
              <Ionicons 
                name="pencil" 
                size={24} 
                color={theme === 'dark' ? '#4488ff' : 'blue'} 
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteItem(id)}>
              <Ionicons 
                name="trash" 
                size={24} 
                color={theme === 'dark' ? '#ff4444' : 'red'} 
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      {/* Drawer Menu */}
      <Animated.View style={[
        styles.drawer,
        theme === 'dark' && styles.darkDrawer,
        {
          transform: [{ translateX: drawerAnimation }]
        }
      ]}>
        <View style={[styles.drawerContent, theme === 'dark' && styles.darkDrawer]}>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="list" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
            <Text style={[styles.drawerItemText, theme === 'dark' && styles.darkText]}>
              {language === 'ru' ? 'Список покупок' : 'Shopping List'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="bookmark" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
            <Text style={[styles.drawerItemText, theme === 'dark' && styles.darkText]}>
              {language === 'ru' ? 'Сохраненные' : 'Saved'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.drawerItem}>
            <Ionicons name="heart" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
            <Text style={[styles.drawerItemText, theme === 'dark' && styles.darkText]}>
              {language === 'ru' ? 'Избранное' : 'Favorites'}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Main Content */}
      <View style={[styles.header, theme === 'dark' && styles.darkHeader]}>
        <TouchableOpacity onPress={toggleDrawer} style={styles.menuButton}>
          <Ionicons name="menu" size={28} color={theme === 'dark' ? '#fff' : '#333'} />
        </TouchableOpacity>
        <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
          {language === 'ru' ? 'Список покупок' : 'Shopping List'}
        </Text>
        <View>
          <TouchableOpacity style={styles.settingsButton} onPress={toggleSettings}>
            <Ionicons name="settings-outline" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
          </TouchableOpacity>
          
          {/* Settings Dropdown */}
          {isSettingsOpen && (
            <View style={[styles.settingsDropdown, theme === 'dark' && styles.darkDrawer]}>
              <TouchableOpacity style={styles.settingsItem} onPress={toggleTheme}>
                <Ionicons 
                  name={theme === 'light' ? 'moon' : 'sunny'} 
                  size={24} 
                  color={theme === 'dark' ? '#fff' : '#333'} 
                />
                <Text style={[styles.settingsText, theme === 'dark' && styles.darkText]}>
                  {language === 'ru' ? 
                    (theme === 'light' ? 'Темная тема' : 'Светлая тема') : 
                    (theme === 'light' ? 'Dark Theme' : 'Light Theme')}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.settingsItem} onPress={toggleLanguage}>
                <Ionicons name="language" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
                <Text style={[styles.settingsText, theme === 'dark' && styles.darkText]}>
                  {language === 'ru' ? 'English' : 'Русский'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, theme === 'dark' && styles.darkInput]}
          value={item}
          onChangeText={setItem}
          placeholder={language === 'ru' ? "Введите название продукта" : "Enter product name"}
          placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          onSubmitEditing={addItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Ionicons name="add-circle" size={44} color={theme === 'dark' ? '#4488ff' : 'blue'} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />

      {/* Overlay for drawer */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  menuButton: {
    padding: 5,
  },
  settingsButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 300,
    backgroundColor: '#fff',
    zIndex: 2,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  darkDrawer: {
    backgroundColor: '#2a2a2a',
    borderRightColor: '#333',
  },
  settingsDropdown: {
    position: 'absolute',
    top: 45,
    right: 0,
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 3,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingsText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  drawerContent: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  drawerItemText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  addButton: {
    padding: 5,
  },
  list: {
    flex: 1,
    paddingHorizontal: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: 10,
  },
  darkItemContainer: {
    backgroundColor: '#2a2a2a',
  },
  itemLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  checkbox: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  purchasedText: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  darkPurchasedText: {
    color: '#666',
  },
  darkEditInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  itemButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginRight: 10,
  },
});
