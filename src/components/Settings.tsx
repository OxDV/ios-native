import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { getIconColor } from '../utils/theme';
import { getTranslation } from '../translations';

type Props = {
  theme: Theme;
  language: Language;
  onToggleTheme: () => void;
  onToggleLanguage: () => void;
};

export const Settings: React.FC<Props> = ({
  theme,
  language,
  onToggleTheme,
  onToggleLanguage,
}) => {
  const t = getTranslation(language);
  const iconColor = getIconColor(theme);

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
          onPress={onToggleLanguage}
        >
          <View style={styles.optionLeft}>
            <Ionicons 
              name="language" 
              size={24} 
              color={iconColor}
              style={styles.optionIcon}
            />
            <Text style={[styles.optionText, theme === 'dark' && styles.darkText]}>
              {language === 'ru' ? 'English' : 'Русский'}
            </Text>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={iconColor}
          />
        </TouchableOpacity>
      </View>
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