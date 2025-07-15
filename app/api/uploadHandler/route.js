// Import from the database connection utility file the database connection method.
import { getConnection } from "../../../lib/db.js";
import { NextResponse } from 'next/server';
import * as xlsx from 'xlsx';

// Helper function to convert 'MM/DD/YYYY' or other invalid formats to 'YYYY-MM-DD'
function convertToDate(value) {
    // Check if value actually contains something
    if (!value) return null;
    // Create a date object
    const date = new Date(value);

    if (isNaN(date)) return null; // invalid date
    // Return an ISO format, YYYY-MM-DDTHH:mm:ss.sssZ, of the string with everything after T removed
    return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}


// Function that performs API routing for the database. Runs on the backend server when a request is made to the API endpoint for 
// uploading a file to the database. Export HTTP method handler, POST.
// Input: FormData object from the upload button.
export async function POST(req) {
    try {
        // Connect to the database using the database connection method from the database utility file.
        const conn = await getConnection();

        // Ensure that the object passed to POST is a FormData object that contains a file.
        const formData = await req.formData();
        const file = formData.get('file');
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Get which table the file data should be inserted in
        let table = formData.get('table');

        // Convert the uploaded file to a buffer because xlsx.read() expects a buffer or the file to be saved to disk when parsing in-memory file uploads.
        const buffer = Buffer.from(await file.arrayBuffer());

        // Extract the data from the buffer as an xlsx workbook
        const workbook = xlsx.read(buffer, {type: 'buffer'});

        // Get the first sheet from the list of the worksheet names in the workbook.
        const sheetName = workbook.SheetNames[0];

        // Convert the sheet data to json format. This will group the rows of data in json format.
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Define the insertQuery variable and the values variable within the scope of the database query.
        let insertQuery;
        let values;

        // Generate the insert query for the database depending on the uploaded data file.
        if (table === "hr") {
            // Sql insertion query for HR_Table. Use IGNORE to skip rows that violate a unique (or primary) value constraint
            insertQuery = `
            INSERT IGNORE INTO HR_Table (
                Company_Name, Employee_Name, Match_Up, Org_Level_2_Code, Org_Level_1_Code,
                Employee_ID, Employee_Type, Home_Company_Name, Job_Code, Job_Title,
                Location_Code, Home_Phone, Email_Address, Supervisor_Email, Supervisor_Name,
                Date_In_Job, Original_Hire_Date, Seniority_Date, Employment_Status,
                Org_Level_3_Code, Termination_Date, Wage_Type, Company_Code,
                Home_Company_Type, Last_Hire_Date, Work_Phone
            ) VALUES ?
            `;

            // Prepare values as a 2D array for bulk insert.
            // The .map() function loops over all objects in data and it defines row for each loop iteration since .map() has the parameters .map((item, index, array) => return transformedItem;)
            values = data.map(row => [
            row.Company_Name || null,
            row.Employee_Name || null,
            row.Match_Up ?? null,
            row.Org_Level_2_Code || null,
            row.Org_Level_1_Code || null,
            row.Employee_ID || null,
            row.Employee_Type || null,
            row.Home_Company_Name || null,
            row.Job_Code || null,
            row.Job_Title || null,
            row.Location_Code || null,
            row.Home_Phone || null,
            row.Email_Address || null,
            row.Supervisor_Email || null,
            row.Supervisor_Name || null,
            convertToDate(row.Date_In_Job) || null,
            convertToDate(row.Original_Hire_Date) || null,
            convertToDate(row.Seniority_Date) || null,
            row.Employment_Status ?? null,
            row.Org_Level_3_Code || null,
            convertToDate(row.Termination_Date) || null,
            row.Wage_Type || null,
            row.Company_Code || null,
            row.Home_Company_Type || null,
            convertToDate(row.Last_Hire_Date) || null,
            row.Work_Phone || null
            ]);
        } else if (table === "ws") {

            // SQL insert query for Well_Sky table
            insertQuery = `INSERT IGNORE INTO Well_Sky (User_ID, User_Name, Job_Title, Email, Cell_Phone, Employee_ID,
                Employee_Badge_ID, Batch_Number, User_Status, Home_Facility) VALUES ?
                `; 

            // Prepare the data as a 2d array.
            values = data.map(row => [
                row.User_ID || null,
                row.User_Name || null,
                row.Job_Title || null,
                row.Email || null,
                row.Cell_Phone || null,
                row.Employee_ID || null,
                row.Employee_Badge_ID || null,
                row.Batch_Number || null,
                row.User_Status || null,
                row.Home_Facility || null
            ]);
        } else {
            return NextResponse.json(
                { error: 'Invalid file name identifier. Expected prefix like "hr" or "ws".' },
                { status: 400 }
            );
        }

        // Query the data base 
        await conn.query(insertQuery, [values]);

        // Get the data from the database to return it for display on the frontend.

        // Get all Employee_IDs from the data that was just inserted into the database. 
        const insertedIds = values.map(v => v[5]); // 6th item in each row = Employee_ID

        // Build the SELECT query
        // Create a corresponding place holder (?) for each insert id. 
        const placeholders = insertedIds.map(() => '?').join(',');

        // Generate the correct select query to return the data just uploaded to the database.
        let fetchQuery;
        // The select query place holders will have a corresponding id for each place holder.
        if (table === "hr") {
            fetchQuery = `SELECT * FROM HR_Table WHERE Employee_ID IN (${placeholders})`;
        } else if (table === "ws") {
            fetchQuery = `SELECT * FROM Well_Sky WHERE Employee_ID IN (${placeholders})`;
        } 

        // Execute the query (the place holders will be replaced by the actual ids)
        const [insertedRows] = await conn.query(fetchQuery, insertedIds);

        // Send a json response back to the client to indicate whether the operation succeeded.
        return NextResponse.json({ message: 'Data inserted successfully', data: insertedRows});

    } catch (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }

}