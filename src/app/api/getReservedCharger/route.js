import { getDbConnection } from "../../../../lib/mssql";
import { NextResponse } from "next/server";
import sql from "mssql";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const providerEmail = searchParams.get("providerEmail");

    if (!providerEmail) {
      return NextResponse.json(
        { error: "Provider email is required" },
        { status: 400 }
      );
    }

    const pool = await getDbConnection();
    const result = await pool
      .request()
      .input("providerEmail", sql.VarChar, providerEmail)
      .query(
        `SELECT email, startTime, endTime
         FROM ChargerBookings
         WHERE ProviderEmail = @providerEmail`
      );

    const bookings = result.recordset;

    if (bookings.length === 0) {
      return NextResponse.json(
        { message: "No bookings found for this provider" },
        { status: 404 }
      );
    }

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error) {
    console.error("Error fetching charger bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch charger bookings", details: error.message },
      { status: 500 }
    );
  }
}
