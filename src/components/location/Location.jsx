"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import BookingModal from "@/components/ReserveModal";

const Location = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromTime, setFromTime] = useState("");
  const [toTime, setToTime] = useState("");
  const [allLocations, setAllLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data, status } = useSession();

  // Fetch all locations from the API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/getLocations");
        if (!response.ok) throw new Error("Failed to fetch locations");

        const data = await response.json();
        setAllLocations(data); // Store all locations in state
        setFilteredLocations(data); // Initially, show all locations
      } catch (error) {
        console.error("Error fetching locations:", error);
        toast.error("No Charger Registered Yet!");
      }
    };

    fetchLocations();
  }, []);

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
  };

  // Filter locations based on the search query and time filters
  useEffect(() => {
    const filtered = allLocations.filter((location) => {
      const locationStartTime = new Date(location.stationStartTime).getHours() * 60 + new Date(location.stationStartTime).getMinutes();
      const locationEndTime = new Date(location.stationEndTime).getHours() * 60 + new Date(location.stationEndTime).getMinutes();

      const fromTimeInMinutes = fromTime ? new Date(`1970-01-01T${fromTime}:00`).getHours() * 60 + new Date(`1970-01-01T${fromTime}:00`).getMinutes() : null;
      const toTimeInMinutes = toTime ? new Date(`1970-01-01T${toTime}:00`).getHours() * 60 + new Date(`1970-01-01T${toTime}:00`).getMinutes() : null;

      // Filter based on search query and time range
      const timeCondition =
        (!fromTime || locationStartTime >= fromTimeInMinutes) &&
        (!toTime || locationEndTime <= toTimeInMinutes);

      // Apply the time condition only if times are provided
      const locationMatchesTime =
        fromTime && toTime ? timeCondition : true;

      return (
        (location.streetAddress.toLowerCase().includes(searchQuery) ||
          location.city.toLowerCase().includes(searchQuery) ||
          location.state.toLowerCase().includes(searchQuery) ||
          location.country.toLowerCase().includes(searchQuery)) &&
        locationMatchesTime
      );
    });

    setFilteredLocations(filtered);

    // Select the first filtered location for the map
    if (filtered.length > 0) {
      setSelectedLocation(filtered[0]);
    } else {
      setSelectedLocation(null); // Clear the map if no match
    }
  }, [searchQuery, fromTime, toTime, allLocations]);

  // Format the time to display as HH:mm
  const formatTime = (isoDate) => {
    const date = new Date(isoDate);
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Load Google Map script dynamically
  useEffect(() => {
    const loadGoogleMapScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBPi6heSN2DWBFY8ET5WV71q_W9swG9TG0&callback=initMap`;
      script.async = true;
      document.head.appendChild(script);
    };

    loadGoogleMapScript();

    // Initialize Google Map with markers
    window.initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("google-map"), {
        zoom: 10,
        center: selectedLocation
          ? { lat: selectedLocation.latitude, lng: selectedLocation.longitude }
          : { lat: 37.7749, lng: -122.4194 }, // Default to San Francisco
      });

      const infoWindow = new window.google.maps.InfoWindow();

      // Save map and infoWindow instances to state
      setMap(map);
      setInfoWindow(infoWindow);

      // Add markers for all filtered locations
      filteredLocations.forEach((location) => {
        const marker = new window.google.maps.Marker({
          position: { lat: location.latitude, lng: location.longitude },
          map: map,
          title: location.streetAddress,
        });

        // Add a click event listener to each marker
        marker.addListener("click", () => {
          // Set the infoWindow content and position
          const infoContent = `
            <div>
              <p><strong>Name:</strong> ${location?.name}</p>
              <p><strong>Phone:</strong> ${location.phone}</p>
              <p><strong>Charger Type:</strong> ${location.chargerType}</p>
              <p><strong>From:</strong> ${formatTime(location.stationStartTime)} to ${formatTime(location.stationEndTime)}</p>
              <button id="book-button" class="bg-blue-500 text-white px-4 py-2 rounded mt-4">Book Charger</button>
            </div>
          `;

          infoWindow.setContent(infoContent);
          infoWindow.setPosition(marker.getPosition());
          infoWindow.open(map, marker);

          // Update selected location in state
          setSelectedLocation(location);
        });
      });
    };

    // Add the event listener once for the "Book Charger" button
    const handleBookButtonClick = (event) => {
      if (event.target && event.target.id === "book-button") {
        { data === null ? toast.error("Please Login First") : setIsModalOpen(true) }
      }
    };

    // Attach the event listener once when the component mounts
    document.addEventListener("click", handleBookButtonClick);

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("click", handleBookButtonClick);
    };
  }, [filteredLocations, selectedLocation]);

  return (
    <div className="theropy-background xs:px-2 sm:px-4 md:px-12 lg:px-20 mt-12">
      {/* Search Input */}
      <h2 className="text-center md:text-start font-semibold text-xl md:text-2xl lg:text-3xl mb-6">
        Find A Location
      </h2>
      <div className=" flex flex-row gap-1  ">
        <input
          type="search"
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3  rounded-lg mb-6 border border-gray-300 outline-none"
        />
        <div className="flex gap-4 mb-6">
          <div className=" flex flex-col gap-1">
            <label className="text-center font-semibold">From</label>
            <input
              type="time"
              value={fromTime}
              onChange={(e) => setFromTime(e.target.value)}
              className="w-full p-3  rounded-lg border border-gray-300 outline-none "
            />
          </div>
          <div className=" flex flex-col gap-1">
            <label className="text-center font-semibold">To</label>
            <input
              type="time"
              value={toTime}
              onChange={(e) => setToTime(e.target.value)}
              className="w-full p-3  rounded-lg border border-gray-300 outline-none"
            />
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        providerEmail={selectedLocation?.email} // Pass providerEmail here
      />
      {/* Google Map */}
      <div className="w-full mt-6">
        <div id="google-map" className="w-full h-[500px] rounded-lg"></div>
      </div>
    </div>
  );
};

export default Location;
