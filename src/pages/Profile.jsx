
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  UserCircle, 
  Phone, 
  Building, 
  CreditCard, 
  Smartphone, 
  Calendar, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

const MOCK_USER = {
  id: "demo-user",
  full_name: "Demo User",
  email: "demo.user@gov.il", // Added email for the mock user
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
  created_date: "2022-01-01T00:00:00Z", // Added created_date for the mock user
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const demo = localStorage.getItem('isDemoMode') === 'true';
    setIsDemoMode(demo);
    loadUserProfile(demo);
  }, []);

  const loadUserProfile = async (demoMode) => {
    setLoading(true);
    try {
      if (demoMode) {
        setUser(MOCK_USER);
      } else {
        const currentUser = await User.me();
        
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
        } else {
          setUser(currentUser);
        }
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (isDemoMode) {
        setSuccess("Profile updated in demo mode!");
        setError(""); // Clear any previous errors
        return;
    }
    setUpdating(true);
    setError("");
    setSuccess("");

    try {
      await User.updateMyUserData({
        full_name: user.full_name,
        phone_number: user.phone_number,
        department: user.department,
        job_title: user.job_title
      });
      setSuccess("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleInputChange = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      basic: "bg-gray-100 text-gray-800",
      standard: "bg-blue-100 text-blue-800",
      premium: "bg-purple-100 text-purple-800",
      executive: "bg-gold-100 text-gold-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getUpgradeEligibilityColor = (eligible) => {
    return eligible 
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your account information and device entitlements</p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <img
                  src={`https://picsum.photos/seed/profile${user?.id || 'default'}/80/80`}
                  alt="Profile Avatar"
                  className="w-14 h-14 rounded-full border border-slate-200 object-cover"
                  onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/profiledefault/80/80`; }}
                />
                <CardTitle className="flex items-center space-x-2">
                  <UserCircle className="w-5 h-5" />
                  <span>Personal Information</span>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={user?.full_name || ""}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      value={user?.email || "demo.user@gov.il"}
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="phone_number">Phone Number</Label>
                    <Input
                      id="phone_number"
                      type="tel"
                      value={user?.phone_number || ""}
                      onChange={(e) => handleInputChange('phone_number', e.target.value)}
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input
                      id="employee_id"
                      value={user?.employee_id || ""}
                      disabled
                      className="bg-slate-50"
                    />
                    <p className="text-xs text-slate-500 mt-1">Employee ID cannot be changed</p>
                  </div>
                  <div>
                    <Label htmlFor="department">Office / Department</Label>
                    <Input
                      id="department"
                      value={user?.department || ""}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      disabled={updating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_title">Role / Job Title</Label>
                    <Input
                      id="job_title"
                      value={user?.job_title || ""}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                      disabled={updating}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={updating}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {updating ? "Updating..." : "Update Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Status */}
        <div className="space-y-6">
          {/* Role & Entitlements */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Account Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Role Level:</span>
                <Badge className={getRoleBadgeColor(user?.role_level)}>
                  {user?.role_level || "standard"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Upgrade Eligible:</span>
                <Badge className={getUpgradeEligibilityColor(user?.upgrade_eligible)}>
                  {user?.upgrade_eligible ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Account Created:</span>
                <span className="font-medium">
                  {user?.created_date ? format(new Date(user.created_date), "MMM d, yyyy") : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Budget Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5" />
                <span>Budget Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Monthly Allowance:</span>
                <span className="font-medium">₪{user?.budget_allowance || 2000}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Remaining Budget:</span>
                <span className="font-medium text-blue-600">₪{user?.remaining_budget || 1500}</span>
              </div>
              
              {/* Budget Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-slate-600 mb-1">
                  <span>Budget Used</span>
                  <span>
                    {user?.budget_allowance && user?.remaining_budget 
                      ? `${Math.round(((user.budget_allowance - user.remaining_budget) / user.budget_allowance) * 100)}%`
                      : "25%"
                    }
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: user?.budget_allowance && user?.remaining_budget 
                        ? `${((user.budget_allowance - user.remaining_budget) / user.budget_allowance) * 100}%`
                        : "25%"
                    }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Device */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Smartphone className="w-5 h-5" />
                <span>Current Device</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Device Model:</span>
                <span className="font-medium">{user?.current_device || "iPhone 13"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Assigned Date:</span>
                <span className="font-medium">
                  {user?.device_assigned_date 
                    ? format(new Date(user.device_assigned_date), "MMM d, yyyy")
                    : "Jan 15, 2023"
                  }
                </span>
              </div>
              {(user?.upgrade_eligible !== false) && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-800">You're eligible for an upgrade!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
