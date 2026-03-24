import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Product {
  id: string; name: string; slug: string; description: string | null; price: number;
  category_id: string | null; image_url: string | null; stock: number; is_new: boolean; featured: boolean;
}
interface Category { id: string; name: string; slug: string; }

const emptyProduct = { name: '', slug: '', description: '', price: 0, category_id: '', image_url: '', stock: 0, is_new: false, featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyProduct);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
    supabase.from('categories').select('*').then(({ data }) => setCategories(data || []));
  }, []);

  const handleSave = async () => {
    if (!form.name || !form.slug || form.price <= 0) { toast.error('Fill required fields'); return; }
    setSaving(true);

    let imageUrl = form.image_url;
    if (imageFile) {
      const ext = imageFile.name.split('.').pop();
      const path = `${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('product-images').upload(path, imageFile);
      if (error) { toast.error('Image upload failed'); setSaving(false); return; }
      const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const payload = { ...form, image_url: imageUrl || null, category_id: form.category_id || null, price: Number(form.price), stock: Number(form.stock) };

    if (editing) {
      const { error } = await supabase.from('products').update(payload).eq('id', editing);
      if (error) toast.error(error.message); else toast.success('Product updated');
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) toast.error(error.message); else toast.success('Product created');
    }

    setSaving(false);
    setDialogOpen(false);
    setEditing(null);
    setForm(emptyProduct);
    setImageFile(null);
    fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    toast.success('Product deleted');
    fetchProducts();
  };

  const openEdit = (p: Product) => {
    setEditing(p.id);
    setForm({ name: p.name, slug: p.slug, description: p.description || '', price: p.price, category_id: p.category_id || '', image_url: p.image_url || '', stock: p.stock, is_new: p.is_new, featured: p.featured });
    setDialogOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading-display text-2xl font-bold">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditing(null); setForm(emptyProduct); setImageFile(null); } }}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="w-4 h-4 mr-1" /> Add Product</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editing ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }))} className="mt-1" /></div>
              <div><Label>Slug *</Label><Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="mt-1" /></div>
              <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Price (R) *</Label><Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} className="mt-1" /></div>
                <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="mt-1" /></div>
              </div>
              <div><Label>Category</Label>
                <Select value={form.category_id} onValueChange={v => setForm(f => ({ ...f, category_id: v }))}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Product Image</Label><Input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} className="mt-1" /></div>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.is_new} onCheckedChange={v => setForm(f => ({ ...f, is_new: v }))} /> New Arrival</label>
                <label className="flex items-center gap-2 text-sm"><Switch checked={form.featured} onCheckedChange={v => setForm(f => ({ ...f, featured: v }))} /> Featured</label>
              </div>
              <Button onClick={handleSave} disabled={saving} className="w-full rounded-full">{saving ? 'Saving...' : 'Save Product'}</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-secondary rounded-lg animate-pulse" />)}</div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b bg-secondary/50">
                <th className="text-left p-3 font-medium">Product</th>
                <th className="text-left p-3 font-medium">Price</th>
                <th className="text-left p-3 font-medium">Stock</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary overflow-hidden flex-shrink-0">
                        {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                      </div>
                      <span className="font-medium truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="p-3">R{p.price.toFixed(2)}</td>
                    <td className="p-3">{p.stock}</td>
                    <td className="p-3">{p.is_new && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">New</span>}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors ml-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
