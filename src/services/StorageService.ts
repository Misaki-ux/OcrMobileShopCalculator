import AsyncStorage from '@react-native-async-storage/async-storage';
import { ShoppingList, PriceItem, ScanHistory } from '../types';

const STORAGE_KEYS = {
  SHOPPING_LISTS: 'shopping_lists',
  SCAN_HISTORY: 'scan_history',
  SETTINGS: 'settings',
};

export class StorageService {
  // Gestion des listes d'achats
  static async saveShoppingLists(lists: ShoppingList[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SHOPPING_LISTS, JSON.stringify(lists));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des listes:', error);
      throw error;
    }
  }

  static async getShoppingLists(): Promise<ShoppingList[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SHOPPING_LISTS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des listes:', error);
      return [];
    }
  }

  static async addShoppingList(list: ShoppingList): Promise<void> {
    try {
      const lists = await this.getShoppingLists();
      lists.push(list);
      await this.saveShoppingLists(lists);
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la liste:', error);
      throw error;
    }
  }

  static async updateShoppingList(updatedList: ShoppingList): Promise<void> {
    try {
      const lists = await this.getShoppingLists();
      const index = lists.findIndex(list => list.id === updatedList.id);
      if (index !== -1) {
        lists[index] = updatedList;
        await this.saveShoppingLists(lists);
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la liste:', error);
      throw error;
    }
  }

  static async deleteShoppingList(listId: string): Promise<void> {
    try {
      const lists = await this.getShoppingLists();
      const filteredLists = lists.filter(list => list.id !== listId);
      await this.saveShoppingLists(filteredLists);
    } catch (error) {
      console.error('Erreur lors de la suppression de la liste:', error);
      throw error;
    }
  }

  // Gestion de l'historique des scans
  static async saveScanHistory(history: ScanHistory[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SCAN_HISTORY, JSON.stringify(history));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'historique:', error);
      throw error;
    }
  }

  static async getScanHistory(): Promise<ScanHistory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SCAN_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error);
      return [];
    }
  }

  static async addScanToHistory(scan: ScanHistory): Promise<void> {
    try {
      const history = await this.getScanHistory();
      history.unshift(scan); // Ajouter au début
      
      // Limiter l'historique à 100 éléments
      if (history.length > 100) {
        history.splice(100);
      }
      
      await this.saveScanHistory(history);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du scan:', error);
      throw error;
    }
  }

  // Gestion des paramètres
  static async saveSettings(settings: any): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des paramètres:', error);
      throw error;
    }
  }

  static async getSettings(): Promise<any> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      return {};
    }
  }

  // Nettoyage du cache
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.SHOPPING_LISTS,
        STORAGE_KEYS.SCAN_HISTORY,
        STORAGE_KEYS.SETTINGS,
      ]);
    } catch (error) {
      console.error('Erreur lors du nettoyage du cache:', error);
      throw error;
    }
  }
}