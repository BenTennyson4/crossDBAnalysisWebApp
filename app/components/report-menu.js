'use client';

import { useState } from 'react';
import axios from 'axios';
import styles from '../componentStyles/report-menu.module.css';
import sharedStyles from '../componentStyles/shared-layout.module.css';

export default function ReportMenu ({ setReportData }) {
    // State variable to track the report selection
    const [reportSelection, setReportSelection] = useState('report1');
    // State var to contain message from API route
    const [message, setMessage] = useState(''); 

    function handleChange (event) {
        setReportSelection(event.target.value);
    }

    function handleSubmit (event) {
        // Prevents the page from reloading in response to the form submission, which is the default behavior.
        event.preventDefault()

        if (!reportSelection) {
            setMessage('Please select a report.');
            return;
        }


        const url = 'http://localhost:3000/api/reportHandler'

        console.log("Sending request to:", `${url}?query=${reportSelection}`);

        axios.get(`${url}?query=${reportSelection}`).then((response) => {
            console.log(response.data);
            setMessage(response.data.message);      // Show success message
            setReportData(response.data.result);    // Pass data to the DataTable
        })
        .catch((error) => {
            setMessage('Upload failed.');
            console.error(error);
        });
    }

    return (
        <div className={sharedStyles.toolbarItem}>
            <form className={sharedStyles.toolbarForm} onSubmit={handleSubmit}>
                <label className={sharedStyles.toolbarLabel}>Reports: </label>

                <select className={sharedStyles.toolbarSelect} onChange={handleChange}>
                    <option value="">Select a report...</option>
                    <option value="report1">Records that match on Emp ID</option>
                    <option value="report2">Records that do not on Emp ID</option>
                    <option value="report3">Records that partially match on last and first name and title</option>
                </select>
                <button className={sharedStyles.toolbarButton} type='submit'>Generate</button>
            </form>
            {/* Use conditional rendering to check if there is a message, and if so return it (the response from the upload route) is not null/undefined/empty, then display it. */}
            {message && <p className={styles.message}>{message + "!"}</p>}
        </div>
    );
}