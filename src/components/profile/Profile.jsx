"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";

const Profile = () => {
  const { status, data } = useSession();
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservedTimes, setReservedTimes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (status === "authenticated" && data?.user?.email) {
          const response = await fetch(
            `http://localhost:3000/api/getRegisterCharger?email=${data?.user?.email}`,
            {
              method: "GET",
            }
          );

          const result = await response.json();
          if (response.ok) {
            setFormData(result.data.length > 0 ? result.data[0] : null);
          } else {
            setError(result.error || "Failed to fetch data");
          }
        }
      } catch (err) {
        setError("An unexpected error occurred");
      } finally {
        setLoading(false);
      }

    //Get Reserved Data API 
    try {
      const response = await fetch(
        `http://localhost:3000/api/getReservedCharger?providerEmail=${data.user.email}`,
        {
          method: "GET",
        }
      );

      const result = await response.json();

      if (response.ok) {
        setReservedTimes(result?.bookings || []);
      } else {
        setError(result.error || "Failed to fetch reserved times.");
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
 
    };

    fetchData();

  
  }, [data, status]);

  const openModal = (field) => {
    setCurrentField(field);
    setTempValue(formData[field]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentField(null);
  };

  // Format the time to display as HH:mm
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/updateRegisterCharger", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email, // Pass the email to identify the user
          [currentField]: tempValue,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          [currentField]: tempValue,
        }));
        closeModal();
        toast.success(`${currentField} updated successfully!`);
      } else {
        toast.error(result.error || "Failed to update data");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  const handleDeleteProfile = () => {
    setIsDeleteModalOpen(false);
    toast.success("Delete profile functionality coming soon!");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  if (!formData) {
    return (
      <div className="h-[80vh] w-full flex justify-center items-center">
        <p className="text-center text-gray-700 font-medium text-2xl">
          Please Register Charger!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-2 max-w-3xl md:mx-auto p-8 bg-secondary rounded shadow-lg mt-12">
      <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl text-center text-gray-800 mb-8">
        Profile Information
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-gray-700 font-medium">Name</h3>
          <p className="text-gray-600">{formData.name}</p>
        </div>
        <div>
          <h3 className="text-gray-700 font-medium">Email</h3>
          <p className="text-gray-600">{formData.email}</p>
        </div>

        <div>
          <h3 className="text-gray-700 font-medium">Address</h3>
          <p className="text-gray-600">
            {formData.streetAddress}, {formData.city}, {formData.state}, {formData.country}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-700 font-medium">Phone</h3>
            <p className="text-gray-600">{formData.phone}</p>
          </div>
          <div
            onClick={() => openModal("phone")}
            className="flex items-center gap-3 justify-between hover:cursor-pointer"
          >
            <FaEdit className="text-primary" />
            <button className="hover:underline">Edit</button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-gray-700 font-medium">Charger Type</h3>
            <p className="text-gray-600">{formData.chargerType}</p>
          </div>
          <div
            onClick={() => openModal("chargerType")}
            className="flex items-center gap-3 justify-between hover:cursor-pointer"
          >
            <FaEdit className="text-primary" />
            <button className="hover:underline">Edit</button>
          </div>
        </div>

        <div>
          <h3 className="text-gray-700 font-medium">Time</h3>
          <p className="text-gray-600">
            from{" "}
            <span className="text-primary">
              {formatTime(formData.stationStartTime) || "N/A"}
            </span>{" "}
            to{" "}
            <span className="text-primary">
              {formatTime(formData.stationEndTime) || "N/A"}
            </span>
          </p>
        </div>

        <div className="mx-2 max-w-3xl md:mx-auto p-8 bg-secondary rounded shadow-lg mt-12">
      <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl text-center text-gray-800 mb-8">
        Reserved Times
      </h2>

      {reservedTimes.length > 0 ? (
        <ul className="space-y-4">
          {reservedTimes.map((time, index) => (
            <li
              key={index}
              className="p-4 bg-gray-100 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700 font-medium">User Email:</p>
                <p className="text-gray-600">{time.email}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">Start Time:</p>
                <p className="text-gray-600">{time.startTime}</p>
              </div>
              <div>
                <p className="text-gray-700 font-medium">End Time:</p>
                <p className="text-gray-600">{time.endTime}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-700 font-normal text-lg">
          No reserved times found.
        </p>
      )}
    </div>

        <div className="mt-6">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
          >
            Request Delete Account
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-gray-700 font-medium mb-4">
              Edit {currentField === "phone" ? "Phone Number" : "Charger Type"}
            </h3>
            {currentField === "chargerType" ? (
              <select
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Fast Charger">Fast Charger</option>
                <option value="Normal Charger">Normal Charger</option>
              </select>
            ) : (
              <input
                type="text"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
            <div className="mt-6 flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-gray-700 font-medium mb-4">
              Are you sure you want to delete your profile?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={handleDeleteProfile}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
