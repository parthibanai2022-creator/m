import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

interface Tier {
  id: string;
  tier_number: number;
  min_weight_kg: number;
  max_weight_kg: number;
  created_at: string;
  updated_at: string;
}

export default function TiersTab() {
  const queryClient = useQueryClient();
  const [showDialog, setShowDialog] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [formData, setFormData] = useState({
    tier_number: '',
    min_weight_kg: '',
    max_weight_kg: '',
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

  const saveTierMutation = useMutation({
    mutationFn: async () => {
      if (!formData.tier_number || !formData.min_weight_kg || !formData.max_weight_kg) {
        throw new Error('Please fill in all required fields');
      }

      const tierNumber = parseInt(formData.tier_number);
      const minWeight = parseFloat(formData.min_weight_kg);
      const maxWeight = parseFloat(formData.max_weight_kg);

      if (tierNumber < 1 || tierNumber > 4) {
        throw new Error('Tier number must be between 1 and 4');
      }

      if (minWeight <= 0 || maxWeight <= 0) {
        throw new Error('Weights must be positive numbers');
      }

      if (minWeight >= maxWeight) {
        throw new Error('Minimum weight must be less than maximum weight');
      }

      if (!editingTier && tiers && tiers.length >= 4) {
        throw new Error('Maximum of 4 tiers allowed');
      }

      if (editingTier) {
        const { error } = await supabase.from('tiers').update({
          tier_number: tierNumber,
          min_weight_kg: minWeight,
          max_weight_kg: maxWeight,
          updated_at: new Date().toISOString(),
        }).eq('id', editingTier.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tiers').insert({
          tier_number: tierNumber,
          min_weight_kg: minWeight,
          max_weight_kg: maxWeight,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editingTier ? 'Tier updated successfully' : 'Tier added successfully');
      setShowDialog(false);
      setEditingTier(null);
      setFormData({ tier_number: '', min_weight_kg: '', max_weight_kg: '' });
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to save tier');
    },
  });

  const deleteTierMutation = useMutation({
    mutationFn: async (tierId: string) => {
      const { error } = await supabase.from('tiers').delete().eq('id', tierId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Tier deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['tiers'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete tier');
    },
  });

  const handleEdit = (tier: Tier) => {
    setEditingTier(tier);
    setFormData({
      tier_number: tier.tier_number.toString(),
      min_weight_kg: tier.min_weight_kg.toString(),
      max_weight_kg: tier.max_weight_kg.toString(),
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    if (tiers && tiers.length >= 4) {
      toast.error('Maximum of 4 tiers allowed');
      return;
    }
    setEditingTier(null);
    setFormData({ tier_number: '', min_weight_kg: '', max_weight_kg: '' });
    setShowDialog(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Tiers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {tiers?.length || 0} of 4 tiers created
          </p>
        </div>
        <Button onClick={handleAdd} disabled={tiers && tiers.length >= 4}>
          Add Tier
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {tiers?.map((tier) => (
          <Card key={tier.id}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Tier {tier.tier_number}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Weight Range</p>
                <p className="font-medium">
                  {tier.min_weight_kg} - {tier.max_weight_kg} kg
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(tier)}
                  className="flex-1"
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this tier? This will also delete all design models associated with it.')) {
                      deleteTierMutation.mutate(tier.id);
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTier ? 'Edit Tier' : 'Add New Tier'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label>Tier Number (1-4) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={formData.tier_number}
                onChange={(e) => setFormData({ ...formData, tier_number: e.target.value })}
                placeholder="1"
                required
              />
            </div>

            <div>
              <Label>Minimum Weight (kg) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.min_weight_kg}
                onChange={(e) => setFormData({ ...formData, min_weight_kg: e.target.value })}
                placeholder="0.5"
                required
              />
            </div>

            <div>
              <Label>Maximum Weight (kg) <span className="text-destructive">*</span></Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.max_weight_kg}
                onChange={(e) => setFormData({ ...formData, max_weight_kg: e.target.value })}
                placeholder="2.0"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={saveTierMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={() => saveTierMutation.mutate()}
              disabled={saveTierMutation.isPending}
            >
              {saveTierMutation.isPending ? 'Saving...' : (editingTier ? 'Update' : 'Add Tier')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
