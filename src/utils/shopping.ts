import { Item } from '../types';

export const createShoppingItem = (name: string, existingId?: string): Item => ({
  id: existingId || name.toLowerCase().replace(/\s+/g, '-'),
  name: name.trim(),
  purchased: false,
}); 