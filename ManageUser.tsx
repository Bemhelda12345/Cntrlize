"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ref, onValue, push, set } from "firebase/database";
import { database } from "@/lib/firebase";

interface User {
  id?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  address?: string;
  serial?: string;
  role?: string;
  status?: string;
}

export default function ManageUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    contactNumber: "",
    role: "User",
    status: "Active",
    address: "",
    serial: "",
  });

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedEmail, setEditedEmail] = useState<string>("");
  const [editedContact, setEditedContact] = useState<string>("");
  const [editedAddress, setEditedAddress] = useState<string>("");
  const [editedSerial, setEditedSerial] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.id]: e.target.value,
    });
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      alert("Name and Email are required");
      return;
    }
    try {
      const devicesRef = ref(database, "devices/");
      const newDeviceRef = push(devicesRef);
      await set(newDeviceRef, {
        Name: newUser.name,
        Email: newUser.email,
        "Contact Number": newUser.contactNumber,
        status: newUser.status,
        Address: newUser.address,
        Serial: newUser.serial,
      });
      setShowForm(false);
      setNewUser({
        name: "",
        email: "",
        contactNumber: "",
        role: "User",
        status: "Active",
        address: "",
        serial: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const handleEditClick = (user: User) => {
    setEditingUserId(user.id || null);
    setEditedName(user.name || "");
    setEditedEmail(user.email || "");
    setEditedContact(user.contactNumber || "");
    setEditedAddress(user.address || "");
    setEditedSerial(user.serial || "");
  };

  const handleSaveClick = async () => {
    if (!editingUserId) return;
    try {
      const userRef = ref(database, `devices/${editingUserId}`);
      await set(userRef, {
        Name: editedName,
        Email: editedEmail,
        "Contact Number": editedContact,
        Address: editedAddress,
        Serial: editedSerial,
        role: "User",
        status: "Active",
      });
      setEditingUserId(null);
      setEditedName("");
      setEditedEmail("");
      setEditedContact("");
      setEditedAddress("");
      setEditedSerial("");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleCancelClick = () => {
    setEditingUserId(null);
    setEditedName("");
    setEditedEmail("");
    setEditedContact("");
    setEditedAddress("");
    setEditedSerial("");
  };

  const handleDeleteUser = async (id?: string) => {
    if (!id) return;
    try {
      const userRef = ref(database, `devices/${id}`);
      await set(userRef, null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  useEffect(() => {
    const devicesRef = ref(database, "devices/");
    const unsubscribe = onValue(
      devicesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.keys(data).map((key) => {
            const device = data[key];
            return {
              id: key,
              name: device.Name || "N/A",
              email: device.Email || "N/A",
              contactNumber: device["Contact Number"] || "N/A",
              address: device.Address || "N/A",
              serial: device.Serial || "N/A",
              role: "User",
              status: device.status || "Inactive",
            };
          });
          setUsers(usersArray);
        } else {
          setUsers([]);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-48 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Manage User</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create User"}</Button>
      </div>
      {showForm && (
        <Card className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              id="name"
              placeholder="Name"
              value={newUser.name}
              onChange={handleInputChange}
            />
            <Input
              id="email"
              placeholder="Email"
              value={newUser.email}
              onChange={handleInputChange}
            />
            <Input
              id="contactNumber"
              placeholder="Contact Number"
              value={newUser.contactNumber}
              onChange={handleInputChange}
            />
            <Input
              id="address"
              placeholder="Address"
              value={newUser.address}
              onChange={handleInputChange}
            />
            <Input
              id="serial"
              placeholder="Serial"
              value={newUser.serial}
              onChange={handleInputChange}
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleAddUser}>Add User</Button>
          </div>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Serial</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      user.name || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <input
                        type="email"
                        value={editedEmail}
                        onChange={(e) => setEditedEmail(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      user.email || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedContact}
                        onChange={(e) => setEditedContact(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      user.contactNumber || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedAddress}
                        onChange={(e) => setEditedAddress(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      user.address || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUserId === user.id ? (
                      <input
                        type="text"
                        value={editedSerial}
                        onChange={(e) => setEditedSerial(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      user.serial || "N/A"
                    )}
                  </TableCell>
                  <TableCell>{user.role || "User"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status || "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {editingUserId === user.id ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            aria-label={`Save user ${user.name}`}
                            onClick={handleSaveClick}
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            aria-label={`Cancel editing user ${user.name}`}
                            onClick={handleCancelClick}
                          >
                            Cancel
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            aria-label={`Edit user ${user.name}`}
                            onClick={() => handleEditClick(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            aria-label={`Delete user ${user.name}`}
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
