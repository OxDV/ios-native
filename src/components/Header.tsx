import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, Language } from '../types';

type Props = {
  theme: Theme;
  language: Language;
};

export const Header: React.FC<Props> = ({
  theme,
  language,
}) => {
  return (
    <View style={[styles.header, theme === 'dark' && styles.darkHeader]}>
      <Text style={[styles.title, theme === 'dark' && styles.darkText]}>
        {language === 'ru' ? 'Список покупок' : 'Shopping List'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  darkHeader: {
    backgroundColor: '#1a1a1a',
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  darkText: {
    color: '#fff',
  },
}); 