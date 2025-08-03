"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ref, onValue } from "firebase/database";
import { database } from "@/lib/firebase";

interface Device {
  id?: string;
  Name?: string;
  Address?: string;
  tampering?: string;
  OUTAGE?: string;
}

export default function DashboardNotifications() {
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

  // Get recent tampering and outage alerts
  const tamperingAlerts = deviceData.filter(device => 
    device.tampering && device.tampering.toString().trim() === "true:"
  );
  
  const outageAlerts = deviceData.filter(device => 
    device.OUTAGE && device.OUTAGE.toString().trim() === "true:"
  );

  if (loading) {
    return (
      <Card className="shadow-lg border-0 bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="animate-pulse">
            <div className="h-16 bg-gray-200 rounded-xl mb-4"></div>
            <div className="h-16 bg-gray-200 rounded-xl"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-semibold text-gray-800">Notifications</CardTitle>
        <Button 
          variant="link" 
          className="text-blue-600 text-sm font-medium hover:text-blue-700"
          aria-label="See all notifications"
        >
          See all
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {tamperingAlerts.length === 0 && outageAlerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active alerts
          </div>
        ) : (
          <>
            {tamperingAlerts.slice(0, 2).map((device, index) => (
              <div key={`tampering-${device.id}-${index}`} className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">!</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Tampering Detected</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Meter ID: {device.id || "Unknown"} - {device.Address || "Unknown Location"}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-medium">Active</div>
              </div>
            ))}
            
            {outageAlerts.slice(0, 2).map((device, index) => (
              <div key={`outage-${device.id}-${index}`} className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold" aria-hidden="true">⚠</div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Outage Detected</div>
                  <div className="text-sm text-gray-600 mt-1">
                    Location: {device.Address || "Unknown Location"}
                  </div>
                </div>
                <div className="text-xs text-gray-400 font-medium">Active</div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
