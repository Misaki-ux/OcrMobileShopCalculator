import { ShoppingList, PriceItem } from '../types';
import { StorageService } from './StorageService';

export class ShoppingListService {
  static async createShoppingList(name: string): Promise<ShoppingList> {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      total: 0,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await StorageService.addShoppingList(newList);
    return newList;
  }

  static async addItemToList(listId: string, item: Omit<PriceItem, 'id' | 'timestamp'>): Promise<ShoppingList> {
    const lists = await StorageService.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
      throw new Error('Liste non trouvée');
    }

    const newItem: PriceItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    lists[listIndex].items.push(newItem);
    lists[listIndex].total = this.calculateTotal(lists[listIndex].items);
    lists[listIndex].updatedAt = Date.now();

    await StorageService.saveShoppingLists(lists);
    return lists[listIndex];
  }

  static async updateItemInList(listId: string, itemId: string, updates: Partial<PriceItem>): Promise<ShoppingList> {
    const lists = await StorageService.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
      throw new Error('Liste non trouvée');
    }

    const itemIndex = lists[listIndex].items.findIndex(item => item.id === itemId);
    if (itemIndex === -1) {
      throw new Error('Article non trouvé');
    }

    lists[listIndex].items[itemIndex] = {
      ...lists[listIndex].items[itemIndex],
      ...updates,
    };

    lists[listIndex].total = this.calculateTotal(lists[listIndex].items);
    lists[listIndex].updatedAt = Date.now();

    await StorageService.saveShoppingLists(lists);
    return lists[listIndex];
  }

  static async removeItemFromList(listId: string, itemId: string): Promise<ShoppingList> {
    const lists = await StorageService.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
      throw new Error('Liste non trouvée');
    }

    lists[listIndex].items = lists[listIndex].items.filter(item => item.id !== itemId);
    lists[listIndex].total = this.calculateTotal(lists[listIndex].items);
    lists[listIndex].updatedAt = Date.now();

    await StorageService.saveShoppingLists(lists);
    return lists[listIndex];
  }

  static async updateItemQuantity(listId: string, itemId: string, quantity: number): Promise<ShoppingList> {
    if (quantity <= 0) {
      return this.removeItemFromList(listId, itemId);
    }

    return this.updateItemInList(listId, itemId, { 
      quantity, 
      total: 0 // Sera recalculé automatiquement
    });
  }

  static async clearList(listId: string): Promise<ShoppingList> {
    const lists = await StorageService.getShoppingLists();
    const listIndex = lists.findIndex(list => list.id === listId);
    
    if (listIndex === -1) {
      throw new Error('Liste non trouvée');
    }

    lists[listIndex].items = [];
    lists[listIndex].total = 0;
    lists[listIndex].updatedAt = Date.now();

    await StorageService.saveShoppingLists(lists);
    return lists[listIndex];
  }

  static async duplicateList(listId: string, newName?: string): Promise<ShoppingList> {
    const lists = await StorageService.getShoppingLists();
    const originalList = lists.find(list => list.id === listId);
    
    if (!originalList) {
      throw new Error('Liste non trouvée');
    }

    const duplicatedList: ShoppingList = {
      ...originalList,
      id: Date.now().toString(),
      name: newName || `${originalList.name} (Copie)`,
      items: originalList.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      })),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    // Recalculer le total
    duplicatedList.total = this.calculateTotal(duplicatedList.items);

    await StorageService.addShoppingList(duplicatedList);
    return duplicatedList;
  }

  static async getListStats(listId: string): Promise<{
    totalItems: number;
    totalValue: number;
    averagePrice: number;
    mostExpensiveItem?: PriceItem;
    cheapestItem?: PriceItem;
  }> {
    const lists = await StorageService.getShoppingLists();
    const list = lists.find(l => l.id === listId);
    
    if (!list) {
      throw new Error('Liste non trouvée');
    }

    const totalItems = list.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = list.total;
    const averagePrice = totalItems > 0 ? totalValue / totalItems : 0;

    const sortedByPrice = [...list.items].sort((a, b) => a.price - b.price);
    const mostExpensiveItem = sortedByPrice[sortedByPrice.length - 1];
    const cheapestItem = sortedByPrice[0];

    return {
      totalItems,
      totalValue,
      averagePrice,
      mostExpensiveItem,
      cheapestItem,
    };
  }

  private static calculateTotal(items: PriceItem[]): number {
    return items.reduce((sum, item) => sum + item.total, 0);
  }

  static async searchInLists(query: string): Promise<{
    list: ShoppingList;
    matchingItems: PriceItem[];
  }[]> {
    const lists = await StorageService.getShoppingLists();
    const results: { list: ShoppingList; matchingItems: PriceItem[] }[] = [];

    for (const list of lists) {
      const matchingItems = list.items.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.ocrText?.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingItems.length > 0) {
        results.push({ list, matchingItems });
      }
    }

    return results;
  }

  static async exportListAsCSV(listId: string): Promise<string> {
    const lists = await StorageService.getShoppingLists();
    const list = lists.find(l => l.id === listId);
    
    if (!list) {
      throw new Error('Liste non trouvée');
    }

    const headers = ['Nom', 'Prix', 'Quantité', 'Total', 'Date'];
    const rows = list.items.map(item => [
      item.name,
      item.price.toString(),
      item.quantity.toString(),
      item.total.toString(),
      new Date(item.timestamp).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    return csvContent;
  }
}