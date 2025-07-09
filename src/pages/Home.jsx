
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, LogIn, Shield, ArrowRight, User as UserIcon } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [demoNumber, setDemoNumber] = useState('');
  const [error, setError] = useState('');

  const handleDemoLogin = (e) => {
    e.preventDefault();
    if (demoNumber === '770') {
      localStorage.setItem('isDemoMode', 'true');
      navigate(createPageUrl('Dashboard'));
    } else {
      setError('Invalid demo number. Please enter "770".');
    }
  };
  
  const handleRealLogin = async () => {
    await User.login();
  };

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599691880490-50b18a2435c2?q=80&w=1920&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-blue-900/70 backdrop-blur-sm"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-white text-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Coat_of_arms_of_Israel.svg/515px-Coat_of_arms_of_Israel.svg.png" alt="State of Israel Emblem" className="h-20 mx-auto mb-6"/>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight hebrew-font">שירות הסלולר הממשלתי</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-blue-100">The official portal for government employees to manage and order mobile devices.</p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" onClick={handleRealLogin} className="bg-white text-blue-700 hover:bg-blue-50">
              <LogIn className="mr-2 h-5 w-5" /> Official Login
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}>
              <UserIcon className="mr-2 h-5 w-5" /> View Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Demo Login Section */}
      <div id="demo-section" className="py-16 bg-slate-100">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-slate-800">Application Demo</CardTitle>
              <p className="text-slate-600 pt-2">Enter the special demo number to explore the application's features with mock data.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDemoLogin} className="space-y-4">
                <div>
                  <Label htmlFor="demo-number" className="sr-only">Demo Number</Label>
                  <Input
                    id="demo-number"
                    type="text"
                    placeholder="Enter demo number '770'"
                    value={demoNumber}
                    onChange={(e) => {
                      setDemoNumber(e.target.value);
                      setError('');
                    }}
                    className="text-center text-lg"
                  />
                  {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">
                  Enter Demo Mode <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
