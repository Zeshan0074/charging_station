import sql from 'mssql';

const config = {
  user: "admindbuser",
  password: "gulfamD12",
  database: "charging_db",
  server: "charging-server.database.windows.net",
  options: {
    encrypt: true, // Use this if you're connecting to Azure
    trustServerCertificate: false, // Change to true for local dev if necessary
  },
  pool: {
    max: 10, // Maximum number of connections
    min: 0,  // Minimum number of connections
    idleTimeoutMillis: 30000, // Idle timeout in milliseconds
  }    
};

let pool;

export const getDbConnection = async () => {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
};
