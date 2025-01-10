import React from 'react';
import { Animated, View, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { styles } from '../styles/styles';

type Props = {
  theme: Theme;
  language: Language;
  drawerAnimation: Animated.Value;
};

export const DrawerMenu: React.FC<Props> = ({ theme, language, drawerAnimation }) => {
  return (
    <Animated.View
      style={[
        styles.drawer,
        theme === 'dark' && styles.darkDrawer,
        {
          transform: [{ translateX: drawerAnimation }]
        }
      ]}
    >
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
  );
}; 