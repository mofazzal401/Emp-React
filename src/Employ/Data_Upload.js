import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ExcelUploader() {
    const [excelData, setExcelData] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);

    // Handle Excel File Upload
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);

        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            setExcelData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    // Handle Excel Data Upload to MongoDB
    const handleUpload = async () => {
        if (excelData.length === 0) {
            alert('Please upload a valid Excel file.');
            return;
        }

        // Convert the excel data into objects to send to MongoDB
        const formattedData = excelData.slice(1).map((row) => ({
            fullName: row[0],
            dateOfBirth: row[1],
            gender: row[2],
            maritalStatus: row[3],
            nationality: row[4],
            contactNumber: row[5],
            emailAddress: row[6],
            address: row[7],
            employeeID: row[8],
            department: row[9],
            designation: row[10],
            pondNumber: row[11],
            dateOfJoining: row[12],
            employmentType: row[13],
            netSalary: row[14],
            Status: row[15],
            education: row[16],
            photo: row[17] || null,
            nidPhoto: row[18] || null,
            certificateCopy: row[19] || null,
        }));

        const payload = Array.isArray(formattedData) ? formattedData : [formattedData]; // Ensure it's an array

        try {
            console.log("Payload being sent:", payload);
            const response = await axios.post('https://emp-backend-rffv.onrender.com/employees/upload', payload);
            if (response.status === 201) {
                alert('Data uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading data', error.response?.data || error.message);
            alert('Failed to upload data: ' + (error.response?.data?.message || error.message));
        }
    };

    // Sample Excel Download
    const handleDownloadSample = () => {
        const worksheet = XLSX.utils.aoa_to_sheet([
            ['fullName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationality', 'contactNumber', 'emailAddress', 'address', 'employeeID', 'department', 'designation', 'pondNumber', 'dateOfJoining', 'employmentType', 'netSalary', 'Status', 'education', 'photo', 'nidPhoto', 'certificateCopy'],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''] // Sample row
        ]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sample');
        XLSX.writeFile(workbook, 'Employee_Sample.xlsx');
    };

    return (
        <div className="container">
            <h3 className="text-center mt-4 mb-4">Upload Employee Data</h3>
            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Select Excel File</Form.Label>
                <Form.Control type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
            </Form.Group>

            <div className="text-center">
                <Button className="btn btn-primary me-3" onClick={handleUpload}>Upload Data</Button>
                <Button className="btn btn-secondary" onClick={handleDownloadSample}>Download Sample Excel</Button>
            </div>
        </div>
    );
}

export default ExcelUploader;
