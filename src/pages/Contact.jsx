import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Building } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Contact Us</h1>
        <p className="text-lg text-slate-600">We're here to help. Reach out to us with any questions or issues.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Building className="w-6 h-6 text-blue-600" />
                <span>Government Mobile Services HQ</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 mt-1 text-slate-500" />
                <span>Kaplan St 1, Kiryat HaMemshala, Jerusalem, 91130</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 mt-1 text-slate-500" />
                <span>(02) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 mt-1 text-slate-500" />
                <span>support@gov-mobile.gov.il</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Sunday - Thursday: 8:00 AM - 5:00 PM</p>
                <p>Friday: 8:00 AM - 12:00 PM</p>
                <p>Saturday: Closed</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <div>
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your Name" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your.email@gov.il" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Order Inquiry" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Type your message here..." rows={6} />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}