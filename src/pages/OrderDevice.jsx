
import React, { useState, useEffect } from "react";
import { Device, User, Order } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Smartphone, 
  ShoppingCart, 
  CheckCircle, 
  AlertCircle, 
  CreditCard,
  MapPin,
  FileText
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

export default function OrderDevice() {
  const [device, setDevice] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [orderData, setOrderData] = useState({
    orderType: "new",
    justification: "",
    shippingAddress: {
      street: "",
      city: "",
      postal_code: "",
      building: ""
    }
  });
  const [errors, setErrors] = useState({});
  const [isDemoMode, setIsDemoMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadOrderData(demo);
  }, []);

  const loadOrderData = async (demoMode) => {
    setLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const deviceId = urlParams.get('deviceId');
      
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

      // Pre-fill shipping address if user has it
      if (MOCK_USER.shipping_address) { // Using MOCK_USER for consistency in demo mode, though real user shipping_address is more common
        setOrderData(prev => ({
          ...prev,
          shippingAddress: MOCK_USER.shipping_address
        }));
      } else if (user && user.shipping_address) { // For real user
        setOrderData(prev => ({
          ...prev,
          shippingAddress: user.shipping_address
        }));
      }
    } catch (error) {
      console.error("Error loading order data:", error);
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

  const calculateTotalCost = () => {
    if (!device) return 0;
    const upgradeCost = calculateUpgradeCost();
    return device.price + upgradeCost;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!orderData.justification.trim()) {
      newErrors.justification = "Please provide a justification for this order";
    }

    if (!orderData.shippingAddress.street.trim()) {
      newErrors.street = "Street address is required";
    }

    if (!orderData.shippingAddress.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!orderData.shippingAddress.postal_code.trim()) {
      newErrors.postal_code = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setOrderData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setOrderData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setPlacing(true);
    if (isDemoMode) {
        setTimeout(() => {
            const orderNumber = `ORD-DEMO-${Date.now()}`;
            navigate(createPageUrl(`OrderSuccess?orderNumber=${orderNumber}`));
            setPlacing(false);
        }, 1500);
        return;
    }
    try {
      const orderNumber = `ORD-${Date.now()}`;
      const newOrder = {
        order_number: orderNumber,
        user_id: user.id,
        device_id: device.id,
        order_type: orderData.orderType,
        status: "pending",
        total_cost: calculateTotalCost(),
        upgrade_fee: calculateUpgradeCost(),
        justification: orderData.justification,
        shipping_address: orderData.shippingAddress,
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
      };

      await Order.create(newOrder);
      
      // Navigate to success page
      navigate(createPageUrl(`OrderSuccess?orderNumber=${orderNumber}`));
    } catch (error) {
      console.error("Error placing order:", error);
      setErrors({ submit: "Failed to place order. Please try again." });
    } finally {
      setPlacing(false);
    }
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
          <Button onClick={() => navigate(createPageUrl("Devices"))}>
            Browse Devices
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate(createPageUrl(`DeviceDetails?id=${device.id}`))}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Order Device</h1>
          <p className="text-slate-600">Complete your order for {device.model}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Type */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Order Type</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={orderData.orderType} onValueChange={(value) => handleInputChange('orderType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Device</SelectItem>
                  <SelectItem value="upgrade">Upgrade Current Device</SelectItem>
                  <SelectItem value="replacement">Replace Damaged Device</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Justification */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>Order Justification</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="justification">Please explain why you need this device:</Label>
                <Textarea
                  id="justification"
                  placeholder="Enter justification for this order..."
                  value={orderData.justification}
                  onChange={(e) => handleInputChange('justification', e.target.value)}
                  className={errors.justification ? "border-red-500" : ""}
                  rows={4}
                />
                {errors.justification && (
                  <p className="text-red-500 text-sm mt-1">{errors.justification}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Shipping Address</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    placeholder="Street address"
                    value={orderData.shippingAddress.street}
                    onChange={(e) => handleInputChange('shippingAddress.street', e.target.value)}
                    className={errors.street ? "border-red-500" : ""}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="building">Building/Office</Label>
                  <Input
                    id="building"
                    placeholder="Building or office number"
                    value={orderData.shippingAddress.building}
                    onChange={(e) => handleInputChange('shippingAddress.building', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={orderData.shippingAddress.city}
                    onChange={(e) => handleInputChange('shippingAddress.city', e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postal_code">Postal Code</Label>
                  <Input
                    id="postal_code"
                    placeholder="Postal code"
                    value={orderData.shippingAddress.postal_code}
                    onChange={(e) => handleInputChange('shippingAddress.postal_code', e.target.value)}
                    className={errors.postal_code ? "border-red-500" : ""}
                  />
                  {errors.postal_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="border-0 shadow-lg sticky top-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Order Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Device Info */}
              <div className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                  {device.image_url ? (
                    <img src={device.image_url} alt={device.model} className="w-full h-full object-contain p-2"/>
                  ) : (
                    <Smartphone className="w-8 h-8 text-slate-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800">{device.model}</h3>
                  <p className="text-sm text-slate-600">{device.brand}</p>
                  <Badge variant="outline" className="mt-1">
                    {device.availability}
                  </Badge>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Device Price:</span>
                  <span className="font-medium">₪{device.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Cost:</span>
                  <span className="font-medium">₪{device.monthly_cost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Your Budget:</span>
                  <span className="font-medium text-blue-600">₪{user?.remaining_budget || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Upgrade Fee:</span>
                  <span className="font-medium text-orange-600">₪{calculateUpgradeCost()}</span>
                </div>
                <hr className="border-slate-200" />
                <div className="flex justify-between">
                  <span className="text-slate-800 font-medium">Total Cost:</span>
                  <span className="text-xl font-bold text-blue-600">₪{calculateTotalCost()}</span>
                </div>
              </div>

              {/* Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {placing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Place Order
                  </>
                )}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Your order will be reviewed and processed within 1-2 business days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
