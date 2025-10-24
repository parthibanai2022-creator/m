import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Factory, Users, Award, Shield, FileCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About The Cake Land</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Premium cake and pastry shop serving Tirutani Hills since 2019
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Factory className="h-6 w-6 text-primary" />
                  Our Story
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Established in 2019, The Cake Land has been serving the Tirutani Hills community with
                  delicious, soft cakes and premium pastries. Located at NSK Towers on Arakkonam Road,
                  we've become a beloved destination for cake lovers seeking quality and taste.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  With a stellar 4.8/5 rating from 49 reviews, we pride ourselves on excellent customer service,
                  fast response times, and creating beautiful customized cakes for every special occasion.
                  Our commitment to freshness and quality has made us a trusted name in the community.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Award className="h-6 w-6 text-primary" />
                  Our Specialties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  We offer a delightful variety of cakes and pastries:
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block">Custom Cakes</strong>
                      <span className="text-muted-foreground">
                        Personalized designs for birthdays, weddings, and special celebrations. We bring your vision to life.
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block">Signature Flavors</strong>
                      <span className="text-muted-foreground">
                        Red velvet, rainbow cakes, chocolate truffle, vanilla delight, and many more delicious varieties
                      </span>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary mt-1 shrink-0" />
                    <div>
                      <strong className="block">Fresh Pastries</strong>
                      <span className="text-muted-foreground">
                        Daily-baked croissants, tarts, cookies, and other delightful treats
                      </span>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileCheck className="h-6 w-6 text-primary" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Store Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <span className="font-medium">Cake & Pastry Shop</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Established:</span>
                        <span className="font-medium">2019</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="font-medium">4.8/5 (49 reviews)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hours:</span>
                        <span className="font-medium">Open until 10:00 PM</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Services Offered</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivery:</span>
                        <span className="font-medium">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Take Away:</span>
                        <span className="font-medium">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shop in Store:</span>
                        <span className="font-medium">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Custom Orders:</span>
                        <span className="font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Users className="h-6 w-6 text-primary" />
                  Our Commitment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  At The Cake Land, we are committed to baking fresh, delicious cakes every day using
                  the finest ingredients. Our dedication to quality and taste has earned us a loyal
                  customer base and excellent reviews.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We believe in creating sweet memories for every occasion. With excellent customer service,
                  fast response times, and attention to detail, every cake that leaves our shop carries
                  our promise of deliciousness and joy.
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

