"use client";

import React, { useState } from "react";

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

interface ReportsTableProps {
  devices: Device[];
  loading: boolean;
  error: string | null;
}

export default function ReportsTable({ devices, loading, error }: ReportsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  // Get today's date
  const today = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  // Filter by search term and status filter
  const filteredAndSearchedDevices = devices.filter(device => {
    const matchesSearch =
      searchTerm === "" ||
      device.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.Address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const tamperingText = device.tampering && device.tampering.toString().trim() === "true:" ? "Tampering Detected" : "Normal";
    const outageText = device.OUTAGE && device.OUTAGE.toString().trim() === "true:" ? "Outage Detected" : "No Outage";
    const billStatusText = device["Paid Status"] ? "Paid" : "Pending";
    
    const matchesStatus =
      statusFilter === "All Status" ||
      statusFilter === "Normal" && tamperingText === "Normal" ||
      statusFilter === "Tampering Detected" && tamperingText === "Tampering Detected" ||
      statusFilter === "No Outage" && outageText === "No Outage" ||
      statusFilter === "Outage Detected" && outageText === "Outage Detected" ||
      statusFilter === "Paid" && billStatusText === "Paid" ||
      statusFilter === "Pending" && billStatusText === "Pending";
    
    return matchesSearch && matchesStatus;
  });

  // Count total users (all devices)
  const totalUsers = devices.length;

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports - Meter Monitoring</h1>
          <div className="text-sm text-gray-500 mt-1">Total Records: {totalUsers}</div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Meter Status Report</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by meter number or location"
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-32"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>All Status</option>
              <option>Normal</option>
              <option>Tampering Detected</option>
              <option>No Outage</option>
              <option>Outage Detected</option>
              <option>Paid</option>
              <option>Pending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Meter Number</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Location</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Reading</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Tampering</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Power Outage</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Loading devices...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-red-600">
                  Error loading devices: {error}
                </td>
              </tr>
            ) : filteredAndSearchedDevices.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No devices found
                </td>
              </tr>
            ) : (
              filteredAndSearchedDevices.map((device, index) => {
                const tamperingText = device.tampering && device.tampering.toString().trim() === "true:" ? "Tampering Detected" : "Normal";
                const outageText = device.OUTAGE && device.OUTAGE.toString().trim() === "true:" ? "Outage Detected" : "No Outage";
                const statusText = device["Paid Status"] ? "Paid" : "Pending";

                return (
                  <tr key={device.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{device.id || "N/A"}</td>
                    <td className="py-3 px-4 text-gray-800">{device.Address || "N/A"}</td>
                    <td className="py-3 px-4 text-gray-800">{today}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                        {device.kwh || "0"} kWh
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {tamperingText === "Normal" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Normal</span>
                      ) : (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm">Tampering Detected</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {outageText === "No Outage" ? (
                        <span className="flex items-center text-green-600 text-sm">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          No Outage
                        </span>
                      ) : (
                        <span className="flex items-center text-red-600 text-sm">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                          Outage Detected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {statusText === "Paid" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Paid</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
