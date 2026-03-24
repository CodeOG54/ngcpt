import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from 'lucide-react';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r bg-card hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h2 className="heading-display text-lg font-bold">Admin Panel</h2>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${pathname === l.to ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}>
              <l.icon className="w-4 h-4" /> {l.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
        </div>
      </aside>
      <div className="flex-1 md:hidden p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="heading-display text-lg font-bold">Admin</h2>
          <Link to="/" className="text-sm text-primary">← Store</Link>
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${pathname === l.to ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <l.icon className="w-3 h-3" /> {l.label}
            </Link>
          ))}
        </div>
      </div>
      <main className="flex-1 p-6 md:p-8 overflow-auto">{children}</main>
    </div>
  );
}
