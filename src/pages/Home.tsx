import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Shield, Truck, Award, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

export default function Home() {
  const { data: featuredProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured_in_offers', true)
        .eq('is_active', true)
        .limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: recentReviews } = useQuery({
    queryKey: ['recent-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data;
    },
  });

  const { data: nonFeaturedProducts } = useQuery({
    queryKey: ['non-featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured_in_offers', false)
        .eq('is_active', true)
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 md:py-40 min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-cream-50 to-pink-100">
        {/* Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-20"></div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/60 via-cream-50/80 to-pink-50/60"></div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent drop-shadow-lg">
              The Cake Land
            </h1>
            <p className="text-2xl md:text-3xl text-gray-800 mb-10 drop-shadow-sm font-medium">
              Delicious, soft cakes with exceptional quality and taste. Creating sweet memories since 2019.
            </p>
            <Link to="/products">
              <Button size="lg" className="text-xl px-10 py-7 shadow-2xl bg-pink-400 hover:bg-pink-500">
                <ShoppingBag className="mr-2 h-6 w-6" />
                Order Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Premium Quality</h3>
              <p className="text-muted-foreground">Delicious, soft cakes with perfect taste</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Custom Cakes</h3>
              <p className="text-muted-foreground">Personalized designs for special occasions</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Fresh Daily</h3>
              <p className="text-muted-foreground">Baked fresh every day with care</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Great Service</h3>
              <p className="text-muted-foreground">Fast response and excellent support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Featured Treats</h2>
            <p className="text-muted-foreground text-center mb-8">Our most popular cakes and pastries</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customize Your Cake Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-pink-100 flex items-center justify-center">
                <img src="/cake-icon.svg" alt="Cake" className="w-12 h-12" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Create Your Dream Cake</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Design a personalized cake that's uniquely yours. Choose your favorite flavour, select the perfect size, pick a stunning design, and add delicious toppings.
              </p>
            </div>
            <Link to="/customize-cake">
              <Button size="lg" className="text-lg px-10 py-7 bg-pink-400 hover:bg-pink-500 shadow-lg">
                <Award className="mr-2 h-6 w-6" />
                Customize Your Cake
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Products - horizontal scroll (1 mobile, 3 desktop) */}
      {nonFeaturedProducts && nonFeaturedProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">Our Menu</h2>
            <p className="text-muted-foreground text-center mb-8">Discover our delightful cake varieties</p>
            <div className="overflow-x-auto">
              <div className="flex gap-6 pr-4">
                {nonFeaturedProducts.map((product) => (
                  <div key={product.id} className="basis-full lg:basis-1/3 shrink-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}



      {/* Customer Reviews Section */}
      {recentReviews && recentReviews.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">What Our Customers Say</h2>
            <p className="text-muted-foreground text-center mb-8">Real experiences from real customers</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {recentReviews.map((review: any) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-4">{review.comment}</p>
                    <p className="font-semibold">{review.profiles?.full_name || 'Anonymous'}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for Something Sweet?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse our delicious collection of cakes and pastries, perfect for every celebration.
          </p>
          <Link to="/products">
            <Button size="lg" variant="default" className="text-lg px-8 py-6 bg-pink-400 hover:bg-pink-500">
              View Our Menu
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
