import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { ShoppingList } from '../ShoppingList';
import { getRecipeWithIngredients } from '../../services/openai';
import { loadItems, loadRecipe, saveItems, saveRecipe } from '../../utils/storage';

// Мокаем внешние зависимости
jest.mock('../../services/openai');
jest.mock('../../utils/storage', () => ({
  saveItems: jest.fn(),
  loadItems: jest.fn().mockResolvedValue([]),
  saveRecipe: jest.fn(),
  loadRecipe: jest.fn().mockResolvedValue(''),
}));
jest.spyOn(Alert, 'alert');

describe('ShoppingList Integration', () => {
  const mockRecipeResponse = `
Ингредиенты:
- Свекла
- Капуста
- Морковь

Рецепт:
1. Нарезать овощи
2. Варить 1 час
`;

  beforeEach(async () => {
    jest.clearAllMocks();
    (getRecipeWithIngredients as jest.Mock).mockResolvedValue(mockRecipeResponse);
    (loadItems as jest.Mock).mockResolvedValue([]);
    (loadRecipe as jest.Mock).mockResolvedValue('');
  });

  it('calls OpenAI service when adding a recipe', async () => {
    const { getByTestId, getByPlaceholderText, findByTestId } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации компонента
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Вводим название рецепта
    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    await act(async () => {
      fireEvent.changeText(input, 'Борщ');
    });

    // Нажимаем кнопку добавления
    const addButton = getByTestId('add-button');
    await act(async () => {
      fireEvent.press(addButton);
    });

    // Проверяем, что OpenAI сервис был вызван с правильным параметром
    expect(getRecipeWithIngredients).toHaveBeenCalledWith('Борщ');

    // Проверяем, что ингредиенты были добавлены в список
    const ingredients = mockRecipeResponse
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2).trim());

    // Ждем, пока все ингредиенты появятся в списке
    for (const ingredient of ingredients) {
      await findByTestId(`item-${ingredient}`);
    }

    // Проверяем, что данные были сохранены
    expect(saveItems).toHaveBeenCalled();
    expect(saveRecipe).toHaveBeenCalled();
  });

  it('shows loading state while waiting for OpenAI response', async () => {
    // Делаем задержку в ответе OpenAI
    (getRecipeWithIngredients as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockRecipeResponse), 100))
    );

    const { getByTestId, getByPlaceholderText } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации компонента
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    await act(async () => {
      fireEvent.changeText(input, 'Борщ');
    });

    const addButton = getByTestId('add-button');
    await act(async () => {
      fireEvent.press(addButton);
    });

    // Проверяем состояние загрузки
    expect(input.props.editable).toBe(false);
    expect(addButton.props.accessibilityState.disabled).toBe(true);

    // Ждем окончания загрузки
    await waitFor(
      () => {
        expect(input.props.editable).toBe(true);
        expect(addButton.props.accessibilityState.disabled).toBe(false);
      },
      { timeout: 1000 }
    );
  });

  it('handles OpenAI service errors gracefully', async () => {
    // Мокаем ошибку от OpenAI
    (getRecipeWithIngredients as jest.Mock).mockRejectedValue(new Error('API Error'));

    const { getByTestId, getByPlaceholderText } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации компонента
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const input = getByPlaceholderText('Пожалуйста, введите название продукта');
    await act(async () => {
      fireEvent.changeText(input, 'Борщ');
    });

    const addButton = getByTestId('add-button');
    await act(async () => {
      fireEvent.press(addButton);
    });

    // Проверяем, что ошибка была обработана
    expect(Alert.alert).toHaveBeenCalledWith(
      'Ошибка',
      'Ошибка при получении ингредиентов. Попробуйте еще раз'
    );

    // Проверяем, что компоненты вернулись в нормальное состояние
    expect(input.props.editable).toBe(true);
    expect(addButton.props.accessibilityState.disabled).toBe(false);
  });
}); 