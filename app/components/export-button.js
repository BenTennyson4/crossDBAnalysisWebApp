'use client';

import sharedStyles from '../componentStyles/shared-layout.module.css';
import { useState } from 'react';

export default function ExportButton({ exportData }) {
    const [file, setFile] = useState();

    function handleClick () {
        setFile(exportData);
        // Ensure that the file data exists
        if (!file || file.length === 0 ) {
            return "Please generate a report to export."
        }
        handleExport(file)
    }

    function handleExport (file) {
        // Convert the data in file to csv format
        const csvContent = convertToCSV(file);
        // Create a blob, which is a file-like object that contains raw, immutable, data, and can be read as text or binary data.
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' }); 

        // Create a temporary URL that points to the blob
        const url = URL.createObjectURL(blob);

        // Create a new <a> anchor element in memory that we will use to make a link to the blob url.
        const link = document.createElement("a");

        // Set the href of the link to the blob url
        link.setAttribute("href", url);

        /**
         * Set the file name for the downloaded file.
         * Change in the future to allow user to make the file name.
         */
        link.setAttribute("download", "report.csv");

        // Add the <a> element (link) to the DOM temporarily
        document.body.appendChild(link);

        // Automatically click the link
        link.click();

        // Remove the temoporary <a> element from the DOM
        document.body.removeChild(link);

    }

    function convertToCSV (data) {
        // Get the headers by getting the enumerable string-keyed property names of the first row of data, then separating them with commas and adding a new line character at the end
        const headers = Object.keys(data[0]).join(",") + "\n";

        // Create the rows by getting the values separated by commas and adding a new line char at the end
        const rows = data.map(row => Object.values(row).join(",")).join("\n");

        // Return the headers and the rows
        return headers + rows;
    }

    return (
        <div className={sharedStyles.toolbarItem}>
            <form className={sharedStyles.toolbarForm} onSubmit={(e) => e.preventDefault()}>
                <button className={sharedStyles.toolbarButton} onClick={handleClick}>Export</button>
            </form>
        </div>
    );
}