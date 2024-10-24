import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { utils, writeFile } from 'xlsx'; // Importing xlsx package
import './Salary_Sheet.css';
import Header from '../Header/Header';  // Import the Header component

const SalarySheet = () => {
    // State variables
    const [selectedDate, setSelectedDate] = useState(''); // To manage selected date
    const [showReport, setShowReport] = useState(false);  // To control report visibility
    const [groupedSalaries, setGroupedSalaries] = useState({});  // To store salaries grouped by department

    // Function to group salaries by department
    const groupSalariesByDepartment = useCallback((salaries) => {
        const grouped = salaries.reduce((acc, salary) => {
            const department = salary.department || 'Unknown';
            if (!acc[department]) {
                acc[department] = [];
            }
            acc[department].push(salary);
            return acc;
        }, {});
        setGroupedSalaries(grouped);
    }, []);

    // Function to fetch salary data and filter by date
    const fetchSalaryData = useCallback(async () => {
        try {
            const response = await axios.get('https://emp-backend-rffv.onrender.com/salaries');
            let filteredSalaries = response.data;

            if (selectedDate) {
                filteredSalaries = filteredSalaries.filter(salary =>
                    new Date(salary.date).toISOString().split('T')[0] === selectedDate
                );
            }

            const sortedSalaries = filteredSalaries.sort((a, b) => new Date(b.date) - new Date(a.date));
            groupSalariesByDepartment(sortedSalaries);
            setShowReport(true);  // Show report once the data is fetched
        } catch (error) {
            console.error('Error fetching salary data:', error);
        }
    }, [selectedDate, groupSalariesByDepartment]);

    // Handle click to generate report
    const handleReportClick = () => {
        fetchSalaryData();
    };

    // Handle print action
    const handlePrintClick = () => {
        window.print();  // Trigger print action
    };


// Function to export the table to Excel with styling
const handleExcelExport = () => {
    // Create an array of data for each department
    let excelData = [];

    // Add an overarching header
    excelData.push(['Company Name', 'Salary Sheet', 'Date:', selectedDate]);
    excelData.push([]); // Empty row after the overarching header

    // Add styled header and data for each department
    Object.keys(groupedSalaries).forEach(department => {
        excelData.push([`${department} Department`]); // Department Name
        excelData.push(['SL', 'ID_NO', 'NAME', 'Pre_Day', 'BASIC', 'H.RENT', 'MEDICAL', 'T.A', 'ATT. B', 'TOTAL GROSS SALARY', 'O.T', 'F.B', 'PF', 'ADV', 'Welfare', 'NET PAYABLE', 'SIGNATURE']); // Header Row

        groupedSalaries[department].forEach((salary, index) => {
            excelData.push([
                index + 1,
                salary.employeeID,
                salary.fullName,
                salary.presentCount,
                formatNumber(salary.basic),
                formatNumber(salary.homeRent),
                formatNumber(salary.medical),
                formatNumber(salary.travel),
                formatNumber(salary.hajira),
                formatNumber(salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira),
                formatNumber(salary.overTime),
                formatNumber(salary.eidBonus),
                formatNumber(salary.pf),
                formatNumber(salary.advDeduct),
                formatNumber(salary.welfare),
                formatNumber((salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira) - (salary.pf + salary.advDeduct + salary.welfare)),
                ''
            ]);
        });

        // Subtotal Row
        excelData.push([
            'SUBTOTAL',
            '',
            '',
            '',
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.basic, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.homeRent, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.medical, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.travel, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.hajira, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.overTime, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.eidBonus, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.pf, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.advDeduct, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.welfare, 0)),
            formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + (salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira) - (salary.pf + salary.advDeduct + salary.welfare), 0)),
            ''
        ]);

        excelData.push([]); // Empty row between departments
    });

    // Convert the array to a worksheet
    const ws = utils.aoa_to_sheet(excelData);

    // Add styles for headers, cells, and subtotal row
    const range = utils.decode_range(ws['!ref']); // Get the range of the worksheet
    for (let R = range.s.r; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell_address = utils.encode_cell({ r: R, c: C });
            if (!ws[cell_address]) continue;

            ws[cell_address].s = { // Style for each cell
                border: {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' }
                },
                alignment: { horizontal: 'center', vertical: 'center' }
            };

            // Apply overarching header style (First row)
            if (R === 0) {
                ws[cell_address].s.fill = {
                    fgColor: { rgb: 'CCCCFF' } // Light blue for the overarching header
                };
                ws[cell_address].s.font = {
                    bold: true
                };
            }

            // Apply department header style (Rows where the header is present)
            if (R === 2 || (R > 2 && excelData[R-1][0] === 'SUBTOTAL')) {
                ws[cell_address].s.fill = {
                    fgColor: { rgb: 'FFFF00' } // Yellow color for headers and subtotal
                };
                ws[cell_address].s.font = {
                    bold: true
                };
            }
        }
    }

    // Adjust column widths automatically to fit content
    const cols = excelData[2].map((_, index) => ({
        wch: Math.max(...excelData.map(row => (row[index] ? row[index].toString().length : 0))) + 2 // Adjust width
    }));
    ws['!cols'] = cols;

    // Create a new workbook
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, 'Salary Sheet');

    // Export the workbook to an Excel file
    writeFile(wb, 'Salary_Sheet.xlsx');
};



    return (
        <div className="salary-report container mt-4">
            {/* Print Header */}
            <Header />

            {/* Date Filter and Report Button */}
            <div className='card no-print mt-4'>
                <div className="d-flex justify-content-center align-items-center m-3"> 
                    <label htmlFor="date" className="mr-2 mt-2"><h6>Select Date:</h6></label>
                    <div className='col-3 m-2'>
                        <input 
                            type="date" 
                            id="date" 
                            className="form-control flex-grow-1 mr-3"
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.target.value)} 
                        />
                    </div>
                    <button className="btn btn-success col-1 m-0 font-bold" onClick={handleReportClick}>Report</button>
                </div>
            </div>

            {/* Print Button */}
            {showReport && (
                <div className="d-flex justify-content-end mb-3 no-print">
                    <button className="btn btn-secondary mr-2" onClick={handlePrintClick}>
                        Print
                    </button>
                    <button className="btn btn-secondary" onClick={handleExcelExport}>
                        Excel
                    </button>
                </div>
            )}

            {/* Salary Report Table */}
            {showReport ? (
                <div className="print-area">
                    {Object.keys(groupedSalaries).map((department, deptIndex) => (
                        <div key={deptIndex} className="department-section mb-4">
                            <h4>{department} Department</h4> {/* Department Name at the top */}

                            <table className=" Sheet table table-bordered border-secondary table-hover">
                                <thead>
                                    <tr className='h-2'>
                                        <th rowSpan="2">SL</th>
                                        <th rowSpan="2">ID_NO</th>
                                        <th rowSpan="2"> Employee_NAME</th>
                                        <th rowSpan="2">Pre_Day</th>
                                        <th colSpan="5">GROSS SALARY</th>
                                        <th rowSpan="2">TOTAL GROSS SALARY</th>
                                        <th colSpan="2">E.EARNINGS</th>
                                        <th colSpan="3">DEDUCTION</th>
                                        <th rowSpan="2">NET PAYABLE</th>
                                        <th rowSpan="2"  id="special-header">SIGNATURE</th>
                                    </tr>
                                    <tr>
                                        <th>BASIC</th>
                                        <th>H.RENT</th>
                                        <th>MEDICAL</th>
                                        <th>T.A</th>
                                        <th>ATT_B</th>
                                        <th>O.T</th>
                                        <th>F.B</th>
                                        <th>PF</th>
                                        <th>ADV</th>
                                        <th>Welfare</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {groupedSalaries[department].length > 0 ? (
                                        groupedSalaries[department].map((salary, index) => (
                                            <tr key={salary._id}>
                                                <td>{index + 1}</td>
                                                <td>{salary.employeeID}</td>
                                                <td>{salary.fullName}</td>
                                                <td>{salary.presentCount}</td>
                                                <td>{formatNumber(salary.basic)}</td>
                                                <td>{formatNumber(salary.homeRent)}</td>
                                                <td>{formatNumber(salary.medical)}</td>
                                                <td>{formatNumber(salary.travel)}</td>
                                                <td>{formatNumber(salary.hajira)}</td>
                                                <td>{formatNumber(salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira)}</td>
                                                <td>{formatNumber(salary.overTime)}</td>
                                                <td>{formatNumber(salary.eidBonus)}</td>
                                                <td>{formatNumber(salary.pf)}</td>
                                                <td>{formatNumber(salary.advDeduct)}</td>
                                                <td>{formatNumber(salary.welfare)}</td>
                                                <td>{formatNumber((salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira) - (salary.pf + salary.advDeduct + salary.welfare))}</td>
                                                <td></td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="17" className="text-center">No data available</td>
                                        </tr>
                                    )}

                                    {/* Subtotal Row */}
                                    <tr className="subtotal-row font-bold bg-slate-500">
                                        <td colSpan="4" className="text-right"><strong>SUBTOTAL</strong></td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.basic, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.homeRent, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.medical, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.travel, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.hajira, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.overTime, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.eidBonus, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.pf, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.advDeduct, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + salary.welfare, 0))}</td>
                                        <td>{formatNumber(groupedSalaries[department].reduce((sum, salary) => sum + (salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira) - (salary.pf + salary.advDeduct + salary.welfare), 0))}</td>
                                        <td>---</td> {/* Empty for Signature */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

// Format number function
const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(num);
};

export default SalarySheet;
