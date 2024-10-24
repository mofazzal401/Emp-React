// Salary_Report.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // For navigation
import './Salary_Report.css';

const SalaryReport = () => {
    //////Employ
    const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://emp-backend-rffv.onrender.com/employees'); // Replace with actual URL
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };
    fetchEmployees();
  }, []);
  ///////////////////

    const [salaries, setSalaries] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchSalaryData = async () => {
        try {
            const response = await axios.get('https://emp-backend-rffv.onrender.com/salaries');
            const sortedSalaries = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setSalaries(sortedSalaries);
        } catch (error) {
            console.error('Error fetching salary data:', error);
            setErrorMessage('Error fetching salary data');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };

    useEffect(() => {
        fetchSalaryData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://emp-backend-rffv.onrender.com/salaries/${id}`);
            fetchSalaryData();
        } catch (error) {
            console.error('Error deleting salary entry:', error);
            setErrorMessage('Error deleting salary entry');
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const formatNumber = (num) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    return (
        <div className="salary-report">
            <h2>Salary Report</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <table className="table table-bordered w-20">
                <thead>
                    <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Employee ID</th>
                        <th>Full Name</th>
                        <th>Department</th>
                        <th>Present Count</th>
                        <th>Net Salary</th>
                        <th>Gross Amount</th>
                        <th>Deduct</th>
                        <th>Net Payable</th>
                        <th>Absent</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salaries.length > 0 ? (
                        salaries.map((salary, index) => (
                            <tr key={salary._id}>
                                <td>{index + 1}</td>
                                <td>{formatDate(salary.date)}</td>
                                <td>{salary.employeeID}</td>
                                <td>{salary.fullName}</td>
                                <td>{salary.department}</td>
                                <td>{salary.presentCount}</td>
                                <td>{formatNumber(salary.salaryNet)}</td>
                                <td>{formatNumber(salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira + salary.overTime + salary.eidBonus)}</td>
                                <td>{formatNumber(salary.pf + salary.advDeduct + salary.welfare )}</td>
                                <td>{formatNumber((salary.basic + salary.homeRent + salary.medical + salary.travel + salary.hajira + salary.overTime + salary.eidBonus) - (salary.pf + salary.advDeduct + salary.welfare) )}</td>
                                <td>{salary.absent}</td>
                                <td>
                                    <Link to={`/salary-details/${salary._id}`}>
                                        <button className="btn btn-info">Details</button>
                                    </Link>
                                    <button className="btn btn-danger" onClick={() => handleDelete(salary._id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="12" className="text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SalaryReport;
