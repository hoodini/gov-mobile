
import React, { useState, useEffect } from "react";
import { Order, Device, User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  Package,
  MapPin,
  Calendar,
  Receipt
} from "lucide-react";
import { format } from "date-fns";

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

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [devices, setDevices] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadOrders(demo);
  }, []);

  const loadOrders = async (demoMode) => {
    setLoading(true);
    try {
      let fetchedOrders;
      if (demoMode) {
        setUser(MOCK_USER);
        fetchedOrders = await Order.list();
      } else {
        const currentUser = await User.me();
        setUser(currentUser);
        fetchedOrders = await Order.filter({ user_id: currentUser.id }, "-created_date");
      }
      setOrders(fetchedOrders);

      // Load device details for each order
      const deviceIds = [...new Set(fetchedOrders.map(order => order.device_id))];
      const deviceList = await Device.list();
      const deviceMap = {};
      deviceList.forEach(device => {
        deviceMap[device.id] = device;
      });
      setDevices(deviceMap);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  const getStatusSteps = (status) => {
    const steps = [
      { key: "pending", label: "Order Placed", icon: Receipt },
      { key: "approved", label: "Approved", icon: CheckCircle },
      { key: "processing", label: "Processing", icon: Package },
      { key: "shipped", label: "Shipped", icon: Truck },
      { key: "delivered", label: "Delivered", icon: CheckCircle }
    ];

    const statusOrder = ["pending", "approved", "processing", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  const filteredOrders = activeTab === "all" 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Orders</h1>
        <p className="text-slate-600">Track your device orders and delivery status</p>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "bg-blue-100 text-blue-800" },
          { label: "Pending", value: orders.filter(o => o.status === "pending").length, icon: Clock, color: "bg-yellow-100 text-yellow-800" },
          { label: "In Progress", value: orders.filter(o => ["approved", "processing", "shipped"].includes(o.status)).length, icon: Package, color: "bg-purple-100 text-purple-800" },
          { label: "Delivered", value: orders.filter(o => o.status === "delivered").length, icon: CheckCircle, color: "bg-green-100 text-green-800" }
        ].map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Orders List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const device = devices[order.device_id];
                if (!device) return null;

                return (
                  <Card key={order.id} className="border-0 shadow-lg">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                            <img src={device.image_url} alt={device.model} className="w-full h-full object-contain p-2"/>
                          </div>
                          <div>
                            <CardTitle className="text-xl">{device.model}</CardTitle>
                            <p className="text-slate-600">{device.brand}</p>
                            <p className="text-sm text-slate-500">Order #{order.order_number}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-2 capitalize">{order.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Order Details */}
                        <div className="lg:col-span-2">
                          <h4 className="font-semibold text-slate-800 mb-4">Order Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                              <p className="text-sm text-slate-600">Order Type</p>
                              <p className="font-medium capitalize">{order.order_type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Total Cost</p>
                              <p className="font-medium">₪{order.total_cost}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Order Date</p>
                              <p className="font-medium">{format(new Date(order.created_date), "MMM d, yyyy")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-slate-600">Est. Delivery</p>
                              <p className="font-medium">
                                {order.estimated_delivery ? format(new Date(order.estimated_delivery), "MMM d, yyyy") : "TBD"}
                              </p>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="bg-slate-50 rounded-lg p-4">
                            <h5 className="font-medium text-slate-800 mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              Shipping Address
                            </h5>
                            <p className="text-sm text-slate-600">
                              {order.shipping_address?.street}, {order.shipping_address?.building && `${order.shipping_address.building}, `}
                              {order.shipping_address?.city} {order.shipping_address?.postal_code}
                            </p>
                          </div>
                        </div>

                        {/* Order Progress */}
                        <div>
                          <h4 className="font-semibold text-slate-800 mb-4">Order Progress</h4>
                          <div className="space-y-4">
                            {getStatusSteps(order.status).map((step, index) => (
                              <div key={step.key} className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  step.completed 
                                    ? step.current 
                                      ? "bg-blue-600 text-white" 
                                      : "bg-green-100 text-green-600"
                                    : "bg-slate-100 text-slate-400"
                                }`}>
                                  <step.icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className={`text-sm font-medium ${
                                    step.completed ? "text-slate-800" : "text-slate-500"
                                  }`}>
                                    {step.label}
                                  </p>
                                  {step.current && (
                                    <p className="text-xs text-blue-600">Current status</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {order.tracking_number && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-800">
                                <strong>Tracking Number:</strong> {order.tracking_number}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {activeTab === "all" ? "No orders found" : `No ${activeTab} orders`}
              </h3>
              <p className="text-slate-600">
                {activeTab === "all" 
                  ? "You haven't placed any orders yet" 
                  : `You don't have any ${activeTab} orders`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
