import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, FlatList, Animated } from 'react-native';
import { styles } from '../styles/styles';
import { Theme, Language, Item } from '../types';
import { getTranslation } from '../translations';
import { ShoppingItem } from './ShoppingItem';

type Props = {
  visible: boolean;
  onClose: () => void;
  theme: Theme;
  language: Language;
  items: Item[];
  onShowRecipe: () => void;
  onClearAll: () => void;
  editingId: string | null;
  editingItem: string;
  onEdit: (id: string, name: string) => void;
  onSaveEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  setEditingItem: (value: string) => void;
  hideRecipeButton?: boolean;
};

export const RecipeBottomSheet: React.FC<Props> = ({
  visible,
  onClose,
  theme,
  language,
  items,
  onShowRecipe,
  onClearAll,
  editingId,
  editingItem,
  onEdit,
  onSaveEdit,
  onDelete,
  onToggle,
  setEditingItem,
  hideRecipeButton,
}) => {
  const t = getTranslation(language);
  const slideAnim = useRef(new Animated.Value(1000)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        >
          <View style={{ flex: 1 }} />
        </TouchableOpacity>
        
        <Animated.View
          style={[
            styles.bottomSheet,
            theme === 'dark' && styles.darkBottomSheet,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.bottomSheetHandle} />
          
          <View style={styles.buttonsContainer}>
            {!hideRecipeButton && (
              <TouchableOpacity
                style={[styles.recipeButton, theme === 'dark' && styles.recipeButtonDark]}
                onPress={onShowRecipe}
              >
                <Text style={styles.buttonText}>
                  {t.buttons.recipe}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.clearButton,
                theme === 'dark' && styles.clearButtonDark,
                !hideRecipeButton && { flex: 1 }
              ]}
              onPress={onClearAll}
            >
              <Text style={styles.buttonText}>
                {t.buttons.clearAll}
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            renderItem={({ item: listItem }) => (
              <ShoppingItem
                item={listItem}
                theme={theme}
                language={language}
                editingId={editingId}
                editingItem={editingItem}
                onEdit={onEdit}
                onSaveEdit={onSaveEdit}
                onDelete={onDelete}
                onToggle={onToggle}
                setEditingItem={setEditingItem}
              />
            )}
            keyExtractor={item => item.id}
            style={[styles.list, theme === 'dark' && styles.darkList]}
          />
        </Animated.View>
      </View>
    </View>
  );
}; 