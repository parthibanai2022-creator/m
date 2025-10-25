import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Pencil, Trash2, Upload } from 'lucide-react';

interface Topping {
  id: string;
  name: string;
  price: number;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function ToppingsTab() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingTopping, setEditingTopping] = useState<Topping | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    is_available: true,
    image_url: '',
  });

  const { data: toppings } = useQuery({
    queryKey: ['toppings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('toppings')
        .select('*')
        .order('name', { ascending: true });
      if (error) throw error;
      return data as Topping[];
    },
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const maxSize = 5 * 1024 * 1024;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

      if (file.size > maxSize) {
        throw new Error('File size must be less than 5MB');
      }

      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload images');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `toppings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('customization-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('customization-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const saveToppingMutation = useMutation({
    mutationFn: async () => {
      if (!formData.name || !formData.price) {
        throw new Error('Please fill in all required fields');
      }

      const price = parseFloat(formData.price);
      if (price < 0) {
        throw new Error('Price cannot be negative');
      }

      if (editingTopping) {
        const { error } = await supabase.from('toppings').update({
          name: formData.name,
          price: price,
          is_available: formData.is_available,
          image_url: formData.image_url || null,
          updated_at: new Date().toISOString(),
        }).eq('id', editingTopping.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('toppings').insert({
          name: formData.name,
          price: price,
          is_available: formData.is_available,
          image_url: formData.image_url || null,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingTopping ? 'Topping updated successfully' : 'Topping added successfully');
      setShowDialog(false);
      setEditingTopping(null);
      setFormData({ name: '', price: '', is_available: true, image_url: '' });
      queryClient.invalidateQueries({ queryKey: ['toppings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save topping');
    },
  });

  const deleteToppingMutation = useMutation({
    mutationFn: async (toppingId: string) => {
      const { error } = await supabase.from('toppings').delete().eq('id', toppingId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Topping deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['toppings'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete topping');
    },
  });

  const handleEdit = (topping: Topping) => {
    setEditingTopping(topping);
    setFormData({
      name: topping.name,
      price: topping.price.toString(),
      is_available: topping.is_available,
      image_url: topping.image_url || '',
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingTopping(null);
    setFormData({ name: '', price: '', is_available: true, image_url: '' });
    setShowDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Toppings</h2>
        <Button onClick={handleAdd}>Add Topping</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {toppings?.map((topping) => (
          <Card key={topping.id} className={!topping.is_available ? 'opacity-60' : ''}>
            <CardContent className="p-4">
              {topping.image_url && (
                <img
                  src={topping.image_url}
                  alt={topping.name}
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <div className="space-y-2 mb-3">
                <h3 className="font-semibold">{topping.name}</h3>
                <p className="text-sm text-muted-foreground">₹{topping.price}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${topping.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-xs text-muted-foreground">
                    {topping.is_available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(topping)}
                  className="flex-1"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this topping?')) {
                      deleteToppingMutation.mutate(topping.id);
                    }
                  }}
                  className="flex-1"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTopping ? 'Edit Topping' : 'Add New Topping'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Topping Name <span className="text-destructive">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chocolate Chips, Fresh Strawberries"
                required
              />
            </div>

            <div>
              <Label>Price per Topping (₹) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="50.00"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Available</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Can be used for both normal and customized cakes
                </p>
              </div>
              <Switch
                checked={formData.is_available}
                onCheckedChange={(checked) => setFormData({ ...formData, is_available: checked })}
              />
            </div>

            <div>
              <Label>Topping Image</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                    <p className="text-sm text-primary">Uploading...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">Upload Topping Image</p>
                    <p className="text-xs text-muted-foreground">Max 5MB • JPEG, PNG, WebP, GIF</p>
                  </>
                )}
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  disabled={uploading}
                  ref={fileInputRef}
                />
                {formData.image_url && (
                  <div className="mt-3">
                    <img src={formData.image_url} alt="Preview" className="w-full h-32 object-cover rounded border" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={saveToppingMutation.isPending || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveToppingMutation.mutate()}
              disabled={saveToppingMutation.isPending || uploading}
            >
              {saveToppingMutation.isPending ? 'Saving...' : (editingTopping ? 'Update' : 'Add Topping')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
