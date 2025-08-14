import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { CameraScanner } from '../components/CameraScanner';
import { OCRResultDisplay } from '../components/OCRResultDisplay';
import { OCRResult, PriceItem } from '../types';
import { colors } from '../utils/styles';

interface ScannerScreenProps {
  navigation: any;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({ navigation }) => {
  const [showResult, setShowResult] = useState(false);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [imageUri, setImageUri] = useState<string>('');

  const handleScanComplete = (result: OCRResult, uri: string) => {
    setOcrResult(result);
    setImageUri(uri);
    setShowResult(true);
  };

  const handleClose = () => {
    setShowResult(false);
    setOcrResult(null);
    setImageUri('');
  };

  const handleRetry = () => {
    setShowResult(false);
    setOcrResult(null);
    setImageUri('');
  };

  const handleAddToList = (item: Omit<PriceItem, 'id' | 'timestamp'>) => {
    // Ici vous pouvez naviguer vers la sélection de liste ou ajouter directement
    // Pour l'instant, on retourne à l'écran principal
    navigation.goBack();
  };

  if (showResult && ocrResult && imageUri) {
    return (
      <OCRResultDisplay
        ocrResult={ocrResult}
        imageUri={imageUri}
        onAddToList={handleAddToList}
        onRetry={handleRetry}
        onClose={handleClose}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraScanner
        onScanComplete={handleScanComplete}
        onClose={() => navigation.goBack()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
});