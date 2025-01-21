"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaMicrosoft } from "react-icons/fa";

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
                        <div className="mt-6 flex flex-col gap-4 items-center">
                            <button
                                className="border rounded py-2 px-4 gap-4 text-black flex items-center w-64 justify-center"
                                onClick={() => signIn("google")}
                            >
                                <FcGoogle />
                                Continue with Google
                            </button>
                            <button
                                className="border rounded py-2 px-4 gap-4 text-black flex items-center w-64 justify-center"
                                onClick={() => signIn("azure-ad", { callbackUrl: "https://localhost:3000" })}
                                
                            >
                                <FaMicrosoft className="text-blue-500" />
                                Continue with Microsoft
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div>
                        {/* Step 2 content can be added here */}
                    </div>
                )}
            </div>
        </div>
    );
}
