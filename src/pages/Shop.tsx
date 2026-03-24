import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';

interface Product {
  id: string; name: string; price: number; image_url: string | null; slug: string; is_new: boolean; category_id: string | null;
}
interface Category { id: string; name: string; slug: string; }

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { addToCart } = useCart();

  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    supabase.from('categories').select('id, name, slug').then(({ data }) => setCategories(data || []));
  }, []);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase.from('products').select('id, name, price, image_url, slug, is_new, category_id');

      if (categoryFilter) {
        const cat = categories.find(c => c.slug === categoryFilter);
        if (cat) query = query.eq('category_id', cat.id);
      }
      if (searchParams.get('new') === 'true') query = query.eq('is_new', true);
      if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
      else if (sortBy === 'price_desc') query = query.order('price', { ascending: false });
      else query = query.order('created_at', { ascending: false });

      const { data } = await query;
      setProducts(data || []);
      setLoading(false);
    };
    if (categories.length > 0 || !categoryFilter) fetch();
  }, [categoryFilter, sortBy, searchParams, categories]);

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="heading-display text-3xl md:text-4xl font-bold mb-8">Shop</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Select value={categoryFilter} onValueChange={(v) => {
              const p = new URLSearchParams(searchParams);
              if (v === 'all') p.delete('category'); else p.set('category', v);
              setSearchParams(p);
            }}>
              <SelectTrigger className="w-[160px] rounded-full">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.slug}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(v) => {
              const p = new URLSearchParams(searchParams);
              p.set('sort', v);
              setSearchParams(p);
            }}>
              <SelectTrigger className="w-[160px] rounded-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price_asc">Price: Low → High</SelectItem>
                <SelectItem value="price_desc">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-xl bg-secondary mb-3" />
                <div className="h-4 bg-secondary rounded w-3/4 mb-2" />
                <div className="h-4 bg-secondary rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map(p => (
              <ProductCard key={p.id} {...p} onAddToCart={() => addToCart(p.id)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">No products found.</p>
        )}
      </div>
    </Layout>
  );
}
