import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Cart() {
  const { items, loading, updateQuantity, removeItem, subtotal } = useCart();
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="heading-display text-2xl font-bold mb-2">Sign in to view your cart</h2>
          <Button asChild className="rounded-full mt-4"><Link to="/auth">Sign In</Link></Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="heading-display text-3xl md:text-4xl font-bold mb-8">Your Cart</h1>
        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-secondary rounded-xl animate-pulse" />)}</div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild variant="outline" className="rounded-full"><Link to="/shop">Browse Products</Link></Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex gap-4 p-4 bg-card rounded-xl border">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                    {item.product?.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : <div className="w-full h-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{item.product?.name}</h3>
                    <p className="text-primary font-semibold text-sm mt-1">R{(item.product?.price || 0).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 hover:bg-secondary rounded transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 hover:bg-secondary rounded transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    <p className="font-semibold text-sm">R{((item.product?.price || 0) * item.quantity).toFixed(2)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-card rounded-xl border p-6 h-fit sticky top-24">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="flex justify-between text-sm mb-2"><span className="text-muted-foreground">Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
              <div className="border-t my-4" />
              <div className="flex justify-between font-semibold"><span>Total</span><span className="text-primary">R{subtotal.toFixed(2)}</span></div>
              <Button asChild className="w-full rounded-full mt-6" size="lg"><Link to="/checkout">Proceed to Checkout</Link></Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
