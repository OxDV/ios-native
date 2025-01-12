import { renderHook, act } from '@testing-library/react-hooks';
import { Alert } from 'react-native';
import { useShoppingList } from '../useShoppingList';
import { getRecipeWithIngredients } from '../../services/openai';
import { loadItems, loadRecipe } from '../../utils/storage';

// Мокаем внешние зависимости
jest.mock('../../services/openai');
jest.mock('../../utils/storage', () => ({
  saveItems: jest.fn(),
  loadItems: jest.fn().mockResolvedValue([]),
  saveRecipe: jest.fn(),
  loadRecipe: jest.fn().mockResolvedValue(''),
}));
jest.spyOn(Alert, 'alert');

describe('useShoppingList Hook', () => {
  const mockRecipeResponse = `
Ингредиенты:
- Свекла
- Капуста
- Морковь
- Картофель

Рецепт:
1. Нарезать овощи
2. Варить 1 час
`;

  beforeEach(() => {
    jest.clearAllMocks();
    (getRecipeWithIngredients as jest.Mock).mockResolvedValue(mockRecipeResponse);
    (loadItems as jest.Mock).mockResolvedValue([]);
    (loadRecipe as jest.Mock).mockResolvedValue('');
  });

  it('should initialize with empty state', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useShoppingList('ru', 'light'));
    
    await waitForNextUpdate();
    
    expect(result.current.items).toEqual([]);
    expect(result.current.item).toBe('');
    expect(result.current.isLoading).toBe(false);
  });

  it('should show error when trying to add empty item', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useShoppingList('ru', 'light'));
    
    await waitForNextUpdate();
    
    await act(async () => {
      await result.current.addItem();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Ошибка',
      'Пожалуйста, введите название продукта'
    );
  });

  it('should add recipe and ingredients when adding an item', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useShoppingList('ru', 'light'));
    
    await waitForNextUpdate();
    
    // Устанавливаем название блюда
    act(() => {
      result.current.setItem('Борщ');
    });
    
    // Добавляем блюдо
    await act(async () => {
      await result.current.addItem();
    });
    
    // Проверяем, что был вызван API OpenAI
    expect(getRecipeWithIngredients).toHaveBeenCalledWith('Борщ');
    
    // Проверяем, что ингредиенты были добавлены в список
    const ingredients = mockRecipeResponse
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.trim().substring(2).trim());
    
    expect(result.current.items).toHaveLength(ingredients.length);
    expect(result.current.items.map(item => item.name)).toEqual(ingredients);
    
    // Проверяем состояние загрузки
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle API error when adding recipe', async () => {
    (getRecipeWithIngredients as jest.Mock).mockRejectedValue(new Error('API Error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useShoppingList('ru', 'light'));
    
    await waitForNextUpdate();
    
    act(() => {
      result.current.setItem('Борщ');
    });
    
    await act(async () => {
      await result.current.addItem();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Ошибка',
      'Ошибка при получении ингредиентов. Попробуйте еще раз'
    );
    expect(result.current.isLoading).toBe(false);
  });
}); 