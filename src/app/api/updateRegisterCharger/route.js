import { getDbConnection } from "../../../../lib/mssql"; // Adjust the path to your DB connection utility
import { NextResponse } from "next/server";
import sql from "mssql"; // Import the sql object from the mssql package

export async function PUT(req) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const { email, phone, chargerType } = body;

    // Validate required fields
    if (!email || (!phone && !chargerType)) {
      return NextResponse.json(
        { error: "Email and at least one field to update (Phone or ChargerType) are required" },
        { status: 400 }
      );
    }

    // Get database connection
    const pool = await getDbConnection();

    // Check if the user exists based on the provided email
    const checkUserQuery = `SELECT COUNT(*) AS count FROM users WHERE email = @Email`;
    const userExists = await pool.request()
      .input("Email", sql.NVarChar, email)
      .query(checkUserQuery);

    if (userExists.recordset[0].count === 0) {
      return NextResponse.json(
        { error: "User with this email does not exist" },
        { status: 400 }
      );
    }

    // Dynamically construct the update query based on the provided fields
    const fieldsToUpdate = [];
    if (phone) fieldsToUpdate.push("phone = @Phone");
    if (chargerType) fieldsToUpdate.push("chargerType = @ChargerType");

    if (fieldsToUpdate.length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided to update" },
        { status: 400 }
      );
    }

    const query = `
      UPDATE users
      SET ${fieldsToUpdate.join(", ")}
      WHERE email = @Email
    `;

    // Execute the query with parameters
    const request = pool.request().input("Email", sql.NVarChar, email);

    if (phone) request.input("Phone", sql.NVarChar, phone);
    if (chargerType) request.input("ChargerType", sql.NVarChar, chargerType);

    await request.query(query);

    // Return success response
    return NextResponse.json(
      { message: "Profile information updated successfully" },
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
