import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ShoppingList, PriceItem } from '../types';
import { StorageService } from '../services/StorageService';
import { ShoppingListService } from '../services/ShoppingListService';
import { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../utils/styles';

interface ShoppingListScreenProps {
  navigation: any;
  route: any;
}

export const ShoppingListScreen: React.FC<ShoppingListScreenProps> = ({ navigation, route }) => {
  const { listId } = route.params;
  const [shoppingList, setShoppingList] = useState<ShoppingList | null>(null);
  const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');

  useEffect(() => {
    loadShoppingList();
  }, [listId]);

  const loadShoppingList = async () => {
    try {
      const lists = await StorageService.getShoppingLists();
      const list = lists.find(l => l.id === listId);
      if (list) {
        setShoppingList(list);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la liste:', error);
    }
  };

  const updateItemQuantity = async (itemId: string, increment: boolean) => {
    if (!shoppingList) return;

    try {
      const item = shoppingList.items.find(i => i.id === itemId);
      if (!item) return;

      const newQuantity = increment ? item.quantity + 1 : Math.max(1, item.quantity - 1);
      const updatedList = await ShoppingListService.updateItemQuantity(listId, itemId, newQuantity);
      setShoppingList(updatedList);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la quantité:', error);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!shoppingList) return;

    Alert.alert(
      'Supprimer l\'article',
      'Êtes-vous sûr de vouloir supprimer cet article ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedList = await ShoppingListService.removeItemFromList(listId, itemId);
              setShoppingList(updatedList);
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
            }
          },
        },
      ]
    );
  };

  const startEditing = (item: PriceItem) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditQuantity(item.quantity.toString());
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editingItem || !shoppingList) return;

    try {
      const updatedItem = {
        ...editingItem,
        name: editName.trim(),
        price: parseFloat(editPrice),
        quantity: parseInt(editQuantity),
        total: parseFloat(editPrice) * parseInt(editQuantity),
      };

      const updatedList = await ShoppingListService.updateItemInList(listId, editingItem.id, updatedItem);
      setShoppingList(updatedList);
      setShowEditModal(false);
      setEditingItem(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      Alert.alert('Erreur', 'Impossible de mettre à jour l\'article');
    }
  };

  const clearList = async () => {
    if (!shoppingList) return;

    Alert.alert(
      'Vider la liste',
      'Êtes-vous sûr de vouloir vider complètement cette liste ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Vider',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedList = await ShoppingListService.clearList(listId);
              setShoppingList(updatedList);
            } catch (error) {
              console.error('Erreur lors du vidage:', error);
            }
          },
        },
      ]
    );
  };

  const duplicateList = async () => {
    if (!shoppingList) return;

    try {
      const newList = await ShoppingListService.duplicateList(listId);
      navigation.navigate('ShoppingList', { listId: newList.id });
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      Alert.alert('Erreur', 'Impossible de dupliquer la liste');
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toFixed(2)} €`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (!shoppingList) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement de la liste...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={20} color={colors.white} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.listName}>{shoppingList.name}</Text>
          <Text style={styles.listDate}>
            Créée le {formatDate(shoppingList.createdAt)}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.menuButton}>
          <Icon name="ellipsis-v" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Statistiques de la liste */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Icon name="cube" size={24} color={colors.primary[600]} />
          <Text style={styles.statValue}>{shoppingList.items.length}</Text>
          <Text style={styles.statLabel}>Articles</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="euro" size={24} color={colors.success[600]} />
          <Text style={styles.statValue}>{formatCurrency(shoppingList.total)}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        
        <View style={styles.statCard}>
          <Icon name="calendar" size={24} color={colors.warning[600]} />
          <Text style={styles.statValue}>
            {formatDate(shoppingList.updatedAt)}
          </Text>
          <Text style={styles.statLabel}>Modifiée</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={clearList}>
          <Icon name="trash" size={16} color={colors.danger[600]} />
          <Text style={[styles.actionButtonText, { color: colors.danger[600] }]}>
            Vider la liste
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={duplicateList}>
          <Icon name="copy" size={16} color={colors.primary[600]} />
          <Text style={styles.actionButtonText}>Dupliquer</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des articles */}
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {shoppingList.items.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="shopping-basket" size={48} color={colors.gray[400]} />
            <Text style={styles.emptyStateTitle}>Liste vide</Text>
            <Text style={styles.emptyStateSubtitle}>
              Scannez des prix pour ajouter des articles à cette liste
            </Text>
          </View>
        ) : (
          shoppingList.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
              
              <View style={styles.itemControls}>
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateItemQuantity(item.id, false)}
                  >
                    <Icon name="minus" size={14} color={colors.white} />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => updateItemQuantity(item.id, true)}
                  >
                    <Icon name="plus" size={14} color={colors.white} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.itemActions}>
                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => startEditing(item)}
                  >
                    <Icon name="edit" size={16} color={colors.primary[600]} />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionIconButton}
                    onPress={() => removeItem(item.id)}
                  >
                    <Icon name="trash" size={16} color={colors.danger[600]} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.itemTotal}>
                <Text style={styles.itemTotalLabel}>Total:</Text>
                <Text style={styles.itemTotalValue}>{formatCurrency(item.total)}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal d'édition */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Modifier l'article</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Icon name="times" size={20} color={colors.gray[600]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom de l'article</Text>
                <TextInput
                  style={styles.textInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Nom de l'article"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Prix (€)</Text>
                <TextInput
                  style={styles.textInput}
                  value={editPrice}
                  onChangeText={setEditPrice}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Quantité</Text>
                <TextInput
                  style={styles.textInput}
                  value={editQuantity}
                  onChangeText={setEditQuantity}
                  placeholder="1"
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.saveButton} onPress={saveEdit}>
                <Text style={styles.saveButtonText}>Enregistrer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    backgroundColor: colors.primary[600],
    paddingTop: spacing[8],
    paddingBottom: spacing[5],
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    alignItems: 'center',
    ...shadows.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing[3],
  },
  headerInfo: {
    flex: 1,
  },
  listName: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginBottom: spacing[1],
  },
  listDate: {
    fontSize: fontSizes.sm,
    color: 'rgba(255,255,255,0.8)',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: spacing[5],
    gap: spacing[3],
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.white,
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    ...shadows.md,
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.gray[800],
    marginTop: spacing[2],
    marginBottom: spacing[1],
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray[600],
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    padding: spacing[5],
    gap: spacing[3],
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray[200],
    ...shadows.sm,
  },
  actionButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary[600],
    marginLeft: spacing[2],
  },
  itemsContainer: {
    flex: 1,
    padding: spacing[5],
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing[8],
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  emptyStateTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[700],
    marginTop: spacing[3],
    marginBottom: spacing[2],
  },
  emptyStateSubtitle: {
    fontSize: fontSizes.base,
    color: colors.gray[500],
    textAlign: 'center',
    lineHeight: fontSizes.xl,
  },
  itemCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.md,
  },
  itemInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  itemName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
    flex: 1,
  },
  itemPrice: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary[600],
  },
  itemControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing[3],
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.lg,
    padding: spacing[1],
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
    paddingHorizontal: spacing[3],
    minWidth: 40,
    textAlign: 'center',
  },
  itemActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  actionIconButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  itemTotalLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.gray[600],
  },
  itemTotalValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.success[600],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    width: '90%',
    maxWidth: 400,
    ...shadows.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing[5],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  modalTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
  },
  modalBody: {
    padding: spacing[5],
  },
  inputGroup: {
    marginBottom: spacing[4],
  },
  inputLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.gray[700],
    marginBottom: spacing[2],
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: borderRadius.lg,
    padding: spacing[3],
    fontSize: fontSizes.base,
    backgroundColor: colors.gray[50],
    color: colors.gray[800],
  },
  modalActions: {
    flexDirection: 'row',
    padding: spacing[5],
    gap: spacing[3],
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  cancelButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.gray[600],
  },
  saveButton: {
    flex: 1,
    padding: spacing[3],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary[600],
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    color: colors.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: fontSizes.lg,
    color: colors.gray[600],
  },
});