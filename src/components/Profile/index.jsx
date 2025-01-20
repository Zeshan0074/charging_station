"use client";
import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
    const [formData, setFormData] = useState({
        email: "user@example.com",
        address: "Street Address, City, State/Province, Country 1600 Amphitheatre Parkway, Mountain View, CA, USA",
        phone: "Samsung Galaxy",
        chargerType: "Fast Charger",
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [tempValue, setTempValue] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openModal = (field) => {
        setCurrentField(field);
        setTempValue(formData[field]);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentField(null);
    };

    const handleSave = () => {
        setFormData((prev) => ({
            ...prev,
            [currentField]: tempValue,
        }));
        closeModal();
    };

    const handleDeleteProfile = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="mx-2 max-w-3xl md:mx-auto p-8 bg-secondary rounded shadow-lg mt-12">
            <h2 className="font-semibold text-xl md:text-2xl lg:text-3xl text-center text-gray-800 mb-8">
                Profile Information
            </h2>

            {/* Profile Information */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-gray-700 font-medium">Email</h3>
                    <p className="text-gray-600">{formData.email}</p>
                </div>

                <div>
                    <h3 className="text-gray-700 font-medium">Address</h3>
                    <p className="text-gray-600">{formData.address}</p>
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
                        from <span className="text-primary">8:00 pm </span> to{" "}
                        <span className="text-primary"> 9:00 pm</span>
                    </p>
                </div>

                {/* Delete Profile Button */}
                <div className="mt-6">
                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
                    >
                        Request Delete Account
                    </button>
                </div>
            </div>

            {/* Edit Modal */}
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

            {/* Delete Modal */}
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
