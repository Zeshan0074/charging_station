import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getDbConnection } from "../../../../../lib/mssql"; // Import the DB connection function
import sql from "mssql"; // Import the sql object from mssql package

// Define authentication options using NextAuthOptions interface
const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account", // Ensures account selection is shown each time
          scope: "openid email profile",
        },
      },
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: "common", // Use 'common' for multi-tenant authentication
      authorization: {
        params: {
          scope: "openid profile email offline_access", // Default scopes for Azure AD
        },
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JWT for session management
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    updateAge: 24 * 60 * 60, // 24 hours in seconds
  },
  callbacks: {
    async signIn({ user, account }) {
      try {
        const pool = await getDbConnection(); // Use the getDbConnection function

        // Check if the user exists in the database
        const result = await pool.request()
          .input("email", sql.NVarChar, user?.email)
          .query("SELECT id FROM users WHERE email = @email");

        if (result.recordset.length === 0) {
          // Insert new user if not found
          await pool.request()
            .input("email", sql.NVarChar, user?.email)
            .input("name", sql.NVarChar, user?.name)
            .query("INSERT INTO users (email, name) VALUES (@email, @name)");
        }

        // Close connection (optional as it's pooled)
        pool.close();

        console.log("User saved/updated in database:", user);
      } catch (error) {
        console.error("Error during sign-in process:", error);
        return false; // Prevent login if error occurs
      }
      return true;
    },
    async jwt({ token, user }) {
      // This callback is called whenever the JWT is created or updated.
      // If a user object is present (new sign-in), add user data to the JWT.
      if (user) {
        token.id = user.id; // Add the user ID to the token
        token.email = user.email; // Add the user email to the token
        token.name = user.name; // Add the user name to the token
      }
      return token; // Return the updated token
    },
    async session({ session, token }) {
      
      session.user.id = token.id; // Set the user ID from the token
      session.user.email = token.email; // Set the user email from the token
      session.user.name = token.name; // Set the user name from the token
      return session; // Return the session with user data
    },
  },
 
  secret: process.env.NEXTAUTH_SECRET, // Ensure you have a secure secret for signing JWTs
};

// Create NextAuth handler
const handler = NextAuth(authOptions);

// Export the handler functions for GET and POST requests
export { handler as GET, handler as POST };
