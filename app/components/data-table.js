import styles from '../componentStyles/data-table.module.css';

// Input: Two props are passed. The data array is a 2d array of row objects that were just
// uploaded to the database and passed from the uploadHandler API route, and the id for the 
// type of data file being uploaded. The fileID should be an optional prop. It will be null if not passed
// The DataTable component dynamically builds the table column headers and rows using the data array passed to it.
export default function DataTable({ data }) {

    return (
    <>

      {
        <div className={styles.dataTable}>
          <table border="1">
            <thead>
              <tr>
                { /* Object.keys() returns an array of a given object's own enumerable string-keyed property names. */
                data.length > 0 &&
                Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, colIndex) => (
                    <td key={colIndex}>{value}</td>
                  ))}
                </tr>
              ))}
              </tbody>
          </table>
        </div>
      }

    </>
    );
} 