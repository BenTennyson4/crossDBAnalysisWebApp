// Import from the database connection utility file the database connection method.
import { getConnection } from "../../../lib/db.js";
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
      // Get the URL and query parameter from the request object (URL) passed from the search bar using the .searchParams method to read query parameters.
      const { searchParams } = new URL(req.url);
      const query = searchParams.get('query');

      // Ensure that a search parameter was actually sent
      if (!query) {
        return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
      }

      // Connect to the database 
      const conn = await getConnection();

      // Get a list of all the tables in the database
      const getTables = `SHOW TABLES`;
      const [ tables ] = await conn.query(getTables);
      // Get the table names from the objects containing key-value pairs returned by the SHOW TABLE statement
      const tableNames = tables.map(row => Object.values(row)[0]);

      const columns = []; 
      // Get a list of all the columns for the tables in our database
      for (let i = 0; i < tableNames.length; i++) {
        const getColumns = `DESCRIBE ${tableNames[i]}`;
        const [ cols ] = await conn.query(getColumns);
        // Get the column names in the .Field property from the objects returned by DESCRIBE
        let colNames = cols.map(col => col.Field);
        // Ensure that all column names in the columns array will have the table name before it 
        for (let j = 0; j < cols.length; j++) {
          let colName = colNames[j];
          let tableName = tableNames[i];
          let newColName = tableName.concat(".", colName);
          cols[j] = newColName;
        }
        // Add the list of columns for a table to the columns array. This will be a 2d array.
        columns[i] = cols;
      }

      // Flatten out the 2d array using the flat() method
      const flattendColumnsArr = columns.flat(1);
      console.log(flattendColumnsArr);

      // Get initials of the table names
      // Future patch: this way of getting table name initials could lead to duplicates initials 
      const tableNameInitials = [];
      for (let i = 0; i < tableNames.length; i++) {
        let tableName = tableNames[i];
        let firstInitial = tableName[0];
        let secondInitial = tableName[1];
        let initials = firstInitial.concat(secondInitial);
        tableNameInitials[i] = initials;
      }

      // Append aliases to the column names to make the select statement for the join query. Also store the alias names for later use in the where clause of
      // the select query with the query parameter passed by the user
      const aliases = [];
      for (let i = 0; i < flattendColumnsArr.length; i++) {
        // Get the appended table Name from the column
        let arr = flattendColumnsArr[i].split(".");
        let tableName = arr[0];
        let columnName = arr[1];
        let alias = `${tableName}_${columnName}`;
        aliases[i] = alias;
        for (let j = 0; j < tableNames.length; j++) {
          if (tableName === tableNames[j]) {
            // Wrap the alias in backticks, via escape characters (\), to avoid SQL errors if the alias includes special characters or matches a reserved SQL keyword
            const tableAlias = tableNameInitials[tableNames.indexOf(tableName)];
            flattendColumnsArr[i] = `${tableAlias}.${columnName} AS \`${alias}\``;
            break;
          }
        }
      }

      // Create the select clause for the join query using the flattened array
      const selectClause = flattendColumnsArr.join(',\n  ');

      const fullOuterJoins = [];      
      // Generate the full outer joins for all unique pairs of tables.
      for (let i = 0; i < tableNames.length - 1; i++) {
        for (let j = i + 1; j < tableNames.length; j++) {
          let fullOuterJoin = `
          SELECT 
            ${selectClause}
          FROM ${tableNames[i]} ${tableNameInitials[i]}  
          LEFT JOIN ${tableNames[j]} ${tableNameInitials[j]} ON ${tableNameInitials[i]}.Employee_ID = ${tableNameInitials[j]}.Employee_ID

          UNION

          SELECT 
              ${selectClause}
          FROM ${tableNames[j]} ${tableNameInitials[j]}
          LEFT JOIN ${tableNames[i]} ${tableNameInitials[i]} ON ${tableNameInitials[i]}.Employee_ID = ${tableNameInitials[j]}.Employee_ID
          WHERE ${tableNameInitials[i]}.Employee_ID IS NULL
          `;
          fullOuterJoins.push(fullOuterJoin); 
        }
      }

      // Convert the fullOuterJoins array to a string with 'Union' delimiting each full outer join query together
      const fullOuterJoin = fullOuterJoins.join('\nUNION\n');      

      // Create the where caluse for the select query with placeholders and join the clause into a single string separated by OR.
      // Use (`) to avoid SQL errors if the alias includes special characters or matches a reserved SQL keyword
      const whereClause = aliases.map(alias => `\`${alias}\` LIKE ?`).join(' OR ');
      const values = aliases.map(() => `%${query}%`);

      // Create a SQL select query using the query parameter.
      const selectQuery = `SELECT * FROM (${fullOuterJoin}) AS joint WHERE ${whereClause};`;

      // Query the database
      const [ rows ] = await conn.query(selectQuery, values);
    
      // Return the resultant rows of the query 
      return NextResponse.json({ result: rows }, { status: 200 });
    } catch (error) {
      console.error('Data import error:', error);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}