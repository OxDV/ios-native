import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Theme } from '../types';
import { getIconColor, getAccentColor } from '../utils/theme';

type Props = {
  theme: Theme;
  activeTab: 'list' | 'favorites' | 'settings';
  onTabPress: (tab: 'list' | 'favorites' | 'settings') => void;
};

export const BottomTabBar: React.FC<Props> = ({
  theme,
  activeTab,
  onTabPress,
}) => {
  const iconColor = getIconColor(theme);
  const accentColor = getAccentColor(theme);

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onTabPress('favorites')}
      >
        <Ionicons 
          name="heart" 
          size={24} 
          color={activeTab === 'favorites' ? accentColor : iconColor} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onTabPress('list')}
      >
        <Ionicons 
          name="list" 
          size={28} 
          color={activeTab === 'list' ? accentColor : iconColor} 
        />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.tab} 
        onPress={() => onTabPress('settings')}
      >
        <Ionicons 
          name="settings-outline" 
          size={24} 
          color={activeTab === 'settings' ? accentColor : iconColor} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 10,
  },
  darkContainer: {
    backgroundColor: '#1a1a1a',
    borderTopColor: '#333',
  },
  tab: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
}); 