/// <reference types="jest" />

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
- Свекла (500 г)
- Капуста (1/4 кочана)
- Морковь (2 шт)
- Картофель (3-4 шт)
- Лук репчатый (1 шт)
- Томатная паста (2 ст.л.)
- Масло растительное (30 мл)
- Соль и перец по вкусу

Рецепт:
1. Очистить и нарезать свеклу соломкой
2. Нашинковать капусту
3. Натереть морковь на крупной терке
4. Нарезать картофель кубиками
5. Мелко нарезать лук
6. В кастрюле обжарить лук и морковь на растительном масле
7. Добавить свеклу и тушить 5-7 минут
8. Добавить томатную пасту, перемешать
9. Залить водой, довести до кипения
10. Добавить картофель, варить 15 минут
11. Добавить капусту, варить еще 10 минут
12. Посолить, поперчить по вкусу
13. Готовить на медленном огне 5-7 минут

Время приготовления: 1 час`;

  beforeEach(async () => {
    jest.clearAllMocks();
    (getRecipeWithIngredients as jest.Mock).mockResolvedValue(mockRecipeResponse);
    (loadItems as jest.Mock).mockResolvedValue([]);
    (loadRecipe as jest.Mock).mockResolvedValue('');
  });

  it('calls OpenAI service and adds ingredients when adding a recipe', async () => {
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

  it('allows to mark ingredients as purchased', async () => {
    const { getByTestId, getByPlaceholderText, findByTestId } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации и добавляем рецепт
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
      // Ждем обработки запроса к OpenAI
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Находим первый ингредиент и отмечаем его как купленный
    const firstIngredient = 'Свекла (500 г)';
    await findByTestId(`item-${firstIngredient}`);
    const checkbox = getByTestId(`checkbox-${firstIngredient}`);
    
    await act(async () => {
      fireEvent.press(checkbox);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Проверяем, что состояние изменилось и данные сохранились
    expect(saveItems).toHaveBeenCalled();
  });

  it('allows to edit ingredient name', async () => {
    const { getByTestId, getByPlaceholderText, findByTestId } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации и добавляем рецепт
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
      // Ждем обработки запроса к OpenAI
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Находим первый ингредиент
    const firstIngredient = 'Свекла (500 г)';
    await findByTestId(`item-${firstIngredient}`);
    
    // Нажимаем кнопку редактирования
    const editButton = getByTestId(`edit-button-${firstIngredient}`);
    await act(async () => {
      fireEvent.press(editButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Вводим новое название
    const editInput = await findByTestId(`edit-item-${firstIngredient}`);
    const newName = 'Свекла красная (500 г)';
    await act(async () => {
      fireEvent.changeText(editInput, newName);
    });

    // Сохраняем изменения
    const saveButton = getByTestId(`save-button-${firstIngredient}`);
    await act(async () => {
      fireEvent.press(saveButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Проверяем, что изменения сохранились
    expect(saveItems).toHaveBeenCalled();
    await findByTestId(`item-${newName}`);
  });

  it('allows to delete ingredients', async () => {
    const { getByTestId, getByPlaceholderText, findByTestId, queryByTestId } = render(
      <ShoppingList theme="light" language="ru" />
    );

    // Ждем инициализации и добавляем рецепт
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
      // Ждем обработки запроса к OpenAI
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    // Находим первый ингредиент
    const firstIngredient = 'Свекла (500 г)';
    await findByTestId(`item-${firstIngredient}`);
    
    // Нажимаем кнопку удаления
    const deleteButton = getByTestId(`delete-button-${firstIngredient}`);
    await act(async () => {
      fireEvent.press(deleteButton);
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Проверяем, что ингредиент был удален
    expect(queryByTestId(`item-${firstIngredient}`)).toBeNull();
    expect(saveItems).toHaveBeenCalled();
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