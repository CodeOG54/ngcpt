import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '', paymentMethod: 'payshap' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || items.length === 0) return;
    if (!form.name || !form.phone || !form.address) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data: order, error } = await supabase.from('orders').insert({
        user_id: user.id,
        total: subtotal,
        shipping_name: form.name,
        shipping_phone: form.phone,
        shipping_address: form.address,
        payment_method: form.paymentMethod,
        status: 'pending',
      }).select().single();

      if (error) throw error;

      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product?.name || '',
        product_price: item.product?.price || 0,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      await clearCart();
      setSuccess(true);
      toast.success('Order placed successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to place order');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="heading-display text-3xl font-bold mb-2">Order Placed!</h2>
          <p className="text-muted-foreground mb-6">Thank you for your order. You can track it in your orders page.</p>
          <Button onClick={() => navigate('/orders')} className="rounded-full">View Orders</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10 max-w-3xl">
        <h1 className="heading-display text-3xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-card rounded-xl border p-6 space-y-4">
            <h2 className="font-semibold text-lg">Shipping Details</h2>
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="rounded-lg mt-1" />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} required className="rounded-lg mt-1" />
            </div>
            <div>
              <Label>Delivery Address</Label>
              <Input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} required className="rounded-lg mt-1" />
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Payment</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input type="radio" name="payment" value="payshap" checked={form.paymentMethod === 'payshap'}
                  onChange={() => setForm(f => ({ ...f, paymentMethod: 'payshap' }))} className="mt-1" />
                <div>
                  <p className="font-medium text-sm">PayShap</p>
                  <p className="text-xs text-muted-foreground mt-1">ShapID: +27-743806050@standardbank</p>
                  <p className="text-xs text-muted-foreground">Preferred name: NGCPT</p>
                </div>
              </label>
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <input type="radio" name="payment" value="cash" checked={form.paymentMethod === 'cash'}
                  onChange={() => setForm(f => ({ ...f, paymentMethod: 'cash' }))} className="mt-1" />
                <div>
                  <p className="font-medium text-sm">Cash</p>
                  <p className="text-xs text-muted-foreground mt-1">Drop off at 9 Fountain Road, Harmony Village</p>
                </div>
              </label>
            </div>
          </div>

          <div className="bg-card rounded-xl border p-6">
            <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm py-2">
                <span>{item.product?.name} × {item.quantity}</span>
                <span>R{((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-3 pt-3 flex justify-between font-semibold">
              <span>Total</span><span className="text-primary">R{subtotal.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" disabled={loading || items.length === 0} size="lg" className="w-full rounded-full">
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </form>
      </div>
    </Layout>
  );
}
