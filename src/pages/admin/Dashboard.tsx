import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, users: 0, revenue: 0 });

  useEffect(() => {
    const fetch = async () => {
      const [p, o, u] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total'),
        supabase.from('profiles').select('id', { count: 'exact', head: true }),
      ]);
      const revenue = (o.data || []).reduce((s, r) => s + Number(r.total), 0);
      setStats({ products: p.count || 0, orders: (o.data || []).length, users: u.count || 0, revenue });
    };
    fetch();
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `R${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'text-blue-600' },
    { label: 'Products', value: stats.products, icon: Package, color: 'text-primary' },
    { label: 'Users', value: stats.users, icon: Users, color: 'text-purple-600' },
  ];

  return (
    <AdminLayout>
      <h1 className="heading-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium">{c.label}</span>
              <c.icon className={`w-4 h-4 ${c.color}`} />
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
