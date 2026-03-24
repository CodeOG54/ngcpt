import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface OrderItem { id: string; product_name: string; product_price: number; quantity: number; }
interface Order {
  id: string; status: string; total: number; shipping_name: string; shipping_phone: string;
  shipping_address: string; payment_method: string; created_at: string; order_items: OrderItem[];
}

const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800', paid: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800', delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    const ch = supabase.channel('admin-orders').on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) toast.error(error.message); else { toast.success('Status updated'); fetchOrders(); }
  };

  return (
    <AdminLayout>
      <h1 className="heading-display text-2xl font-bold mb-6">Orders</h1>
      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-secondary rounded-lg animate-pulse" />)}</div>
      ) : orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-card rounded-xl border p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">{order.shipping_name} • {order.shipping_phone}</p>
                  <p className="text-xs text-muted-foreground">{order.shipping_address}</p>
                  <p className="text-xs text-muted-foreground mt-1">Payment: {order.payment_method}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={order.status} onValueChange={v => updateStatus(order.id, v)}>
                    <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{statuses.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                {order.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>R{(item.product_price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t mt-3 pt-3 flex justify-between font-semibold text-sm">
                <span>Total</span><span className="text-primary">R{order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
