"use client";

import { useState } from "react";

export default function CompanyBranch() {
  const [companyName, setCompanyName] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleClick = () => {
    setDisplayName(companyName);
  };

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-sm">⚡</div>
        <div>
          <h2 className="text-lg font-semibold text-blue-600">Company Branch</h2>
          <p className="text-sm text-blue-400">Enter Company Branch to be displayed here!</p>
        </div>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={companyName}
          onChange={handleChange}
          placeholder="Enter company name"
          className="flex-1 rounded border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleClick}
          className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
        >
          Change
        </button>
      </div>
      {displayName && (
        <div className="mt-4 text-blue-600 font-semibold">
          {displayName}
        </div>
      )}
    </div>
  );
}
