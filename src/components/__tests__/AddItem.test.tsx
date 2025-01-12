/// <reference types="jest" />

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AddItem } from '../AddItem';
import { jest, expect, describe, it, beforeEach } from '@jest/globals';

describe('AddItem Component', () => {
  const mockProps = {
    theme: 'light' as const,
    language: 'ru' as const,
    item: '',
    onChangeItem: jest.fn(),
    onAddItem: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(<AddItem {...mockProps} />);
    expect(getByPlaceholderText('Пожалуйста, введите название продукта')).toBeTruthy();
  });

  it('calls onChangeItem when text input changes', () => {
    const { getByPlaceholderText } = render(<AddItem {...mockProps} />);
    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    
    fireEvent.changeText(input, 'Борщ');
    
    expect(mockProps.onChangeItem).toHaveBeenCalledWith('Борщ');
    expect(mockProps.onChangeItem).toHaveBeenCalledTimes(1);
  });

  it('calls onAddItem when plus button is pressed', () => {
    const { getByTestId } = render(<AddItem {...mockProps} />);
    const addButton = getByTestId('add-button');
    
    fireEvent.press(addButton);
    
    expect(mockProps.onAddItem).toHaveBeenCalledTimes(1);
  });

  it('calls onAddItem when submitting text input', () => {
    const { getByPlaceholderText } = render(<AddItem {...mockProps} />);
    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    
    fireEvent(input, 'submitEditing');
    
    expect(mockProps.onAddItem).toHaveBeenCalledTimes(1);
  });

  it('disables input and button when loading', () => {
    const loadingProps = {
      ...mockProps,
      isLoading: true,
    };
    
    const { getByPlaceholderText, getByTestId } = render(<AddItem {...loadingProps} />);
    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    const addButton = getByTestId('add-button');
    
    expect(input.props.editable).toBe(false);
    expect(addButton.props.accessibilityState.disabled).toBe(true);
  });
}); 