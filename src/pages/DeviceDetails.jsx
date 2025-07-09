
import React, { useState, useEffect } from "react";
import { Device, User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  ArrowLeft, 
  Smartphone, 
  CheckCircle, 
  XCircle, 
  ShoppingCart, 
  Monitor, 
  Camera, 
  Battery, 
  Cpu, 
  HardDrive,
  Star,
  AlertCircle
} from "lucide-react";

const MOCK_USER = {
  id: "demo-user",
  full_name: "Demo User",
  phone_number: "050-770-0770",
  employee_id: "DEMO-001",
  department: "Demo Department",
  job_title: "Demo Analyst",
  role_level: "premium",
  current_device: "iPhone 15",
  device_assigned_date: "2023-05-20",
  upgrade_eligible: true,
  budget_allowance: 3000,
  remaining_budget: 2500,
};

export default function DeviceDetails() {
  const [device, setDevice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadDeviceDetails(demo);
  }, []);

  const loadDeviceDetails = async (demoMode) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const deviceId = urlParams.get('id');
      
      if (!deviceId) {
        navigate(createPageUrl("Devices"));
        return;
      }

      if (demoMode) {
        setUser(MOCK_USER);
      } else {
        const currentUser = await User.me();
        setUser(currentUser);
      }

      const devices = await Device.list();
      const selectedDevice = devices.find(d => d.id === deviceId);
      
      if (!selectedDevice) {
        navigate(createPageUrl("Devices"));
        return;
      }

      setDevice(selectedDevice);
    } catch (error) {
      console.error("Error loading device details:", error);
      navigate(createPageUrl("Devices"));
    } finally {
      setLoading(false);
    }
  };

  const calculateUpgradeCost = () => {
    if (!device || !user) return 0;
    const remaining = user.remaining_budget || 0;
    return Math.max(0, device.price - remaining);
  };

  const getAvailabilityColor = (availability) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      limited: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800"
    };
    return colors[availability] || "bg-gray-100 text-gray-800";
  };

  const handleOrderDevice = () => {
    navigate(createPageUrl(`OrderDevice?deviceId=${device.id}`));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Device Not Found</h2>
          <p className="text-slate-600 mb-4">The device you're looking for doesn't exist or you don't have access to it.</p>
          <Button onClick={() => navigate(createPageUrl("Devices"))}>
            Browse Devices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl("Devices"))}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{device.model}</h1>
          <p className="text-slate-600">{device.brand}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Device Image and Quick Info */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg mb-6">
            <CardContent className="p-6">
              <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center mb-6">
                <img
                  src={device.image_url || `https://picsum.photos/seed/device${device.id}/400/400`}
                  alt={device.model}
                  className="w-full h-full object-contain p-4"
                  onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/device${device.id}/400/400`; }}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Availability:</span>
                  <Badge className={getAvailabilityColor(device.availability)}>
                    {device.availability}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Category:</span>
                  <span className="font-medium capitalize">{device.category.replace('_', ' ')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Card */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Pricing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Device Price:</span>
                <span className="text-2xl font-bold text-slate-800">₪{device.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Monthly Cost:</span>
                <span className="text-lg font-medium">₪{device.monthly_cost}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Your Budget:</span>
                <span className="text-lg font-medium text-blue-600">₪{user?.remaining_budget || 0}</span>
              </div>
              <hr className="border-slate-200" />
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Upgrade Cost:</span>
                <span className="text-xl font-bold text-blue-600">₪{calculateUpgradeCost()}</span>
              </div>
              
              {device.availability === "available" ? (
                <Button 
                  onClick={handleOrderDevice}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Order Device
                </Button>
              ) : (
                <Button disabled className="w-full">
                  Currently Unavailable
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Device Details */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specs">Specifications</TabsTrigger>
              <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Smartphone className="w-5 h-5" />
                    <span>Device Overview</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Monitor className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="text-sm text-slate-600">Screen Size</p>
                          <p className="font-medium">{device.specifications?.screen_size || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <HardDrive className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="text-sm text-slate-600">Storage</p>
                          <p className="font-medium">{device.specifications?.storage || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Camera className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-sm text-slate-600">Camera</p>
                          <p className="font-medium">{device.specifications?.camera || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Battery className="w-5 h-5 text-orange-600" />
                        <div>
                          <p className="text-sm text-slate-600">Battery</p>
                          <p className="font-medium">{device.specifications?.battery || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Cpu className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="text-sm text-slate-600">Processor</p>
                          <p className="font-medium">{device.specifications?.processor || "N/A"}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Smartphone className="w-5 h-5 text-indigo-600" />
                        <div>
                          <p className="text-sm text-slate-600">OS</p>
                          <p className="font-medium">{device.specifications?.operating_system || "N/A"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="specs">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(device.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-slate-100">
                        <span className="text-slate-600 capitalize">{key.replace('_', ' ')}</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pros-cons">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span>Pros</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {device.pros?.map((pro, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-red-700">
                      <XCircle className="w-5 h-5" />
                      <span>Cons</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {device.cons?.map((con, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {device.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Eligibility Alert */}
          {!isDemoMode && user && !device.role_eligibility.includes(user.role_level) && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This device is not available for your role level. Please contact your system administrator for more information.
              </AlertDescription>
            </Alert>
          )}
          {isDemoMode && device && !device.role_eligibility.includes(MOCK_USER.role_level) && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                (Demo Mode) This device would not be available for your role level in a live environment.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
}
