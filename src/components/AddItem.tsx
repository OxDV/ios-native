import React from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme, Language } from '../types';
import { styles } from '../styles/styles';

type Props = {
  theme: Theme;
  language: Language;
  item: string;
  onChangeItem: (text: string) => void;
  onAddItem: () => void;
  isLoading: boolean;
};

export const AddItem: React.FC<Props> = ({
  theme,
  language,
  item,
  onChangeItem,
  onAddItem,
  isLoading,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        value={item}
        onChangeText={onChangeItem}
        placeholder={language === 'ru' ? "Введите название продукта или блюда" : "Enter product or dish name"}
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        onSubmitEditing={onAddItem}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={onAddItem}
        disabled={isLoading}
      >
        <Ionicons 
          name="add-circle" 
          size={44} 
          color={isLoading || theme === 'dark' ? '#4488ff' : 'blue'} 
          style={{ opacity: isLoading ? 0.5 : 1 }}
        />
      </TouchableOpacity>
    </View>
  );
}; 