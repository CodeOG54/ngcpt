import { motion } from 'framer-motion';
import Layout from '@/components/Layout';

export default function About() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="heading-display text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-lg">
              NG Traders was born from a simple belief: everyone deserves access to quality products
              without breaking the bank. Based in Cape Town, we curate premium essentials for your
              home, car, and personal style.
            </p>
            <p>
              From household necessities to stylish accessories, we handpick every product in our
              collection. We believe that the things you use every day should bring you joy — and
              that's exactly what we aim to deliver.
            </p>
            <p>
              Our commitment to quality, affordability, and excellent customer service sets us apart.
              Whether you're upgrading your living space or looking for the perfect gift, NG Traders
              has something special for you.
            </p>
            <div className="bg-secondary rounded-xl p-8 mt-8">
              <h2 className="heading-display text-2xl font-bold text-foreground mb-4">Visit Us</h2>
              <p className="text-foreground">9 Fountain Road, Harmony Village</p>
              <p className="text-foreground mt-1">Cape Town, South Africa</p>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
