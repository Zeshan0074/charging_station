import { getDbConnection } from "../../../../lib/mssql"; // Adjust the path to your DB connection utility
import { NextResponse } from "next/server";
import sql from "mssql"; // Import the sql object from the mssql package

export async function GET(req) {
  try {
    // Get database connection
    const pool = await getDbConnection();

    // Fetch all user data from the users table
    const result = await pool.request().query(`
      SELECT *
      FROM users
    `);

    // Check if any users were found
    if (result.recordset.length === 0) {
      return NextResponse.json(
        { error: "No users found" },
        { status: 404 }
      );
    }

    // Return all users data
    return NextResponse.json(result.recordset, { status: 200 });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching users data:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred", details: error.message },
      { status: 500 }
    );
  }
}
