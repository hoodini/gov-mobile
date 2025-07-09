
import React, { useState, useEffect } from "react";
import { Device, User } from "@/api/entities";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Smartphone, Search, Filter, Grid, List, Star, ArrowRight } from "lucide-react";

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

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [filteredDevices, setFilteredDevices] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("price");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadDevices(demo);
  }, []);

  useEffect(() => {
    filterDevices();
  }, [devices, searchTerm, selectedBrand, selectedCategory, sortBy, user]);

  const loadDevices = async (demoMode) => {
    setLoading(true);
    try {
      if (demoMode) {
        setUser(MOCK_USER);
        const allDevices = await Device.list();
        const eligibleDevices = allDevices.filter(device => 
          device.role_eligibility.includes(MOCK_USER.role_level)
        );
        setDevices(eligibleDevices);
      } else {
        const currentUser = await User.me();
        setUser(currentUser);
        
        const allDevices = await Device.list();
        // Filter devices based on user role eligibility
        const eligibleDevices = allDevices.filter(device => 
          currentUser.role_level && device.role_eligibility.includes(currentUser.role_level)
        );
        setDevices(eligibleDevices);
      }
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterDevices = () => {
    let filtered = devices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(device =>
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter(device => device.brand === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(device => device.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "-price") return b.price - a.price;
      if (sortBy === "model") return a.model.localeCompare(b.model);
      return 0;
    });

    setFilteredDevices(filtered);
  };

  const getBrands = () => {
    const brands = [...new Set(devices.map(device => device.brand))];
    return brands.sort();
  };

  const getAvailabilityColor = (availability) => {
    const colors = {
      available: "bg-green-100 text-green-800",
      limited: "bg-yellow-100 text-yellow-800",
      out_of_stock: "bg-red-100 text-red-800"
    };
    return colors[availability] || "bg-gray-100 text-gray-800";
  };

  const calculateUpgradeCost = (devicePrice) => {
    if (!user) return 0;
    const remaining = user.remaining_budget || 0;
    return Math.max(0, devicePrice - remaining);
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Available Devices</h1>
        <p className="text-slate-600">Choose from devices eligible for your role level: <span className="font-medium capitalize">{user?.role_level}</span></p>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg mb-8">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedBrand} onValueChange={setSelectedBrand}>
              <SelectTrigger>
                <SelectValue placeholder="All Brands" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {getBrands().map(brand => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="smartphone">Smartphones</SelectItem>
                <SelectItem value="basic_phone">Basic Phones</SelectItem>
                <SelectItem value="rugged_phone">Rugged Phones</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="-price">Price: High to Low</SelectItem>
                <SelectItem value="model">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex space-x-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="text-sm text-slate-600">
            Showing {filteredDevices.length} of {devices.length} eligible devices
          </div>
        </CardContent>
      </Card>

      {/* Device Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
        {filteredDevices.map((device) => (
          <Card key={device.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
            {viewMode === "grid" ? (
              <>
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <img
                    src={device.image_url || `https://picsum.photos/seed/device${device.id}/400/400`}
                    alt={device.model}
                    className="w-full h-full object-contain p-4"
                    onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/device${device.id}/400/400`; }}
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-800">{device.model}</h3>
                      <p className="text-slate-600">{device.brand}</p>
                    </div>
                    <Badge className={getAvailabilityColor(device.availability)}>
                      {device.availability}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Device Price:</span>
                      <span className="font-medium">₪{device.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Monthly Cost:</span>
                      <span className="font-medium">₪{device.monthly_cost}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Upgrade Cost:</span>
                      <span className="font-medium text-blue-600">₪{calculateUpgradeCost(device.price)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {device.features?.slice(0, 3).map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-slate-600">
                        <Star className="w-3 h-3 mr-2 text-yellow-500" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <Link to={createPageUrl(`DeviceDetails?id=${device.id}`)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View Details
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </>
            ) : (
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <img
                      src={device.image_url || `https://picsum.photos/seed/device${device.id}/200/200`}
                      alt={device.model}
                      className="w-full h-full object-contain p-2"
                      onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/device${device.id}/200/200`; }}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-slate-800">{device.model}</h3>
                        <p className="text-slate-600">{device.brand}</p>
                      </div>
                      <Badge className={getAvailabilityColor(device.availability)}>
                        {device.availability}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                      <div>
                        <span className="text-slate-600">Price: </span>
                        <span className="font-medium">₪{device.price}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Monthly: </span>
                        <span className="font-medium">₪{device.monthly_cost}</span>
                      </div>
                      <div>
                        <span className="text-slate-600">Upgrade: </span>
                        <span className="font-medium text-blue-600">₪{calculateUpgradeCost(device.price)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4">
                        {device.features?.slice(0, 2).map((feature, idx) => (
                          <span key={idx} className="text-xs text-slate-600">{feature}</span>
                        ))}
                      </div>
                      <Link to={createPageUrl(`DeviceDetails?id=${device.id}`)}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <Smartphone className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 mb-2">No devices found</h3>
          <p className="text-slate-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}
