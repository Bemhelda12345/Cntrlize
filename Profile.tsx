"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ref, onValue, set } from "firebase/database";
import { database } from "@/lib/firebase";

export default function Profile() {
  const [profile, setProfile] = useState({
    adminId: "110A",
    name: "",
    address: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  useEffect(() => {
    const profileRef = ref(database, "companyProfile/");
    const unsubscribe = onValue(
      profileRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setProfile({
            adminId: data.adminId || "110A",
            name: data.name || "",
            address: data.address || "",
            email: data.email || "",
          });
          setEditedProfile({
            adminId: data.adminId || "110A",
            name: data.name || "",
            address: data.address || "",
            email: data.email || "",
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.id]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      const profileRef = ref(database, "companyProfile/");
      await set(profileRef, editedProfile);
      setProfile(editedProfile);
      setEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) {
    return (
      <div>Loading profile...</div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white bg-blue-600 rounded-t-lg p-3">Company Profile</h2>
        <Button onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit"}</Button>
      </div>
      <div className="space-y-4 p-4 border border-gray-200 rounded-b-lg bg-white">
        <div>
          <Label>Admin Id:</Label>
          <div className="mt-1">{profile.adminId}</div>
        </div>
        <div>
          <Label htmlFor="name">Name:</Label>
          {editing ? (
            <Input id="name" value={editedProfile.name} onChange={handleChange} />
          ) : (
            <div className="mt-1 text-blue-600 cursor-pointer">{profile.name || "Company Name"}</div>
          )}
        </div>
        <div>
          <Label htmlFor="address">Address:</Label>
          {editing ? (
            <Input id="address" value={editedProfile.address} onChange={handleChange} />
          ) : (
            <div className="mt-1">{profile.address || "Address not set"}</div>
          )}
        </div>
        <div>
          <Label htmlFor="email">Email:</Label>
          {editing ? (
            <Input id="email" value={editedProfile.email} onChange={handleChange} />
          ) : (
            <div className="mt-1 text-blue-600 cursor-pointer">{profile.email || "Email not set"}</div>
          )}
        </div>
        {editing && (
          <div className="pt-4">
            <Button onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>
    </div>
  );
}
