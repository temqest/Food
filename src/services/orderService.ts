import { supabase } from '@/lib/supabase';
import { PreOrder } from '@/context/BasketContext';

export interface DBUserOrder {
  id: string;
  user_id: string;
  establishment_id: string | null;
  establishment_name: string;
  status: string;
  dining_option: string;
  pickup_time: string;
  special_instructions: string | null;
  payment_method: string;
  items: any;
  total_amount: number;
  qr_code_value: string | null;
  created_at: string;
}

export const OrderService = {
  /**
   * Fetch active pre-orders for the authenticated user from Supabase.
   */
  async getUserOrders(userId: string): Promise<PreOrder[]> {
    try {
      if (!userId || userId === 'usr_guest') return [];

      const { data, error } = await supabase
        .from('user_orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) {
        if (error) console.warn('[OrderService] Error fetching user orders:', error);
        return [];
      }

      return data.map((row: DBUserOrder) => {
        // Map database status back to PreOrder status
        let status: PreOrder['status'] = 'received';
        if (row.status === 'preparing') status = 'preparing';
        else if (row.status === 'ready_for_pickup' || row.status === 'ready') status = 'ready';
        else if (row.status === 'completed') status = 'completed';
        else if (row.status === 'confirmed') status = 'received';

        const rawItems = Array.isArray(row.items) ? row.items : [];
        const items = rawItems.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
        }));

        const total = Number(row.total_amount) || 0;
        const subtotal = items.reduce(
          (sum: number, it: any) => sum + (it.price * it.quantity),
          0
        ) || total;

        const estMinutes =
          status === 'received' ? 15 : status === 'preparing' ? 8 : 0;

        return {
          id: row.id,
          orderNumber: row.id.startsWith('#') ? row.id : `#${row.id.slice(-6).toUpperCase()}`,
          establishmentId: row.establishment_id || '',
          establishmentName: row.establishment_name,
          establishmentAddress: items[0]?.establishmentAddress || 'Naga City',
          items,
          subtotal,
          fee: 0,
          total,
          diningOption: (row.dining_option === 'takeout' ? 'takeout' : 'dine_in') as 'dine_in' | 'takeout',
          pickupTimeSlot: row.pickup_time || 'ASAP (15–20 mins)',
          specialInstructions: row.special_instructions || undefined,
          paymentMethod: (row.payment_method === 'gcash' ? 'gcash' : row.payment_method === 'maya' ? 'maya' : 'cash') as 'cash' | 'gcash' | 'maya',
          paymentStatus: row.payment_method === 'cash' ? 'pending_counter' : 'paid',
          paymentRefNumber: row.qr_code_value || undefined,
          status,
          createdAt: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Just now',
          estimatedMinutesRemaining: estMinutes,
        };
      });
    } catch (err) {
      console.warn('[OrderService] Caught error fetching orders:', err);
      return [];
    }
  },

  /**
   * Save a newly placed pre-order to Supabase user_orders.
   */
  async createOrder(userId: string, order: PreOrder): Promise<boolean> {
    try {
      if (!userId || userId === 'usr_guest') return true;

      // Map PreOrder status to DB status
      let dbStatus = 'confirmed';
      if (order.status === 'preparing') dbStatus = 'preparing';
      else if (order.status === 'ready') dbStatus = 'ready_for_pickup';
      else if (order.status === 'completed') dbStatus = 'completed';

      // Sanitize items for JSON storage (remove ImageSource require numbers)
      const sanitizedItems = order.items.map((item) => ({
        id: item.id,
        foodId: item.foodId,
        foodName: item.foodName,
        price: item.price,
        establishmentId: item.establishmentId,
        establishmentName: item.establishmentName,
        establishmentAddress: item.establishmentAddress,
        image: typeof item.image === 'string' ? item.image : '',
        quantity: item.quantity,
        selectedNote: item.selectedNote || '',
      }));

      const payload = {
        id: order.id,
        user_id: userId,
        establishment_id: order.establishmentId || null,
        establishment_name: order.establishmentName,
        status: dbStatus,
        dining_option: order.diningOption,
        pickup_time: order.pickupTimeSlot,
        special_instructions: order.specialInstructions || null,
        payment_method: order.paymentMethod,
        items: sanitizedItems,
        total_amount: order.total,
        qr_code_value: order.paymentRefNumber || order.id,
      };

      const { error } = await supabase.from('user_orders').insert(payload);
      if (error) {
        console.warn('[OrderService] Error inserting user order:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[OrderService] Caught error creating order:', err);
      return false;
    }
  },

  /**
   * Update order status in Supabase user_orders.
   */
  async updateOrderStatus(orderId: string, status: PreOrder['status']): Promise<boolean> {
    try {
      let dbStatus = 'confirmed';
      if (status === 'preparing') dbStatus = 'preparing';
      else if (status === 'ready') dbStatus = 'ready_for_pickup';
      else if (status === 'completed') dbStatus = 'completed';

      const { error } = await supabase
        .from('user_orders')
        .update({ status: dbStatus })
        .eq('id', orderId);

      if (error) {
        console.warn('[OrderService] Error updating order status:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[OrderService] Caught error updating order status:', err);
      return false;
    }
  },

  /**
   * Cancel/delete order from Supabase user_orders.
   */
  async cancelOrder(orderId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.warn('[OrderService] Error deleting order:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.warn('[OrderService] Caught error deleting order:', err);
      return false;
    }
  },
};

