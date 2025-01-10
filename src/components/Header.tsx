import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { styles } from '../styles/styles';

type Props = {
  theme: Theme;
  language: Language;
  isSettingsOpen: boolean;
  onToggleDrawer: () => void;
  onToggleSettings: () => void;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
};

export const Header: React.FC<Props> = ({
  theme,
  language,
  isSettingsOpen,
  onToggleDrawer,
  onToggleSettings,
  onToggleTheme,
  onToggleLanguage,
}) => {
  return (
    <View style={[styles.header, theme === 'dark' && styles.darkHeader]}>
      <TouchableOpacity onPress={onToggleDrawer} style={styles.menuButton}>
        <Ionicons name="menu" size={28} color={theme === 'dark' ? '#fff' : '#333'} />
      </TouchableOpacity>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        {language === 'ru' ? 'Список покупок' : 'Shopping List'}
      </Text>
      <View>
        <TouchableOpacity style={styles.settingsButton} onPress={onToggleSettings}>
          <Ionicons name="settings-outline" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
        </TouchableOpacity>
        
        {isSettingsOpen && (
          <View style={[styles.settingsDropdown, theme === 'dark' && styles.darkDrawer]}>
            <TouchableOpacity style={styles.settingsItem} onPress={onToggleTheme}>
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
            
            <TouchableOpacity style={styles.settingsItem} onPress={onToggleLanguage}>
              <Ionicons name="language" size={24} color={theme === 'dark' ? '#fff' : '#333'} />
              <Text style={[styles.settingsText, theme === 'dark' && styles.darkText]}>
                {language === 'ru' ? 'English' : 'Русский'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}; 