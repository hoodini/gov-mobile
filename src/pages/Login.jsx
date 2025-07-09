// Simple login page for ERP/CRM logic
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerByName } from "@/api/erpCrm";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const customer = await getCustomerByName(name);
    if (!customer) {
      setError("User not found in CRM");
      return;
    }
    if (!customer.isEmployee) {
      setError("Access denied: Not a government employee");
      return;
    }
    localStorage.setItem("currentUser", JSON.stringify(customer));
    navigate(createPageUrl("Dashboard"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle>Government Employee Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={e => { setName(e.target.value); setError(""); }}
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
