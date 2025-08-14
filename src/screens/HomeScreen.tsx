import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ShoppingList, PriceItem } from '../types';
import { StorageService } from '../services/StorageService';
import { ShoppingListService } from '../services/ShoppingListService';
import { colors, spacing, fontSizes, fontWeights, borderRadius, shadows } from '../utils/styles';

interface HomeScreenProps {
  navigation: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      const lists = await StorageService.getShoppingLists();
      setShoppingLists(lists);
      
      // Calculer les totaux globaux
      const globalTotal = lists.reduce((sum, list) => sum + list.total, 0);
      const globalItems = lists.reduce((sum, list) => sum + list.items.length, 0);
      
      setTotalSpent(globalTotal);
      setTotalItems(globalItems);
    } catch (error) {
      console.error('Erreur lors du chargement des listes:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShoppingLists();
    setRefreshing(false);
  };

  const createNewList = async () => {
    try {
      const listName = `Liste ${shoppingLists.length + 1}`;
      const newList = await ShoppingListService.createShoppingList(listName);
      setShoppingLists([...shoppingLists, newList]);
      navigation.navigate('ShoppingList', { listId: newList.id });
    } catch (error) {
      console.error('Erreur lors de la création de la liste:', error);
      Alert.alert('Erreur', 'Impossible de créer une nouvelle liste');
    }
  };

  const deleteList = async (listId: string) => {
    Alert.alert(
      'Supprimer la liste',
      'Êtes-vous sûr de vouloir supprimer cette liste ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await ShoppingListService.deleteShoppingList(listId);
              setShoppingLists(shoppingLists.filter(list => list.id !== listId));
              await loadShoppingLists(); // Recharger pour mettre à jour les totaux
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer la liste');
            }
          },
        },
      ]
    );
  };

  const openScanner = () => {
    navigation.navigate('Scanner');
  };

  const openList = (listId: string) => {
    navigation.navigate('ShoppingList', { listId });
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

  return (
    <View style={styles.container}>
      {/* En-tête avec statistiques */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Icon name="shopping-cart" size={32} color={colors.white} />
          <Text style={styles.headerTitle}>Scanner de Prix</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Icon name="cog" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Statistiques globales */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="euro" size={24} color={colors.primary[600]} />
            <Text style={styles.statValue}>{formatCurrency(totalSpent)}</Text>
            <Text style={styles.statLabel}>Total dépensé</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="list" size={24} color={colors.success[600]} />
            <Text style={styles.statValue}>{shoppingLists.length}</Text>
            <Text style={styles.statLabel}>Listes créées</Text>
          </View>
          
          <View style={styles.statCard}>
            <Icon name="cube" size={24} color={colors.warning[600]} />
            <Text style={styles.statValue}>{totalItems}</Text>
            <Text style={styles.statLabel}>Articles scannés</Text>
          </View>
        </View>

        {/* Actions principales */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={openScanner}>
            <Icon name="camera" size={24} color={colors.white} style={styles.buttonIcon} />
            <Text style={styles.primaryButtonText}>Scanner un prix</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={createNewList}>
            <Icon name="plus" size={20} color={colors.primary[600]} style={styles.buttonIcon} />
            <Text style={styles.secondaryButtonText}>Nouvelle liste</Text>
          </TouchableOpacity>
        </View>

        {/* Listes d'achats */}
        <View style={styles.listsContainer}>
          <View style={styles.sectionHeader}>
            <Icon name="list-alt" size={20} color={colors.gray[700]} />
            <Text style={styles.sectionTitle}>Mes listes d'achats</Text>
          </View>
          
          {shoppingLists.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="shopping-basket" size={48} color={colors.gray[400]} />
              <Text style={styles.emptyStateTitle}>Aucune liste créée</Text>
              <Text style={styles.emptyStateSubtitle}>
                Commencez par scanner un prix ou créer une nouvelle liste
              </Text>
            </View>
          ) : (
            shoppingLists.map((list) => (
              <TouchableOpacity
                key={list.id}
                style={styles.listCard}
                onPress={() => openList(list.id)}
              >
                <View style={styles.listCardHeader}>
                  <View style={styles.listInfo}>
                    <Text style={styles.listName}>{list.name}</Text>
                    <Text style={styles.listDate}>
                      Créée le {formatDate(list.createdAt)}
                    </Text>
                  </View>
                  <View style={styles.listStats}>
                    <Text style={styles.listTotal}>{formatCurrency(list.total)}</Text>
                    <Text style={styles.listItemsCount}>
                      {list.items.length} article{list.items.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.listCardActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openList(list.id)}
                  >
                    <Icon name="eye" size={16} color={colors.primary[600]} />
                    <Text style={styles.actionButtonText}>Voir</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => deleteList(list.id)}
                  >
                    <Icon name="trash" size={16} color={colors.danger[600]} />
                    <Text style={[styles.actionButtonText, { color: colors.danger[600] }]}>
                      Supprimer
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Bouton flottant pour scanner rapidement */}
        <View style={styles.floatingButtonContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={openScanner}>
            <Icon name="camera" size={24} color={colors.white} />
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
  header: {
    backgroundColor: colors.primary[600],
    paddingTop: spacing[8],
    paddingBottom: spacing[5],
    paddingHorizontal: spacing[5],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.white,
    marginLeft: spacing[3],
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
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
    fontSize: fontSizes.xl,
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
    padding: spacing[5],
    gap: spacing[3],
  },
  primaryButton: {
    backgroundColor: colors.primary[600],
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
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.primary[600],
    ...shadows.sm,
  },
  secondaryButtonText: {
    color: colors.primary[600],
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
  },
  listsContainer: {
    padding: spacing[5],
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
  listCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    padding: spacing[4],
    marginBottom: spacing[3],
    ...shadows.md,
  },
  listCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing[3],
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.gray[800],
    marginBottom: spacing[1],
  },
  listDate: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
  },
  listStats: {
    alignItems: 'flex-end',
  },
  listTotal: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.primary[600],
    marginBottom: spacing[1],
  },
  listItemsCount: {
    fontSize: fontSizes.sm,
    color: colors.gray[500],
  },
  listCardActions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray[100],
  },
  actionButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    color: colors.primary[600],
    marginLeft: spacing[1],
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: spacing[8],
    right: spacing[5],
    zIndex: 50,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary[600],
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
});