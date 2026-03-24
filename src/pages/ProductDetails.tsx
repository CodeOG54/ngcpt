import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, ShoppingBag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Layout from '@/components/Layout';

interface Product {
  id: string; name: string; slug: string; price: number; description: string | null;
  image_url: string | null; images: string[]; stock: number; category_id: string | null; is_new: boolean;
}

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<{ id: string; name: string; price: number; image_url: string | null; slug: string; is_new: boolean }[]>([]);
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { data } = await supabase.from('products').select('*').eq('slug', slug).maybeSingle();
      setProduct(data);
      if (data?.category_id) {
        const { data: rel } = await supabase.from('products').select('id, name, price, image_url, slug, is_new')
          .eq('category_id', data.category_id).neq('id', data.id).limit(4);
        setRelated(rel || []);
      }
      setLoading(false);
      setQty(1);
      setSelectedImage(0);
    };
    fetch();
  }, [slug]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="grid md:grid-cols-2 gap-12 animate-pulse">
            <div className="aspect-square rounded-xl bg-secondary" />
            <div><div className="h-8 bg-secondary rounded w-3/4 mb-4" /><div className="h-6 bg-secondary rounded w-1/4 mb-6" /><div className="h-20 bg-secondary rounded" /></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return <Layout><div className="container mx-auto px-4 py-20 text-center"><h2 className="text-2xl font-semibold">Product not found</h2></div></Layout>;
  }

  const allImages = [product.image_url, ...(product.images || [])].filter(Boolean) as string[];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
              {allImages[selectedImage] ? (
                <img src={allImages[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-2 mt-3">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === selectedImage ? 'border-primary' : 'border-transparent'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            {product.is_new && <span className="text-xs font-medium text-primary tracking-wider uppercase">New Arrival</span>}
            <h1 className="heading-display text-3xl md:text-4xl font-bold mt-1">{product.name}</h1>
            <p className="text-2xl font-semibold text-primary mt-3">R{product.price.toFixed(2)}</p>
            {product.description && <p className="text-muted-foreground mt-4 leading-relaxed">{product.description}</p>}
            <p className="text-sm text-muted-foreground mt-4">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border rounded-full">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-secondary rounded-l-full transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="px-4 font-medium text-sm">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2.5 hover:bg-secondary rounded-r-full transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <Button onClick={() => addToCart(product.id, qty)} disabled={product.stock < 1} size="lg" className="rounded-full flex-1">
                <ShoppingBag className="w-4 h-4 mr-2" /> Add to Cart
              </Button>
            </div>
          </div>
        </motion.div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="heading-display text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(p => <ProductCard key={p.id} {...p} onAddToCart={() => addToCart(p.id)} />)}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
