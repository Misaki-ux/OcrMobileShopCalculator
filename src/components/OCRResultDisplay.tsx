import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { OCRResult, PriceItem } from '../types';
import { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../utils/styles';

const { width } = Dimensions.get('window');

interface OCRResultDisplayProps {
  ocrResult: OCRResult;
  imageUri: string;
  onAddToList: (item: Omit<PriceItem, 'id' | 'timestamp'>) => void;
  onRetry: () => void;
  onClose: () => void;
}

export const OCRResultDisplay: React.FC<OCRResultDisplayProps> = ({
  ocrResult,
  imageUri,
  onAddToList,
  onRetry,
  onClose,
}) => {
  const [title, setTitle] = useState(ocrResult.name || '');
  const [price, setPrice] = useState(ocrResult.price?.toString() || '');
  const [quantity, setQuantity] = useState('1');

  const handleAddToList = () => {
    if (!title.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir un titre pour l\'article');
      return;
    }

    if (!price || isNaN(parseFloat(price))) {
      Alert.alert('Erreur', 'Veuillez saisir un prix valide');
      return;
    }

    const quantityNum = parseInt(quantity) || 1;
    const priceNum = parseFloat(price);

    const newItem: Omit<PriceItem, 'id' | 'timestamp'> = {
      name: title.trim(),
      price: priceNum,
      quantity: quantityNum,
      total: priceNum * quantityNum,
      imageUri,
      ocrText: ocrResult.text,
    };

    onAddToList(newItem);
    onClose();
  };

  const updateQuantity = (increment: boolean) => {
    const currentQty = parseInt(quantity) || 1;
    const newQty = increment ? currentQty + 1 : Math.max(1, currentQty - 1);
    setQuantity(newQty.toString());
  };

  const confidenceColor = ocrResult.confidence > 0.8 ? colors.success[600] : 
                         ocrResult.confidence > 0.6 ? colors.warning[600] : colors.danger[600];

  const confidenceText = ocrResult.confidence > 0.8 ? 'Excellente' :
                        ocrResult.confidence > 0.6 ? 'Bonne' : 'Faible';

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* En-tête avec gradient */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Icon name="check-circle" size={28} color={colors.success[600]} />
            <Text style={styles.title}>Résultat du scan</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="times" size={20} color={colors.gray[600]} />
          </TouchableOpacity>
        </View>

        {/* Image scannée */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: `file://${imageUri}` }} style={styles.image} />
          <View style={styles.imageOverlay}>
            <Icon name="image" size={16} color={colors.white} />
            <Text style={styles.imageText}>Image scannée</Text>
          </View>
        </View>

        {/* Qualité de la reconnaissance */}
        <View style={styles.confidenceContainer}>
          <View style={styles.confidenceHeader}>
            <Icon name="chart-line" size={20} color={colors.primary[600]} />
            <Text style={styles.confidenceLabel}>Qualité de reconnaissance</Text>
          </View>
          <View style={styles.confidenceBar}>
            <View 
              style={[
                styles.confidenceFill, 
                { 
                  width: `${ocrResult.confidence * 100}%`,
                  backgroundColor: confidenceColor 
                }
              ]} 
            />
          </View>
          <View style={styles.confidenceInfo}>
            <Text style={[styles.confidenceText, { color: confidenceColor }]}>
              {confidenceText}
            </Text>
            <Text style={styles.confidencePercentage}>
              {(ocrResult.confidence * 100).toFixed(1)}%
            </Text>
          </View>
        </View>

        {/* Texte reconnu */}
        <View style={styles.textContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="file-text-o" size={20} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Texte reconnu</Text>
          </View>
          <View style={styles.ocrTextContainer}>
            <Text style={styles.ocrText}>{ocrResult.text}</Text>
          </View>
        </View>

        {/* Formulaire d'édition */}
        <View style={styles.formContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="edit" size={20} color={colors.primary[600]} />
            <Text style={styles.sectionTitle}>Détails de l'article</Text>
          </View>
          
          {/* Titre de l'article */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Icon name="tag" size={14} color={colors.gray[600]} /> Titre de l'article
            </Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Lait, Pain, Pommes..."
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          {/* Prix */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Icon name="euro" size={14} color={colors.gray[600]} /> Prix (€)
            </Text>
            <TextInput
              style={styles.textInput}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor={colors.gray[400]}
              keyboardType="numeric"
            />
          </View>

          {/* Quantité avec contrôles +/- */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              <Icon name="sort-numeric-asc" size={14} color={colors.gray[600]} /> Quantité
            </Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => updateQuantity(false)}
              >
                <Icon name="minus" size={16} color={colors.white} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.quantityInput}
                value={quantity}
                onChangeText={setQuantity}
                placeholder="1"
                placeholderTextColor={colors.gray[400]}
                keyboardType="numeric"
                textAlign="center"
              />
              
              <TouchableOpacity 
                style={styles.quantityButton} 
                onPress={() => updateQuantity(true)}
              >
                <Icon name="plus" size={16} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Calcul automatique du total */}
          {price && quantity && !isNaN(parseFloat(price)) && !isNaN(parseInt(quantity)) && (
            <View style={styles.totalContainer}>
              <View style={styles.totalHeader}>
                <Icon name="calculator" size={20} color={colors.success[600]} />
                <Text style={styles.totalLabel}>Total calculé</Text>
              </View>
              <Text style={styles.totalValue}>
                {(parseFloat(price) * parseInt(quantity)).toFixed(2)} €
              </Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Icon name="refresh" size={18} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.retryButtonText}>Nouveau scan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.addButton} onPress={handleAddToList}>
            <Icon name="plus" size={18} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.addButtonText}>Ajouter à la liste</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
    ...shadows.sm,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.gray[800],
    marginLeft: spacing[3],
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    margin: spacing[5],
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.white,
    ...shadows.md,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing[3],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: colors.white,
    marginLeft: spacing[2],
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
  },
  confidenceContainer: {
    margin: spacing[5],
    padding: spacing[5],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  confidenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  confidenceLabel: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
    marginLeft: spacing[3],
  },
  confidenceBar: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.full,
    overflow: 'hidden',
    marginBottom: spacing[3],
  },
  confidenceFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  confidenceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
  },
  confidencePercentage: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    fontWeight: fontWeights.medium,
  },
  textContainer: {
    margin: spacing[5],
    padding: spacing[5],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
    marginLeft: spacing[3],
  },
  ocrTextContainer: {
    backgroundColor: colors.gray[50],
    padding: spacing[4],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray[200],
  },
  ocrText: {
    fontSize: fontSizes.base,
    color: colors.gray[700],
    lineHeight: fontSizes.xl,
    fontFamily: 'monospace',
  },
  formContainer: {
    margin: spacing[5],
    padding: spacing[5],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  inputGroup: {
    marginBottom: spacing[5],
  },
  inputLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.gray[700],
    marginBottom: spacing[2],
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    fontSize: fontSizes.base,
    backgroundColor: colors.gray[50],
    color: colors.gray[800],
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quantityButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing[4],
    fontSize: fontSizes.xl,
    backgroundColor: colors.white,
    color: colors.gray[800],
    marginHorizontal: spacing[3],
    textAlign: 'center',
  },
  totalContainer: {
    padding: spacing[4],
    backgroundColor: colors.success[50],
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.success[200],
    marginTop: spacing[3],
  },
  totalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing[2],
  },
  totalLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.success[700],
    marginLeft: spacing[2],
  },
  totalValue: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    color: colors.success[700],
    textAlign: 'center',
  },
  actionsContainer: {
    margin: spacing[5],
    gap: spacing[3],
  },
  retryButton: {
    backgroundColor: colors.warning[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  buttonIcon: {
    marginRight: spacing[2],
  },
  retryButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  addButton: {
    backgroundColor: colors.success[600],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    ...shadows.md,
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
});