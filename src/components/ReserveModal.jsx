"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

const BookingModal = ({ isOpen, onClose, providerEmail }) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, status } = useSession();
  
  console.log("Provider Email",providerEmail);
  const handleConfirm = () => {
    if (!startTime || !endTime) {
      toast.error("Please select a valid time range.");
      return;
    }

    setIsLoading(true);

    const bookingDetails = {
      email: data?.user?.email, // User's email from session
      providerEmail,            // Provider's email
      startTime,                // Selected start time
      endTime,                  // Selected end time
    };

    fetch("http://localhost:3000/api/reserveCharger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingDetails),
    })
      .then((res) => res.json())
      .then((response) => {
        setIsLoading(false);
        if (response.success) {
          toast.success("Charger booked successfully!");
          onClose(); // Close the modal on success
        } else {
          toast.error(response.message || "Failed to book charger. Please try again.");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error booking charger:", error);
        toast.error("An unexpected error occurred.");
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h3 className="text-xl font-semibold mb-4">Book Charger</h3>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
