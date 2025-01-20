import { getDbConnection } from "../../../../lib/mssql"; // Adjust this path
import { NextResponse } from "next/server";
import sql from "mssql"; // Import the sql object from mssql package

export async function GET(request) {
  try {
    // Extract the email from query parameters
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    // Validate that email is provided
    if (!email) {
      return NextResponse.json(
        { error: "Email query parameter is required" },
        { status: 400 }
      );
    }

    // Get database connection
    const pool = await getDbConnection();

    // SQL query to fetch data based on the email
    const query = `
      SELECT 
        email, phone, streetAddress, city, state, country, chargerType, stationStartTime, stationEndTime 
      FROM users
      WHERE email = @Email
    `;

    // Execute the query with the email parameter
    const result = await pool
      .request()
      .input("Email", sql.VarChar, email) // Pass the email as a parameter
      .query(query);

    // Check if data exists
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { message: "No data found for the provided email" },
        { status: 404 }
      );
    }

    // Return success response with data
    return NextResponse.json(
      { data: result.recordset },
      { status: 200 }
    );
  } catch (error) {
    // Handle errors
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
