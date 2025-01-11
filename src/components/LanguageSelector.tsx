import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { getIconColor } from '../utils/theme';
import { getTranslation } from '../translations';

type Props = {
  theme: Theme;
  currentLanguage: Language;
  isVisible: boolean;
  onClose: () => void;
  onSelect: (language: Language) => void;
};

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
];

export const LanguageSelector: React.FC<Props> = ({
  theme,
  currentLanguage,
  isVisible,
  onClose,
  onSelect,
}) => {
  const iconColor = getIconColor(theme);
  const slideAnim = new Animated.Value(0);
  const t = getTranslation(currentLanguage);

  useEffect(() => {
    if (isVisible) {
      slideAnim.setValue(0);
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [600, 0],
  });

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1}
        onPress={handleClose}
      >
        <Animated.View 
          style={[
            styles.modalContent,
            theme === 'dark' && styles.darkModalContent,
            { transform: [{ translateY }] }
          ]}
        >
          <View style={styles.header}>
            <Text style={[
              styles.title,
              theme === 'dark' && styles.darkText
            ]}>
              {t.alerts.selectLanguage || (currentLanguage === 'ru' ? 'Выберите язык' : 'Select Language')}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.languageList}>
            {languages.map(({ code, name, flag }) => (
              <TouchableOpacity
                key={code}
                style={[
                  styles.languageOption,
                  theme === 'dark' && styles.darkLanguageOption,
                  currentLanguage === code && styles.selectedOption,
                  currentLanguage === code && theme === 'dark' && styles.darkSelectedOption,
                ]}
                onPress={() => {
                  onSelect(code);
                  handleClose();
                }}
              >
                <Text style={styles.flag}>{flag}</Text>
                <Text style={[
                  styles.languageName,
                  theme === 'dark' && styles.darkText,
                  currentLanguage === code && styles.selectedText,
                ]}>
                  {t.languages[code]}
                </Text>
                {currentLanguage === code && (
                  <Ionicons
                    name="checkmark"
                    size={24}
                    color={theme === 'dark' ? '#4488ff' : 'blue'}
                    style={styles.checkmark}
                  />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  darkModalContent: {
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
  closeButton: {
    padding: 5,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
    borderRadius: 12,
  },
  darkLanguageOption: {
    backgroundColor: '#2a2a2a',
  },
  selectedOption: {
    backgroundColor: '#e3efff',
  },
  darkSelectedOption: {
    backgroundColor: '#1a3366',
  },
  flag: {
    fontSize: 24,
    marginRight: 15,
  },
  languageName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedText: {
    fontWeight: 'bold',
  },
  checkmark: {
    marginLeft: 10,
  },
}); 