"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const ProviderInfoForm = () => {
  const [basicInfo, setBasicInfo] = useState({
    email: "",
    phone: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    chargerType: "",
    stationStartTime: "",
    stationEndTime: "",
  });
  const history = useRouter()
  const {data,status}  = useSession();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitBasicInfo = async (e) => {
    e.preventDefault();
    if (data === null) {
      toast.error("Please SignIn First!")
      return;
    }
    

    try {
      const response = await fetch("http://localhost:3000/api/registerCharger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(basicInfo),
      });

      if (response.ok) {
        toast.success("Provider information saved successfully");
        history.push("/")
        setBasicInfo({
          email: "",
          phone: "",
          streetAddress: "",
          city: "",
          state: "",
          country: "",
          chargerType: "",
          stationStartTime: "",
          stationEndTime: "",
        });
      } else {
        const errorData = await response.json();
        toast.error(`${errorData.error}`);
      }
    } catch (error) {
      console.error("Error saving provider info:", error);
      alert("An error occurred while saving provider information");
    }
  };

  return (
    <div className="flex justify-center items-center flex-col w-full my-3">
      <h2 className="text-xl font-semibold text-center text-gray-800 my-2">
        Provider Information
      </h2>
      <form
        className="space-y-6 w-[50%] bg-secondary py-2 px-4 rounded-lg"
        onSubmit={handleSubmitBasicInfo}
      >
        <div className="flex items-center w-full gap-3 justify-between">
          <div className="w-full">
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

          <div className="w-full">
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

        <div className="w-full">
          <label className="block text-gray-700 font-medium mb-2">
            Street Address
          </label>
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
          <div className="w-full">
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

          <div className="w-full">
            <label className="block text-gray-700 font-medium mb-2">
              State/Province
            </label>
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

        <div className="w-full">
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
          <label className="block text-gray-700 font-medium mb-2">Charger Type</label>
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
  );
};

export default ProviderInfoForm;
