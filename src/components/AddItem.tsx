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
};

export const AddItem: React.FC<Props> = ({
  theme,
  language,
  item,
  onChangeItem,
  onAddItem,
}) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, theme === 'dark' && styles.darkInput]}
        value={item}
        onChangeText={onChangeItem}
        placeholder={language === 'ru' ? "Введите название продукта" : "Enter product name"}
        placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
        onSubmitEditing={onAddItem}
      />
      <TouchableOpacity style={styles.addButton} onPress={onAddItem}>
        <Ionicons name="add-circle" size={44} color={theme === 'dark' ? '#4488ff' : 'blue'} />
      </TouchableOpacity>
    </View>
  );
}; 