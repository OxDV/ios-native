import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
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
  const t = getTranslation(language);

  return (
    <SafeAreaView style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        {t.alerts.settings}
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, theme === 'dark' && styles.darkText]}>
          {t.alerts.appearance}
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
              {theme === 'light' ? t.alerts.darkTheme : t.alerts.lightTheme}
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
          {t.alerts.language}
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
              {t.languages[language]}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    paddingHorizontal: 20,
    marginTop: 0,
  },
  darkText: {
    color: '#fff',
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
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