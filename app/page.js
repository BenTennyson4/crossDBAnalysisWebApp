"use client";

import { useState } from 'react';

import UploadButton from './components/upload-button';
import SearchBar from "./components/search-bar";
import DataTable from "./components/data-table";
import TableSelector from "./components/db-table-selector";
import ReportMenu from "./components/report-menu";
import ExportButton from "./components/export-button";
import styles from './componentStyles/shared-layout.module.css';

// Component list: header, navigation, buttons, interactive table

// Header component
function Header ({ title }) {
      return (<h1>{title ? title : 'Default Title'}</h1>);
}

// Export default Home component (Next.js will use this for the page)
export default function Home () {
  const [uploadedData, setUploadedData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [mode, setMode] = useState('');
  const [tableSelector, setTableSelector] = useState('hr');

  // Determine which data to show
  let dataToShow = [];
  if (mode === 'upload') {
    dataToShow = uploadedData;
  } else if (mode === 'search') {
    dataToShow = searchResults;
  } else if (mode === 'report') {
    dataToShow = reportData; 
  }

  return (
    <div>
      <Header title="Cross-Db Analysis Tool" />
      <div className={styles.toolbar}>
        <TableSelector setTableSelection={setTableSelector} />

        <UploadButton setUploadedData={(data) => {
          setUploadedData(data);
          setMode('upload');
        }} tableSelection={tableSelector} />

        <SearchBar setSearchResults={(data) => {
          setSearchResults(data);
          setMode('search');
        }} tableSelection={tableSelector} />

        <ReportMenu setReportData={(data) => {
          setReportData(data);
          setMode('report');
        }} />

        <ExportButton exportData={reportData} />
      </div>
      {/* DataTable below toolbar */}
      {(dataToShow.length > 0) && (
        <div className={styles.dataTableWrapper}>
          <DataTable data={dataToShow} />
        </div>
      )}
    </div>
  );
}

