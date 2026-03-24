import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  slug: string;
  is_new?: boolean;
  onAddToCart?: () => void;
}

export default function ProductCard({ id, name, price, image_url, slug, is_new, onAddToCart }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${slug}`} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-3">
          {image_url ? (
            <img src={image_url} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
          )}
          {is_new && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md font-medium">New</span>
          )}
          {onAddToCart && (
            <button
              onClick={(e) => { e.preventDefault(); onAddToCart(); }}
              className="absolute bottom-3 right-3 bg-card/90 backdrop-blur-sm p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-primary-foreground shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
            </button>
          )}
        </div>
        <h3 className="font-medium text-sm truncate">{name}</h3>
        <p className="text-primary font-semibold mt-0.5">R{price.toFixed(2)}</p>
      </Link>
    </motion.div>
  );
}
