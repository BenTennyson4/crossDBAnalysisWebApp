// Get the client
import mysql from 'mysql2/promise';

// Database utility function
// Create the connection to the database. Export makes the function available for use in other files via "import". 
// Async means the function returns a "Promise, an object that links producing code and consuming code,
// and that the function can use await until that promise is fulfilled.
export async function getConnection() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user:  process.env.DB_USER,
        password:  process.env.DB_PASSWORD,
        database:  process.env.DB_NAME,
    });
    return conn;
}
