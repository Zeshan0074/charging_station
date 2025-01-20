import { getDbConnection } from "../../../../lib/mssql"; // Adjust this path
import { NextResponse } from "next/server";
import sql from "mssql"; // Import the sql object from mssql package
import fetch from "node-fetch"; // Use fetch for making API requests

// Function to get latitude and longitude from address
async function getCoordinatesFromAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
  )}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status === "OK") {
    const location = data.results[0].geometry.location;
    return {
      latitude: location.lat,
      longitude: location.lng,
    };
  } else {
    throw new Error(`Geocoding API error: ${data.status}`);
  }
}

export async function POST(req) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const {
      email,
      phone,
      streetAddress,
      city,
      state,
      country,
      chargerType,
      stationStartTime,
      stationEndTime,
    } = body;

    // Combine the address components into a full address
    const fullAddress = `${streetAddress}, ${city}, ${state}, ${country}`;

    // Get latitude and longitude from the address using the Geocoding API
    const { latitude, longitude } = await getCoordinatesFromAddress(fullAddress);

    // Get database connection
    const pool = await getDbConnection();

    // Check if the user already exists based on email
    const checkQuery = `SELECT COUNT(*) AS count FROM users WHERE email = @Email`;
    const result = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query(checkQuery);

    // If user exists, update the user's data
    if (result.recordset[0].count > 0) {
      const updateQuery = `
        UPDATE users
        SET
          phone = @Phone,
          streetAddress = @StreetAddress,
          city = @City,
          state = @State,
          country = @Country,
          chargerType = @ChargerType,
          stationStartTime = @StationStartTime,
          stationEndTime = @StationEndTime,
          latitude = @Latitude,
          longitude = @Longitude
        WHERE email = @Email
      `;
      
      await pool.request()
        .input("Email", sql.NVarChar, email)
        .input("Phone", sql.NVarChar, phone)
        .input("StreetAddress", sql.NVarChar, streetAddress)
        .input("City", sql.NVarChar, city)
        .input("State", sql.NVarChar, state)
        .input("Country", sql.NVarChar, country)
        .input("ChargerType", sql.NVarChar, chargerType)
        .input("StationStartTime", sql.NVarChar, stationStartTime) // Pass as-is
        .input("StationEndTime", sql.NVarChar, stationEndTime) // Pass as-is
        .input("Latitude", sql.Float, latitude)
        .input("Longitude", sql.Float, longitude)
        .query(updateQuery);

      return NextResponse.json(
        { message: "Provider information updated successfully" },
        { status: 200 }
      );
    } else {
      // If user doesn't exist, insert a new record
      const insertQuery = `
        INSERT INTO users
        (email, phone, streetAddress, city, state, country, chargerType, stationStartTime, stationEndTime, latitude, longitude)
        VALUES
        (@Email, @Phone, @StreetAddress, @City, @State, @Country, @ChargerType, @StationStartTime, @StationEndTime, @Latitude, @Longitude)
      `;

      await pool.request()
        .input("Email", sql.NVarChar, email)
        .input("Phone", sql.NVarChar, phone)
        .input("StreetAddress", sql.NVarChar, streetAddress)
        .input("City", sql.NVarChar, city)
        .input("State", sql.NVarChar, state)
        .input("Country", sql.NVarChar, country)
        .input("ChargerType", sql.NVarChar, chargerType)
        .input("StationStartTime", sql.NVarChar, stationStartTime) // Pass as-is
        .input("StationEndTime", sql.NVarChar, stationEndTime) // Pass as-is
        .input("Latitude", sql.Float, latitude)
        .input("Longitude", sql.Float, longitude)
        .query(insertQuery);

      return NextResponse.json(
        { message: "Provider information saved successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
