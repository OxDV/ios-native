import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { getIconColor } from '../utils/theme';
import { getTranslation } from '../translations';
import { LanguageSelector } from './LanguageSelector';

type Props = {
  theme: Theme;
  language: Language;
  onToggleTheme: () => void;
  onToggleLanguage: (newLanguage: Language) => void;
};

export const Settings: React.FC<Props> = ({
  theme,
  language,
  onToggleTheme,
  onToggleLanguage,
}) => {
  const [isLanguageSelectorVisible, setIsLanguageSelectorVisible] = useState(false);
  const iconColor = getIconColor(theme);

  const getLanguageName = (code: Language): string => {
    switch (code) {
      case 'ru': return 'Русский';
      case 'en': return 'English';
      case 'uk': return 'Українська';
      case 'de': return 'Deutsch';
      case 'fr': return 'Français';
      case 'zh': return '中文';
      case 'pl': return 'Polski';
      case 'it': return 'Italiano';
      case 'es': return 'Español';
      default: return code;
    }
  };

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        {language === 'ru' ? 'Настройки' : 'Settings'}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, theme === 'dark' && styles.darkText]}>
          {language === 'ru' ? 'Внешний вид' : 'Appearance'}
        </Text>
        <TouchableOpacity 
          style={[styles.option, theme === 'dark' && styles.darkOption]} 
          onPress={onToggleTheme}
        >
          <View style={styles.optionLeft}>
            <Ionicons 
              name={theme === 'light' ? 'moon' : 'sunny'} 
              size={24} 
              color={iconColor}
              style={styles.optionIcon}
            />
            <Text style={[styles.optionText, theme === 'dark' && styles.darkText]}>
              {language === 'ru' ? 
                (theme === 'light' ? 'Темная тема' : 'Светлая тема') : 
                (theme === 'light' ? 'Dark Theme' : 'Light Theme')}
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={iconColor}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, theme === 'dark' && styles.darkText]}>
          {language === 'ru' ? 'Язык' : 'Language'}
        </Text>
        <TouchableOpacity 
          style={[styles.option, theme === 'dark' && styles.darkOption]} 
          onPress={() => setIsLanguageSelectorVisible(true)}
        >
          <View style={styles.optionLeft}>
            <Ionicons 
              name="language" 
              size={24} 
              color={iconColor}
              style={styles.optionIcon}
            />
            <Text style={[styles.optionText, theme === 'dark' && styles.darkText]}>
              {getLanguageName(language)}
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={iconColor}
          />
        </TouchableOpacity>
      </View>

      <LanguageSelector
        theme={theme}
        currentLanguage={language}
        isVisible={isLanguageSelectorVisible}
        onClose={() => setIsLanguageSelectorVisible(false)}
        onSelect={onToggleLanguage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
  },
  darkOption: {
    backgroundColor: '#2a2a2a',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 15,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
}); 