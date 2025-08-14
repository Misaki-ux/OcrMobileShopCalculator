import TesseractOcr, { LANG_ENGLISH, LANG_FRENCH } from 'react-native-tesseract-ocr';
import { OCRResult } from '../types';

const OCR_CONFIG = {
  whitelist: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz€$£¥., ',
  blacklist: '',
};

export class OCRService {
  private static isInitialized = false;

  static async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialiser Tesseract avec les langues supportées
      await TesseractOcr.init({
        lang: [LANG_ENGLISH, LANG_FRENCH],
        errorHandler: (error: any) => {
          console.error('Erreur OCR:', error);
        },
      });
      this.isInitialized = true;
      console.log('OCR Tesseract initialisé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation OCR:', error);
      throw error;
    }
  }

  static async recognizeText(imagePath: string): Promise<OCRResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const result = await TesseractOcr.recognize(imagePath, OCR_CONFIG);
      
      // Extraire le prix et le nom du texte reconnu
      const extractedData = this.extractPriceAndName(result.text);
      
      return {
        text: result.text,
        confidence: result.confidence,
        price: extractedData.price,
        name: extractedData.name,
      };
    } catch (error) {
      console.error('Erreur lors de la reconnaissance OCR:', error);
      throw error;
    }
  }

  private static extractPriceAndName(text: string): { price?: number; name?: string } {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    
    let price: number | undefined;
    let name: string | undefined;

    // Rechercher un prix dans le texte
    const priceRegex = /(\d+[.,]\d{2}|\d+[.,]\d{1}|\d+)/;
    for (const line of lines) {
      const priceMatch = line.match(priceRegex);
      if (priceMatch) {
        const priceStr = priceMatch[1].replace(',', '.');
        const parsedPrice = parseFloat(priceStr);
        if (!isNaN(parsedPrice) && parsedPrice > 0 && parsedPrice < 10000) {
          price = parsedPrice;
          break;
        }
      }
    }

    // Rechercher un nom de produit (ligne sans chiffres ou avec peu de chiffres)
    for (const line of lines) {
      const cleanLine = line.trim();
      if (cleanLine.length > 3 && cleanLine.length < 50) {
        const digitCount = (cleanLine.match(/\d/g) || []).length;
        const letterCount = (cleanLine.match(/[a-zA-Z]/g) || []).length;
        
        // Si la ligne contient plus de lettres que de chiffres, c'est probablement un nom
        if (letterCount > digitCount && digitCount < 3) {
          name = cleanLine;
          break;
        }
      }
    }

    return { price, name };
  }

  static async getAvailableLanguages(): Promise<string[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Retourner les langues supportées
      return [LANG_ENGLISH, LANG_FRENCH];
    } catch (error) {
      console.error('Erreur lors de la récupération des langues:', error);
      return [LANG_ENGLISH];
    }
  }

  static async setLanguage(language: string): Promise<void> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }
      
      // Reconfigurer Tesseract avec la nouvelle langue
      await TesseractOcr.init({
        lang: [language],
        errorHandler: (error: any) => {
          console.error('Erreur OCR:', error);
        },
      });
      
      console.log(`Langue OCR changée vers: ${language}`);
    } catch (error) {
      console.error('Erreur lors du changement de langue:', error);
      throw error;
    }
  }

  static async cleanup(): Promise<void> {
    try {
      if (this.isInitialized) {
        await TesseractOcr.stop();
        this.isInitialized = false;
        console.log('OCR Tesseract arrêté');
      }
    } catch (error) {
      console.error('Erreur lors du nettoyage OCR:', error);
    }
  }
}