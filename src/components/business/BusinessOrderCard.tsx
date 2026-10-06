import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PreOrder } from '@/context/BasketContext';

interface BusinessOrderCardProps {
  order: PreOrder;
  onUpdateStatus: (orderId: string, nextStatus: PreOrder['status']) => void;
  onCancelOrder: (orderId: string) => void;
}

export const BusinessOrderCard: React.FC<BusinessOrderCardProps> = ({
  order,
  onUpdateStatus,
  onCancelOrder,
}) => {
  const getStatusBadge = () => {
    switch (order.status) {
      case 'received':
        return {
          label: 'New Order',
          bg: '#FFF3E0',
          color: '#E65100',
          icon: 'alert-circle',
        };
      case 'preparing':
        return {
          label: 'In Kitchen',
          bg: '#E3F2FD',
          color: '#1976D2',
          icon: 'flame',
        };
      case 'ready':
        return {
          label: 'Ready for Pickup',
          bg: '#E8F5E9',
          color: '#2E7D32',
          icon: 'checkmark-circle',
        };
      case 'completed':
        return {
          label: 'Completed',
          bg: 'rgba(118, 118, 128, 0.12)',
          color: 'rgba(60, 60, 67, 0.7)',
          icon: 'checkbox',
        };
      default:
        return {
          label: order.status,
          bg: 'rgba(118, 118, 128, 0.12)',
          color: '#000000',
          icon: 'help-circle',
        };
    }
  };

  const badge = getStatusBadge();

  return (
    <View style={styles.cardContainer}>
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View style={styles.orderNumberCol}>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.orderCreatedAt}>{order.createdAt}</Text>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
          <Ionicons name={badge.icon as any} size={13} color={badge.color} />
          <Text style={[styles.statusBadgeText, { color: badge.color }]}>
            {badge.label}
          </Text>
        </View>
      </View>

      {/* Pickup Slot & Customer Info */}
      <View style={styles.pickupInfoRow}>
        <View style={styles.pickupPill}>
          <Ionicons name="time-outline" size={14} color="#111111" />
          <Text style={styles.pickupPillText}>Pickup: {order.pickupTimeSlot}</Text>
        </View>
        <Text style={styles.paymentMethodText}>Cash on Counter / GCash</Text>
      </View>

      {/* Special Customer Instructions Note */}
      {order.specialInstructions ? (
        <View style={styles.noteCallout}>
          <Ionicons name="chatbox-ellipses" size={14} color="#D42F13" />
          <Text style={styles.noteCalloutText}>
            Note: &ldquo;{order.specialInstructions}&rdquo;
          </Text>
        </View>
      ) : null}

      {/* Itemized Order List */}
      <View style={styles.itemsListContainer}>
        {order.items.map((item, idx) => (
          <View key={item.id || idx} style={styles.itemRow}>
            <View style={styles.qtyBadge}>
              <Text style={styles.qtyText}>{item.quantity}×</Text>
            </View>
            <View style={styles.itemDetailCol}>
              <Text style={styles.itemName}>{item.foodName}</Text>
              {item.selectedNote ? (
                <Text style={styles.itemSubnote}>{item.selectedNote}</Text>
              ) : null}
            </View>
            <Text style={styles.itemPrice}>₱{item.price * item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Order Total */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Ticket Total</Text>
        <Text style={styles.totalAmount}>₱{order.total}</Text>
      </View>

      {/* Action Buttons depending on status */}
      <View style={styles.actionRow}>
        {order.status === 'received' && (
          <>
            <Pressable
              onPress={() => onCancelOrder(order.id)}
              style={({ pressed }) => [styles.cancelBtn, pressed && styles.pressed]}
              hitSlop={6}
            >
              <Text style={styles.cancelBtnText}>Decline</Text>
            </Pressable>

            <Pressable
              onPress={() => onUpdateStatus(order.id, 'preparing')}
              style={({ pressed }) => [styles.primaryActionBtn, pressed && styles.primaryPressed]}
              hitSlop={6}
            >
              <Ionicons name="flame" size={15} color="#FFFFFF" />
              <Text style={styles.primaryActionText}>Start Preparing</Text>
            </Pressable>
          </>
        )}

        {order.status === 'preparing' && (
          <Pressable
            onPress={() => onUpdateStatus(order.id, 'ready')}
            style={({ pressed }) => [
              styles.primaryActionBtn,
              { backgroundColor: '#2E7D32' },
              pressed && styles.primaryPressed,
            ]}
            hitSlop={6}
          >
            <Ionicons name="notifications" size={15} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Mark Ready for Pickup</Text>
          </Pressable>
        )}

        {order.status === 'ready' && (
          <Pressable
            onPress={() => onUpdateStatus(order.id, 'completed')}
            style={({ pressed }) => [
              styles.primaryActionBtn,
              { backgroundColor: '#1C1C1E' },
              pressed && styles.primaryPressed,
            ]}
            hitSlop={6}
          >
            <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
            <Text style={styles.primaryActionText}>Complete & Handed Over</Text>
          </Pressable>
        )}

        {order.status === 'completed' && (
          <View style={styles.completedInfoRow}>
            <Ionicons name="checkmark-circle" size={16} color="#34C759" />
            <Text style={styles.completedInfoText}>Order settled & picked up</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(60, 60, 67, 0.15)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderNumberCol: {},
  orderNumber: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  orderCreatedAt: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.5)',
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  pickupInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pickupPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pickupPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  paymentMethodText: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
  },
  noteCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(212, 47, 19, 0.06)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  noteCalloutText: {
    flex: 1,
    fontSize: 13,
    color: '#D42F13',
    fontStyle: 'italic',
  },
  itemsListContainer: {
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
    paddingVertical: 10,
    gap: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBadge: {
    width: 28,
    height: 24,
    backgroundColor: '#F2F2F7',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  itemDetailCol: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  itemSubnote: {
    fontSize: 12,
    color: 'rgba(60, 60, 67, 0.6)',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.12)',
    marginBottom: 14,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(60, 60, 67, 0.7)',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#D42F13',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  primaryActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#D42F13',
    paddingVertical: 11,
    borderRadius: 10,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  completedInfoRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 6,
  },
  completedInfoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#34C759',
  },
  pressed: {
    opacity: 0.6,
  },
  primaryPressed: {
    opacity: 0.85,
  },
});
