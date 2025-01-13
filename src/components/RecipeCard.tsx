import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface RecipeCardProps {
  recipe: any; // Определите правильный тип для данных рецепта
  theme: string;
  language: string;
  onPress: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, theme, language, onPress }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.card,
        theme === 'dark' && styles.darkCard
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.title,
        theme === 'dark' && styles.darkText
      ]}>
        {recipe.title}
      </Text>
      {/* Добавьте другие детали рецепта */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkCard: {
    backgroundColor: '#2a2a2a',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  darkText: {
    color: '#fff',
  },
}); 