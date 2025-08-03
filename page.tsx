"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import ReportsTable from "@/components/ReportsTable";
import CompanyBranch from "@/components/CompanyBranch";
import DashboardStats from "@/components/DashboardStats";
import DashboardNotifications from "@/components/DashboardNotifications";
import Profile from "@/components/Profile";
import ManageUser from "@/components/ManageUser";

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [isClient, setIsClient] = useState(false);
  const [deviceData, setDeviceData] = useState<any[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(true);
  const [errorDevices, setErrorDevices] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch device data from Firebase for reports page
  useEffect(() => {
    if (currentPage === "reports" && isClient) {
      setLoadingDevices(true);
      setErrorDevices(null);
      
      const devicesRef = ref(database, "devices/");
      const unsubscribe = onValue(
        devicesRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            // Convert object to an array of devices
            const devicesArray = Object.keys(data).map((key) => ({
              id: key,
              ...data[key],
            }));
            setDeviceData(devicesArray);
          } else {
            setDeviceData([]);
          }
          setLoadingDevices(false);
        },
        (error) => {
          setErrorDevices(error.message);
          setLoadingDevices(false);
        }
      );
      
      return () => unsubscribe();
    }
  }, [currentPage, isClient]);

  if (!isClient) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
                ⚡
              </div>
              <span className="font-bold text-lg text-gray-900">NEABILLING</span>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent, page: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setCurrentPage(page);
    }
  };

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠" },
    { id: "reports", label: "Meter Monitoring", icon: "📊" },
    { id: "manage-user", label: "Manage User", icon: "👥" },
    { id: "generate-bill", label: "Generate Bill", icon: "📄" },
    { id: "profile", label: "Profile", icon: "👤" },
  ];

  const renderDashboardPage = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Main Dashboard</h1>
      </div>
      
      {/* Company Branch Section */}
      <CompanyBranch />

      {/* Charts Section - Now using Firebase data */}
      <DashboardStats />

      {/* Notifications Section - Now using Firebase data */}
      <DashboardNotifications />
    </div>
  );

  const renderReportsPage = () => {
    return <ReportsTable devices={deviceData} loading={loadingDevices} error={errorDevices} />;
  };

  const renderGenerateBillPage = () => (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-500 mb-2">Pages / Generate Bill</div>
        <h1 className="text-2xl font-semibold text-gray-900">Generate Bill</h1>
        <div className="text-sm text-blue-600 mt-1">Lalitpur Branch</div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Calculate Bill</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Enter customer name" className="mt-1" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="due-date">Due Date</Label>
              <Input id="due-date" type="date" className="mt-1" />
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount Due</Label>
            <Input id="amount" placeholder="Electric Bill" className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="gmail">Gmail</Label>
            <Input id="gmail" type="email" placeholder="Enter email address" className="mt-1" />
          </div>
          
          <div className="flex gap-3 pt-4 flex-wrap">
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              aria-label="Calculate bill amount"
            >
              Calculate
            </Button>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              aria-label="Send bill to customer"
            >
              Send Bill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderProfilePage = () => (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-500 mb-2">Pages / Profile</div>
        <h1 className="text-2xl font-semibold text-gray-900">Profile</h1>
      </div>
      
      <Card>
        <CardHeader className="bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-lg">Company Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <Profile />
        </CardContent>
      </Card>
    </div>
  );

  const renderManageUserPage = () => (
    <ManageUser />
  );

  const renderContent = () => {
    switch (currentPage) {
      case "dashboard":
        return renderDashboardPage();
      case "reports":
        return renderReportsPage();
      case "manage-user":
        return renderManageUserPage();
      case "generate-bill":
        return renderGenerateBillPage();
      case "profile":
        return renderProfilePage();
      default:
        return renderDashboardPage();
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              ⚡
            </div>
            <span className="font-bold text-lg text-gray-900">ElectriTrack</span>
          </div>
          
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                aria-label={`Navigate to ${item.label}`}
                aria-current={currentPage === item.id ? "page" : undefined}
                tabIndex={0}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  currentPage === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                }`}
              >
                <span className="text-lg" aria-hidden="true">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="absolute bottom-6 left-6">
          <Button className="w-32 bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
