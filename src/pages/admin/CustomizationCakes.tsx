import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import FlavoursTab from './customization/FlavoursTab';
import TiersTab from './customization/TiersTab';
import DesignModelsTab from './customization/DesignModelsTab';

export default function CustomizationCakes() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('flavours');

  if (!isAdmin) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Customization Cakes</h1>
          <p className="text-muted-foreground">
            Manage flavours, tiers, and design models for customizable cakes
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="flavours">Flavours</TabsTrigger>
            <TabsTrigger value="tiers">Tiers</TabsTrigger>
            <TabsTrigger value="designs">Design Models</TabsTrigger>
          </TabsList>

          <TabsContent value="flavours" className="mt-0">
            <FlavoursTab />
          </TabsContent>

          <TabsContent value="tiers" className="mt-0">
            <TiersTab />
          </TabsContent>

          <TabsContent value="designs" className="mt-0">
            <DesignModelsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
