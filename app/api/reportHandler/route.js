// Import from the database connection utility file the database connection method.
import { getConnection } from "../../../lib/db.js";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {

        // Get the report request type
        const { searchParams } = new URL(req.url); // Parse the request URL and extract the query parameters from it
        const reportType = searchParams.get('query'); // Get the 'query' parameter value (e.g., 'report1')

        // Ensure that a search parameter was actually sent
        if (!reportType) {
          return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
        }

        // Connect to the database 
        const conn = await getConnection();

        let selectQuery;

        // Generate select queries based on reportType
        if (reportType === 'report1') {
            // Get all records that match on Emp ID
            selectQuery = `
                SELECT      *
                FROM        hr_table AS hr
                INNER JOIN  well_sky AS ws
                ON          hr.Employee_ID = ws.Employee_ID
            `;
        } else if (reportType === 'report2') {
            // Get all records that do not match on Emp ID
            selectQuery = `
                SELECT      *
                FROM        hr_table AS hr
                OUTER JOIN  well_sky AS ws
                ON          hr.Employee_ID = ws.Employee_ID
            `;
        } else if (reportType === 'report3') {
            // Get all records that partially match on last name, first name, and title
            selectQuery = `
                SELECT      *
                FROM        hr_table AS hr
                JOIN        well_sky AS ws
                ON hr.Employee_Name LIKE CONCAT('%', ws.Employee_Name, '%')
                AND hr.Supervisor_Name LIKE CONCAT('%', ws.Supervisor_Name, '%')
                AND hr.Job_Title LIKE CONCAT('%', ws.Job_Title, '%');

            `;
        } else {
            return NextResponse.json({ error: 'Invalid request error' }, { status: 500 });
        }

      // Query the database
      const [ rows ] = await conn.query(selectQuery);
    
      // Return the resultant rows of the query 
      return NextResponse.json({ message: 'Report data found', result: rows }, { status: 200 });
    } catch (error) {
      console.error('Data not found error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}