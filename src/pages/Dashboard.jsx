
import React, { useState, useEffect } from "react";
import { User, Device, Order } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smartphone, ShoppingCart, Clock, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

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

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [devices, setDevices] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadDashboardData(demo);
  }, []);

  const loadDashboardData = async (demoMode) => {
    setLoading(true);
    try {
      if (demoMode) {
        setUser(MOCK_USER);
        // Assuming Device.list() and Order.list() exist for demo data.
        // In a real app, you might mock these or fetch specific demo sets.
        const allDevices = await Device.list();
        setDevices(allDevices.slice(0, 3));
        const allOrders = await Order.list();
        setRecentOrders(allOrders.slice(0, 2));
      } else {
        const currentUser = await User.me();
        setUser(currentUser);

        // Set default user data if new user
        if (!currentUser.phone_number) {
          await User.updateMyUserData({
            phone_number: "050-123-4567",
            employee_id: "EMP001",
            department: "Ministry of Finance",
            job_title: "Financial Analyst",
            role_level: "standard",
            current_device: "iPhone 13",
            device_assigned_date: "2023-01-15",
            upgrade_eligible: true,
            budget_allowance: 2000,
            remaining_budget: 1500
          });
          
          // Reload user data
          const updatedUser = await User.me();
          setUser(updatedUser);
        }

        const availableDevices = await Device.filter({}, "-price", 3);
        setDevices(availableDevices);

        const userOrders = await Order.filter({ user_id: currentUser.id }, "-created_date", 3);
        setRecentOrders(userOrders);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
      processing: Clock,
      shipped: ArrowRight,
      delivered: CheckCircle,
      cancelled: AlertCircle
    };
    const IconComponent = icons[status] || Clock;
    return <IconComponent className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">שלום, {user?.full_name || "Government Employee"}</h1>
            <p className="text-blue-100 mb-6">Welcome to your government mobile service dashboard</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5" />
                  <span className="text-sm">Current Device</span>
                </div>
                <p className="text-lg font-semibold mt-1">{user?.current_device || "No device assigned"}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="text-sm">Role Level</span>
                </div>
                <p className="text-lg font-semibold mt-1 capitalize">{user?.role_level || "standard"}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">Budget Remaining</span>
                </div>
                <p className="text-lg font-semibold mt-1">₪{user?.remaining_budget || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">Browse Devices</h3>
                <p className="text-sm text-slate-600">Explore available devices for your role level</p>
              </div>
              <Link to={createPageUrl("Devices")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">Track Orders</h3>
                <p className="text-sm text-slate-600">Monitor your order status and delivery</p>
              </div>
              <Link to={createPageUrl("Orders")}>
                <Button variant="outline">
                  Track
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recent Orders</span>
            <Link to={createPageUrl("Orders")}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">Order #{order.order_number}</p>
                      <p className="text-sm text-slate-600">{order.order_type} • ₪{order.total_cost}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600">No recent orders</p>
              <p className="text-sm text-slate-500">Your orders will appear here once you place them</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Devices */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Recommended Devices</span>
            <Link to={createPageUrl("Devices")}>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {devices.map((device) => (
              <div key={device.id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200 flex flex-col">
                <div className="aspect-square bg-slate-100 rounded-lg mb-4 flex items-center justify-center">
                  <img src={device.image_url} alt={device.model} className="w-full h-full object-contain p-4"/>
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{device.model}</h3>
                <p className="text-sm text-slate-600 mb-4">{device.brand}</p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold text-blue-600">₪{device.price}</span>
                  <Badge variant="outline" className="text-xs">
                    {device.availability}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
