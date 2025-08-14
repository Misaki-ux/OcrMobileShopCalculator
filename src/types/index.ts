export interface PriceItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
  timestamp: number;
  imageUri?: string;
  ocrText?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: PriceItem[];
  total: number;
  createdAt: number;
  updatedAt: number;
}

export interface OCRResult {
  text: string;
  confidence: number;
  price?: number;
  name?: string;
}

export interface ScanHistory {
  id: string;
  imageUri: string;
  ocrResult: OCRResult;
  timestamp: number;
  listId?: string;
}