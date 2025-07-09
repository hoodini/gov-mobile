
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import { Smartphone, ShoppingCart, User as UserIcon, LogOut, Menu, X, Home, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    setIsDemoMode(localStorage.getItem('isDemoMode') === 'true');
  }, [location]);

  const navigationItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "Dashboard", path: "Dashboard", icon: Smartphone },
    { name: "Devices", path: "Devices", icon: Smartphone },
    { name: "My Orders", path: "Orders", icon: ShoppingCart },
    { name: "Profile", path: "Profile", icon: UserIcon },
    { name: "Contact", path: "Contact", icon: Phone },
  ];

  const isActivePage = (path) => {
    return location.pathname === createPageUrl(path);
  };

  const handleLogout = async () => {
    localStorage.removeItem('isDemoMode');
    if (!isDemoMode) {
      await User.logout();
    }
    navigate(createPageUrl('Home'));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <style>{`
        :root {
          --primary-blue: #0038B8;
          --israel-blue: #0038B8;
          --accent-blue: #3B82F6;
          --text-dark: #1E293B;
          --text-light: #64748B;
          --border-color: #E2E8F0;
        }
        body {
          background-color: #f8fafc;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23dbeafe' fill-opacity='0.5'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
      `}</style>
      
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <img src="https://picsum.photos/seed/govmobilelogo/48/48" alt="App Logo" className="h-10 w-10 rounded-full border border-slate-200 object-cover" onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/seed/govmobilefallback/48/48'; }} />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-800">Gov Mobile</h1>
                <p className="text-sm text-slate-500">משרד הממשלה</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActivePage(item.path)
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
               <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-600">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="py-6">
                    <div className="flex items-center space-x-3 mb-8 px-4">
                      <img src="https://picsum.photos/seed/govmobilelogo/48/48" alt="App Logo" className="h-10 w-10 rounded-full border border-slate-200 object-cover" onError={e => { e.target.onerror = null; e.target.src = 'https://picsum.photos/seed/govmobilefallback/48/48'; }} />
                      <div>
                        <h1 className="text-xl font-bold text-slate-800">Gov Mobile</h1>
                        <p className="text-sm text-slate-500">משרד הממשלה</p>
                      </div>
                    </div>
                    
                    <nav className="space-y-2">
                      {navigationItems.map((item) => (
                        <Link
                          key={item.path}
                          to={createPageUrl(item.path)}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                            isActivePage(item.path)
                              ? "bg-blue-50 text-blue-700"
                              : "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                          }`}
                        >
                          <item.icon className="w-5 h-5" />
                          <span>{item.name}</span>
                        </Link>
                      ))}
                      <div className="px-4 pt-4">
                        <Button onClick={handleLogout} variant="outline" className="w-full">
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        {isDemoMode && (
          <div className="bg-yellow-100 text-yellow-800 text-center py-1 text-sm font-semibold">
            Demo Mode Active
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-sm text-slate-600">© 2024 Israeli Government Mobile Service</p>
            <p className="text-xs text-slate-500 mt-2">For government employees only • Secure system</p>
            <p className="text-xs text-slate-400 mt-4">Developed by Yuval Avidani, YUV.AI</p>
        </div>
      </footer>
    </div>
  );
}
