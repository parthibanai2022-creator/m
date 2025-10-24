import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Upload } from 'lucide-react';

interface DesignModel {
  id: string;
  model_number: string;
  model_name: string;
  image_url: string | null;
  price: number;
  tier_id: string;
  created_at: string;
  updated_at: string;
  tiers?: {
    tier_number: number;
    min_weight_kg: number;
    max_weight_kg: number;
  };
}

interface Tier {
  id: string;
  tier_number: number;
  min_weight_kg: number;
  max_weight_kg: number;
}

export default function DesignModelsTab() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingModel, setEditingModel] = useState<DesignModel | null>(null);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    model_number: '',
    model_name: '',
    image_url: '',
    price: '',
    tier_id: '',
  });

  const { data: designModels } = useQuery({
    queryKey: ['design-models'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('design_models')
        .select(`
          *,
          tiers (
            tier_number,
            min_weight_kg,
            max_weight_kg
          )
        `)
        .order('model_number', { ascending: true });
      if (error) throw error;
      return data as DesignModel[];
    },
  });

  const { data: tiers } = useQuery({
    queryKey: ['tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tiers')
        .select('*')
        .order('tier_number', { ascending: true });
      if (error) throw error;
      return data as Tier[];
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
      const filePath = `design-models/${fileName}`;

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

  const saveModelMutation = useMutation({
    mutationFn: async () => {
      if (!formData.model_number || !formData.model_name || !formData.price || !formData.tier_id) {
        throw new Error('Please fill in all required fields');
      }

      const price = parseFloat(formData.price);
      if (price <= 0) {
        throw new Error('Price must be a positive number');
      }

      if (editingModel) {
        const { error } = await supabase.from('design_models').update({
          model_number: formData.model_number,
          model_name: formData.model_name,
          image_url: formData.image_url || null,
          price: price,
          tier_id: formData.tier_id,
          updated_at: new Date().toISOString(),
        }).eq('id', editingModel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('design_models').insert({
          model_number: formData.model_number,
          model_name: formData.model_name,
          image_url: formData.image_url || null,
          price: price,
          tier_id: formData.tier_id,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingModel ? 'Design model updated successfully' : 'Design model added successfully');
      setShowDialog(false);
      setEditingModel(null);
      setFormData({ model_number: '', model_name: '', image_url: '', price: '', tier_id: '' });
      queryClient.invalidateQueries({ queryKey: ['design-models'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save design model');
    },
  });

  const deleteModelMutation = useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase.from('design_models').delete().eq('id', modelId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Design model deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['design-models'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete design model');
    },
  });

  const handleEdit = (model: DesignModel) => {
    setEditingModel(model);
    setFormData({
      model_number: model.model_number,
      model_name: model.model_name,
      image_url: model.image_url || '',
      price: model.price.toString(),
      tier_id: model.tier_id,
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    if (!tiers || tiers.length === 0) {
      toast.error('Please create at least one tier first');
      return;
    }
    setEditingModel(null);
    setFormData({ model_number: '', model_name: '', image_url: '', price: '', tier_id: '' });
    setShowDialog(true);
  };

  const groupedModels = designModels?.reduce((acc, model) => {
    const tierNum = model.tiers?.tier_number || 0;
    if (!acc[tierNum]) acc[tierNum] = [];
    acc[tierNum].push(model);
    return acc;
  }, {} as Record<number, DesignModel[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Design Models</h2>
        <Button onClick={handleAdd}>Add Design Model</Button>
      </div>

      {(!tiers || tiers.length === 0) ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No tiers available. Please create tiers first before adding design models.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {tiers?.map((tier) => (
            <div key={tier.id}>
              <h3 className="text-lg font-semibold mb-4">
                Tier {tier.tier_number} ({tier.min_weight_kg} - {tier.max_weight_kg} kg)
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {groupedModels?.[tier.tier_number]?.map((model) => (
                  <Card key={model.id}>
                    <CardContent className="p-4">
                      {model.image_url && (
                        <img
                          src={model.image_url}
                          alt={model.model_name}
                          className="w-full h-40 object-cover rounded mb-3"
                        />
                      )}
                      <div className="space-y-1 mb-3">
                        <p className="text-xs text-muted-foreground">{model.model_number}</p>
                        <h4 className="font-semibold">{model.model_name}</h4>
                        <p className="text-sm text-muted-foreground">₹{model.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(model)}
                          className="flex-1"
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this design model?')) {
                              deleteModelMutation.mutate(model.id);
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
                {(!groupedModels?.[tier.tier_number] || groupedModels[tier.tier_number].length === 0) && (
                  <Card className="border-dashed">
                    <CardContent className="p-6 text-center">
                      <p className="text-sm text-muted-foreground">No design models for this tier</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit Design Model' : 'Add New Design Model'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Model Number <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.model_number}
                  onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                  placeholder="e.g., M01, M02"
                  required
                />
              </div>
              <div>
                <Label>Select Tier <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.tier_id}
                  onValueChange={(value) => setFormData({ ...formData, tier_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiers?.map((tier) => (
                      <SelectItem key={tier.id} value={tier.id}>
                        Tier {tier.tier_number} ({tier.min_weight_kg}-{tier.max_weight_kg} kg)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Model Name <span className="text-destructive">*</span></Label>
              <Input
                value={formData.model_name}
                onChange={(e) => setFormData({ ...formData, model_name: e.target.value })}
                placeholder="e.g., Classic Round Design, Heart Shape Special"
                required
              />
            </div>

            <div>
              <Label>Price (₹) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="1500.00"
                required
              />
            </div>

            <div>
              <Label>Design Preview Image</Label>
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
                    <p className="text-sm text-muted-foreground mb-1">Upload Design Image</p>
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
                    <img src={formData.image_url} alt="Preview" className="w-full h-40 object-cover rounded border" />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={saveModelMutation.isPending || uploading}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveModelMutation.mutate()}
              disabled={saveModelMutation.isPending || uploading}
            >
              {saveModelMutation.isPending ? 'Saving...' : (editingModel ? 'Update' : 'Add Model')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
