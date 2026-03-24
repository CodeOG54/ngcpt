import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';
import heroImage from '@/assets/hero-collage.jpg';

interface Product {
  id: string; name: string; price: number; image_url: string | null; slug: string; is_new: boolean;
}
interface Category {
  id: string; name: string; slug: string; image_url: string | null;
}

export default function Index() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      const [prodRes, catRes] = await Promise.all([
        supabase.from('products').select('id, name, price, image_url, slug, is_new').eq('is_new', true).limit(8),
        supabase.from('categories').select('*').limit(6),
      ]);
      setNewArrivals(prodRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-sm font-medium text-primary tracking-wider uppercase">Premium Essentials</span>
            <h1 className="heading-display text-4xl md:text-6xl font-bold mt-3 leading-tight">
              Elevate Your <br /><span className="text-primary">Everyday</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg max-w-md">
              Curated products for your home, car, and personal style. Quality meets affordability.
            </p>
            <div className="flex gap-3 mt-8">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link to="/shop">Shop Now <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link to="/about">Our Story</Link>
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden md:block"
          >
            <img src={heroImage} alt="Premium lifestyle products" width={1024} height={1024} className="rounded-2xl shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container mx-auto px-4 py-16">
          <h2 className="heading-display text-3xl font-bold text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Link to={`/shop?category=${cat.slug}`} className="group relative block aspect-[4/3] rounded-xl overflow-hidden bg-secondary">
                  {cat.image_url && <img src={cat.image_url} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors flex items-end p-4">
                    <h3 className="text-card font-semibold text-lg">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-10">
          <h2 className="heading-display text-3xl font-bold">New Arrivals</h2>
          <Link to="/shop?new=true" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-secondary mb-3" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {newArrivals.map(p => (
              <ProductCard key={p.id} {...p} onAddToCart={() => addToCart(p.id)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-12">No new arrivals yet. Check back soon!</p>
        )}
      </section>
    </Layout>
  );
}
