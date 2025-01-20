"use client"
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

export default function LoginModal({ isOpen, closeModal }) {
    const [step, setStep] = useState(1);
    const [userType, setUserType] = useState(null);
    const [basicInfo, setBasicInfo] = useState({
        email: "",
        address: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        streetAddress: "",
        chargerType: "",
        stationStartTime: "",
        stationEndTime: "",
    });

    const handleContinueWithGoogle = () => setStep(2);
    const handleUserTypeSelection = (type) => {
        setUserType(type);
        if (type === "provider") {
            setStep(3);
        } else {
            closeModal();
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBasicInfo((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmitBasicInfo = (e) => {
        e.preventDefault();
        console.log("Provider Info Submitted:", basicInfo);
        closeModal();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg w-[45%] p-6 shadow-lg relative max-h-[500px] overflow-y-auto">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                    onClick={closeModal}
                >
                    ✕
                </button>

                {step === 1 && (
                    <div>
                        <h2 className="text-xl font-semibold text-center text-gray-800">
                            Welcome to Mobile Power Station
                        </h2>
                        <div className="mt-6 flex justify-center">
                            <button
                                className="border rounded py-2 px-4 gap-4 text-black flex items-center"
                                onClick={handleContinueWithGoogle}
                            >
                                <FcGoogle />
                                Continue with Google
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <h2 className="text-xl font-semibold text-center text-gray-800">
                            Select Your Role
                        </h2>
                        <div className="mt-6 space-y-4">
                            <button
                                className="w-full py-2 px-4 border rounded text-gray-700 hover:bg-gray-100"
                                onClick={() => handleUserTypeSelection("user")}
                            >
                                User
                            </button>
                            <button
                                className="w-full py-2 px-4 border rounded text-gray-700 hover:bg-gray-100"
                                onClick={() => handleUserTypeSelection("provider")}
                            >
                                Provider
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (

                    <div className="">
                        <h2 className="text-xl font-semibold text-center text-gray-800">
                            Provider Information
                        </h2>
                        <form className="space-y-6" onSubmit={handleSubmitBasicInfo}>
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={basicInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={basicInfo.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Street Address</label>
                                <input
                                    type="text"
                                    name="streetAddress"
                                    value={basicInfo.streetAddress}
                                    onChange={handleInputChange}
                                    placeholder="Enter your street address"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={basicInfo.city}
                                        onChange={handleInputChange}
                                        placeholder="Enter your city"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">State/Province</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={basicInfo.state}
                                        onChange={handleInputChange}
                                        placeholder="Enter your state or province"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={basicInfo.country}
                                    onChange={handleInputChange}
                                    placeholder="Enter your country"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Charger Type
                                </label>
                                <select
                                    name="chargerType"
                                    value={basicInfo.chargerType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                >
                                    <option value="">Select charger type</option>
                                    <option value="fast">Fast Charger</option>
                                    <option value="normal">Normal Charger</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Station Available Time
                                </label>
                                <div className="flex flex-col md:flex-row gap-4 items-center">
                                    <input
                                        type="time"
                                        name="stationStartTime"
                                        value={basicInfo.stationStartTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                    <span className="text-gray-600">to</span>
                                    <input
                                        type="time"
                                        name="stationEndTime"
                                        value={basicInfo.stationEndTime}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full bg-primary text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg hover:opacity-90 transition duration-300"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    </div>

                )}
            </div>
        </div>
    );
}
