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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-medium text-gray-600">Admin Id:</Label>
              <div className="mt-1 text-gray-900">110A</div>
            </div>
            <div className="flex justify-end">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="sm"
                aria-label="Edit company profile"
              >
                Edit
              </Button>
            </div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Name:</Label>
            <div className="mt-1 text-blue-600 font-medium">Company Name</div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Address:</Label>
            <div className="mt-1 text-gray-900">Khumaltar, Lalitpur</div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Email:</Label>
            <div className="mt-1 text-blue-600">Adela98@gmail.com</div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Password:</Label>
            <div className="mt-1 text-gray-900">*******</div>
          </div>
          
          <div>
            <Label className="text-sm font-medium text-gray-600">Eprice:</Label>
            <div className="mt-1 text-blue-600 cursor-pointer hover:underline">
              Click to change electric kwh price
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderManageUserPage = () => (
    <div className="space-y-6">
      <div>
        <div className="text-sm text-gray-500 mb-2">Pages / Manage User</div>
        <h1 className="text-2xl font-semibold text-gray-900">Manage User</h1>
      </div>
      
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">Create User</Button>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Input 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 w-full sm:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Adela Parkson</TableCell>
                <TableCell>Adela98@gmail.com</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Edit user Adela Parkson">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Delete user Adela Parkson">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">John Doe</TableCell>
                <TableCell>john.doe@example.com</TableCell>
                <TableCell>User</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Edit user John Doe">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Delete user John Doe">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Jane Smith</TableCell>
                <TableCell>jane.smith@example.com</TableCell>
                <TableCell>User</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Inactive
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Edit user Jane Smith">
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs" aria-label="Delete user Jane Smith">
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
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
