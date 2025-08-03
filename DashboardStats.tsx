"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

interface Device {
  id?: string;
  Name?: string;
  Address?: string;
  Email?: string;
  Price?: number;
  kwh?: number;
  tampering?: string;
  OUTAGE?: string;
  status?: string;
  "Paid Status"?: boolean;
  "Contact Number"?: string;
}

export default function DashboardStats() {
  const [deviceData, setDeviceData] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const devicesRef = ref(database, "devices/");
    const unsubscribe = onValue(
      devicesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const devicesArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setDeviceData(devicesArray);
        } else {
          setDeviceData([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, []);

  // Calculate statistics from Firebase data
  const totalDevices = deviceData.length;
  const tamperedDevices = deviceData.filter(device => 
    device.tampering && device.tampering.toString().trim() === "true:"
  ).length;
  const outageDevices = deviceData.filter(device => 
    device.OUTAGE && device.OUTAGE.toString().trim() === "true:"
  ).length;

  const tamperedPercentage = totalDevices > 0 ? Math.round((tamperedDevices / totalDevices) * 100) : 0;
  const outagePercentage = totalDevices > 0 ? Math.round((outageDevices / totalDevices) * 100) : 0;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Tampered Meters */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-sm font-semibold text-gray-700">Total Tampered Meters</CardTitle>
          <div className="text-xs text-gray-400">Real-time</div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <svg width="120" height="120" viewBox="0 0 42 42" className="mb-2">
            <circle
              className="text-indigo-200"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="15.9155"
              cx="21"
              cy="21"
            />
            <circle
              className="text-indigo-600"
              strokeWidth="6"
              strokeDasharray={`${tamperedPercentage} ${100 - tamperedPercentage}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="15.9155"
              cx="21"
              cy="21"
              transform="rotate(-90 21 21)"
            />
          </svg>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-indigo-600"></div>
            <span className="text-gray-700">Tampered: {tamperedDevices}/{totalDevices}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Normal: {totalDevices - tamperedDevices}</div>
        </CardContent>
      </Card>

      {/* Outage */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-sm font-semibold text-gray-700">Outage</CardTitle>
          <div className="text-xs text-gray-400">Real-time</div>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <svg width="120" height="120" viewBox="0 0 42 42" className="mb-2">
            <circle
              className="text-sky-200"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="15.9155"
              cx="21"
              cy="21"
            />
            <circle
              className="text-sky-600"
              strokeWidth="6"
              strokeDasharray={`${outagePercentage} ${100 - outagePercentage}`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="15.9155"
              cx="21"
              cy="21"
              transform="rotate(-90 21 21)"
            />
          </svg>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-sky-600"></div>
            <span className="text-gray-700">Outages: {outageDevices}/{totalDevices}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">Normal: {totalDevices - outageDevices}</div>
        </CardContent>
      </Card>

      {/* Total Users */}
      <Card className="bg-white rounded-lg p-4 shadow-sm">
        <CardHeader className="flex items-center gap-2 p-0">
          <div className="w-6 h-6 rounded bg-indigo-700 flex items-center justify-center text-white text-sm">⚡</div>
          <CardTitle className="text-xs font-semibold text-gray-900">Total Users</CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">
          <div className="text-2xl font-bold text-gray-900">{totalDevices}</div>
        </CardContent>
      </Card>
    </div>
  );
}
