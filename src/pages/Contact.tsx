import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('contact_messages').insert(form);
    if (error) { toast.error('Failed to send message'); }
    else { toast.success('Message sent! We\'ll get back to you.'); setForm({ name: '', email: '', message: '' }); }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="heading-display text-4xl md:text-5xl font-bold mb-10 text-center">Get in Touch</h1>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-semibold text-lg mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="font-medium text-sm">Address</p><p className="text-sm text-muted-foreground">9 Fountain Road, Harmony Village</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="font-medium text-sm">Phone</p><p className="text-sm text-muted-foreground">+27 74 380 6050</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-0.5" />
                  <div><p className="font-medium text-sm">Email</p><p className="text-sm text-muted-foreground">info@ngtraders.co.za</p></div>
                </div>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="rounded-lg mt-1" /></div>
              <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required className="rounded-lg mt-1" /></div>
              <div><Label>Message</Label><Textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} required rows={5} className="rounded-lg mt-1" /></div>
              <Button type="submit" disabled={loading} className="rounded-full w-full" size="lg">{loading ? 'Sending...' : 'Send Message'}</Button>
            </form>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
