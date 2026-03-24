import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/50 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="heading-display text-lg font-semibold mb-3">NG<span className="text-primary">Traders</span></h3>
            <p className="text-sm text-muted-foreground">Premium essentials for everyday life. Quality products, delivered with care.</p>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Shop</h4>
            <div className="flex flex-col gap-2">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">All Products</Link>
              <Link to="/shop?new=true" className="text-sm text-muted-foreground hover:text-foreground transition-colors">New Arrivals</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Company</h4>
            <div className="flex flex-col gap-2">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
              <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Contact</h4>
            <p className="text-sm text-muted-foreground">9 Fountain Road, Harmony Village</p>
            <p className="text-sm text-muted-foreground mt-1">info@ngtraders.co.za</p>
          </div>
        </div>
        <div className="border-t mt-8 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} NG Traders. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
