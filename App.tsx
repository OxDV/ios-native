import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header } from './src/components/Header';
import { ShoppingList } from './src/components/ShoppingList';
import { Settings } from './src/components/Settings';
import { Favorites } from './src/components/Favorites';
import { BottomTabBar } from './src/components/BottomTabBar';
import { useTheme } from './src/hooks/useTheme';
import { useLanguage } from './src/hooks/useLanguage';
import { useActiveTab } from './src/hooks/useActiveTab';
import { ShoppingListProvider } from './src/context/ShoppingListContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const { activeTab, handleTabPress } = useActiveTab();

  const renderContent = () => {
    switch (activeTab) {
      case 'list':
        return <ShoppingList theme={theme} language={language} />;
      case 'settings':
        return (
          <Settings
            theme={theme}
            language={language}
            onToggleTheme={toggleTheme}
            onToggleLanguage={toggleLanguage}
          />
        );
      case 'favorites':
        return <Favorites theme={theme} language={language} />;
      default:
        return null;
    }
  };

  return (
    <ShoppingListProvider language={language} theme={theme}>
      <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
        {activeTab === 'list' && (
          <Header
            theme={theme}
            language={language}
          />
        )}

        <View style={styles.content}>
          {renderContent()}
        </View>

        <BottomTabBar
          theme={theme}
          activeTab={activeTab}
          onTabPress={handleTabPress}
        />
      </View>
    </ShoppingListProvider>
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
  content: {
    flex: 1,
    marginBottom: 60,
  },
  emptyContainer: {
    flex: 1,
  },
});
