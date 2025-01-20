import { getDbConnection } from "../../../../lib/mssql";
import { NextResponse } from "next/server";
import sql from "mssql";

export async function POST(req) {
  try {
    const { email, startTime, endTime ,providerEmail } = await req.json();

    if (!email || !startTime || !endTime || !providerEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const pool = await getDbConnection();
    await pool.request()
      .input("email", sql.VarChar, email)
      .input("providerEmail", sql.VarChar, providerEmail)
      .input("startTime", sql.NVarChar, startTime)
      .input("endTime", sql.NVarChar, endTime)
      .query(
        `INSERT INTO ChargerBookings (email, startTime, endTime, ProviderEmail)
         VALUES (@email, @startTime, @endTime, @ProviderEmail)`
      );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error booking charger:", error);
    return NextResponse.json(
      { error: "Failed to book charger", details: error.message },
      { status: 500 }
    );
  }
}
