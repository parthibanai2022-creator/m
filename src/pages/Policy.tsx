import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Truck, FileText, RotateCcw, Shield } from 'lucide-react';

export default function Policy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Policies & Information</h1>
          
          {/* Contact Us */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Get in Touch</h3>
                  <p className="text-muted-foreground mb-4">
                    Have questions or need assistance? We're here to help you with all your cake needs.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      <span>info@thecakeland.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>Open until 10:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>
                        No 50, NSK Towers, Near Indian Oil Petrol Bunk, Arakkonam Road, Tirutani Hills - 631209
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Services</h3>
                  <div className="space-y-1 text-sm">
                    <p>Delivery Available</p>
                    <p>Take Away Available</p>
                    <p>Shop in Store</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Company Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Business Type:</span>
                <span className="font-medium">Cake & Pastry Shop</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Established:</span>
                <span className="font-medium">2019</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="font-medium">Tirutani Hills</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating:</span>
                <span className="font-medium">4.8/5 (49 reviews)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Specialties:</span>
                <span className="font-medium">Custom Cakes, Pastries</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Shipping Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Delivery Areas</h3>
                <p className="text-muted-foreground">
                  We deliver fresh cakes and pastries across Tirutani Hills and surrounding areas.
                  Same-day delivery available for orders placed before 2:00 PM.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Delivery Charges</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Free delivery on orders above ₹800</li>
                  <li>Standard delivery: ₹50 for orders below ₹800</li>
                  <li>Same-day delivery: ₹100 (orders before 2 PM)</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Packaging</h3>
                <p className="text-muted-foreground">
                  All cakes and pastries are carefully packaged in premium boxes to maintain freshness.
                  We ensure safe delivery with special care for custom decorated cakes.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Acceptance of Terms</h3>
                <p className="text-muted-foreground">
                  By accessing and using The Cake Land's services, you accept and agree to be bound by the terms
                  and provisions of this agreement.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="text-muted-foreground">
                  We strive to provide accurate product descriptions and images. However, 
                  we do not warrant that product descriptions or other content is accurate, 
                  complete, reliable, or error-free.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <p className="text-muted-foreground">
                  All prices are subject to change without notice. We reserve the right to 
                  modify or discontinue any product at any time without prior notice.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">User Accounts</h3>
                <p className="text-muted-foreground">
                  You are responsible for maintaining the confidentiality of your account 
                  and password. You agree to accept responsibility for all activities that 
                  occur under your account.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation and Refund */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Cancellation and Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Order Cancellation</h3>
                <p className="text-muted-foreground">
                  You may cancel your order up to 2 hours before scheduled delivery time for standard cakes.
                  Custom cakes require 24-hour notice for cancellation. Contact us immediately to cancel.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Returns</h3>
                <p className="text-muted-foreground">
                  Due to the perishable nature of our products, we cannot accept returns.
                  However, we stand behind our quality and will address any quality concerns immediately.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Refunds</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Refunds will be processed within 5-7 business days</li>
                  <li>Refunds will be issued to the original payment method</li>
                  <li>Processing fees may apply for certain payment methods</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Damaged or Defective Products</h3>
                <p className="text-muted-foreground">
                  If you receive a damaged or defective product, please contact us immediately 
                  with photos. We will arrange for a replacement or full refund at no cost to you.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Policy */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Information We Collect</h3>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create 
                  an account, make a purchase, or contact us for support.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional communications (with your consent)</li>
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Information Sharing</h3>
                <p className="text-muted-foreground">
                  We do not sell, trade, or otherwise transfer your personal information to 
                  third parties without your consent, except as described in this policy.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Data Security</h3>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Your Rights</h3>
                <p className="text-muted-foreground">
                  You have the right to access, update, or delete your personal information. 
                  You may also opt out of promotional communications at any time.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
