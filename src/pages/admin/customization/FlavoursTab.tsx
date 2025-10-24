import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2, Upload } from 'lucide-react';

interface Flavour {
  id: string;
  name: string;
  image_url: string | null;
  base_price_per_kg: number;
  created_at: string;
  updated_at: string;
}

export default function FlavoursTab() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingFlavour, setEditingFlavour] = useState<Flavour | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    base_price_per_kg: '',
  });

  const { data: flavours } = useQuery({
    queryKey: ['flavours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flavours')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Flavour[];
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
      const filePath = `flavours/${fileName}`;

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

  const saveFlavourMutation = useMutation({
    mutationFn: async () => {
      if (!formData.name || !formData.base_price_per_kg) {
        throw new Error('Please fill in all required fields');
      }

      const price = parseFloat(formData.base_price_per_kg);
      if (price <= 0) {
        throw new Error('Price must be a positive number');
      }

      if (editingFlavour) {
        const { error } = await supabase.from('flavours').update({
          name: formData.name,
          image_url: formData.image_url || null,
          base_price_per_kg: price,
          updated_at: new Date().toISOString(),
        }).eq('id', editingFlavour.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('flavours').insert({
          name: formData.name,
          image_url: formData.image_url || null,
          base_price_per_kg: price,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingFlavour ? 'Flavour updated successfully' : 'Flavour added successfully');
      setShowDialog(false);
      setEditingFlavour(null);
      setFormData({ name: '', image_url: '', base_price_per_kg: '' });
      queryClient.invalidateQueries({ queryKey: ['flavours'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save flavour');
    },
  });

  const deleteFlavourMutation = useMutation({
    mutationFn: async (flavourId: string) => {
      const { error } = await supabase.from('flavours').delete().eq('id', flavourId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Flavour deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['flavours'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete flavour');
    },
  });

  const handleEdit = (flavour: Flavour) => {
    setEditingFlavour(flavour);
    setFormData({
      name: flavour.name,
      image_url: flavour.image_url || '',
      base_price_per_kg: flavour.base_price_per_kg.toString(),
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingFlavour(null);
    setFormData({ name: '', image_url: '', base_price_per_kg: '' });
    setShowDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Flavours</h2>
        <Button onClick={handleAdd}>Add Flavour</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {flavours?.map((flavour) => (
          <Card key={flavour.id}>
            <CardContent className="p-4">
              {flavour.image_url && (
                <img
                  src={flavour.image_url}
                  alt={flavour.name}
                  className="w-full h-40 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold text-lg mb-1">{flavour.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                ₹{flavour.base_price_per_kg}/kg
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(flavour)}
                  className="flex-1"
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this flavour?')) {
                      deleteFlavourMutation.mutate(flavour.id);
                    }
                  }}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
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
            <DialogTitle>{editingFlavour ? 'Edit Flavour' : 'Add New Flavour'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Flavour Name <span className="text-destructive">*</span></Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Chocolate, Vanilla, Strawberry"
                required
              />
            </div>

            <div>
              <Label>Base Price per KG (₹) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.base_price_per_kg}
                onChange={(e) => setFormData({ ...formData, base_price_per_kg: e.target.value })}
                placeholder="500.00"
                required
              />
            </div>

            <div>
              <Label>Flavour Image</Label>
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
                    <p className="text-sm text-muted-foreground mb-1">Upload Flavour Image</p>
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
              disabled={saveFlavourMutation.isPending || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveFlavourMutation.mutate()}
              disabled={saveFlavourMutation.isPending || uploading}
            >
              {saveFlavourMutation.isPending ? 'Saving...' : (editingFlavour ? 'Update' : 'Add Flavour')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
