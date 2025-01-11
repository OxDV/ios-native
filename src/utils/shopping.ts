import { Item } from '../types';

export const createShoppingItem = (name: string): Item => ({
  id: Date.now().toString() + Math.random(),
  name: name.trim(),
  purchased: false,
}); 