import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Item, Theme, Language } from '../types';
import { styles } from '../styles/styles';
import { getTranslation } from '../translations';

type Props = {
  item: Item;
  theme: Theme;
  language: Language;
  editingId: string | null;
  editingItem: string;
  onEdit: (id: string, name: string) => void;
  onSaveEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  setEditingItem: (text: string) => void;
};

export const ShoppingItem: React.FC<Props> = ({
  item: { id, name, purchased },
  theme,
  language,
  editingId,
  editingItem,
  onEdit,
  onSaveEdit,
  onDelete,
  onToggle,
  setEditingItem,
}) => {
  const t = getTranslation(language);

  if (editingId === id) {
    return (
      <View style={[styles.itemContainer, theme === 'dark' && styles.darkItemContainer]}>
        <View style={styles.editContainer}>
          <TextInput
            style={[styles.editInput, theme === 'dark' && styles.darkEditInput]}
            value={editingItem}
            onChangeText={setEditingItem}
            autoFocus
            placeholder={t.errors.emptyItem}
            placeholderTextColor={theme === 'dark' ? '#888' : '#999'}
          />
          <TouchableOpacity onPress={() => onSaveEdit(id)}>
            <Ionicons name="checkmark-circle" size={24} color={theme === 'dark' ? '#4CAF50' : 'green'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.itemContainer, theme === 'dark' && styles.darkItemContainer]}>
      <View style={styles.itemLeftSection}>
        <TouchableOpacity style={styles.checkbox} onPress={() => onToggle(id)}>
          <Ionicons
            name={purchased ? "checkbox" : "square-outline"}
            size={24}
            color={theme === 'dark' ? '#4488ff' : 'blue'}
          />
        </TouchableOpacity>
        <Text style={[
          styles.itemText,
          theme === 'dark' && styles.darkText,
          purchased && styles.purchasedText,
          purchased && theme === 'dark' && styles.darkPurchasedText,
        ]}>
          {name}
        </Text>
      </View>
      <View style={styles.itemButtons}>
        <TouchableOpacity onPress={() => onEdit(id, name)}>
          <Ionicons name="pencil" size={24} color={theme === 'dark' ? '#4488ff' : 'blue'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(id)}>
          <Ionicons name="trash" size={24} color={theme === 'dark' ? '#ff4444' : 'red'} />
        </TouchableOpacity>
      </View>
    </View>
  );
}; 