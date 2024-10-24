import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import './Salary_Details.css'; // Add your CSS styles if any

const SalaryDetails = () => {
    const { id } = useParams(); // Get the employee ID from the URL parameters
    const [employee, setEmployee] = useState(null);
    const [salary, setSalary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchEmployeeDetails = async () => {
        setLoading(true); // Set loading to true at the start
        try {
            console.log("Fetching details for employee ID:", id);
            const employeeResponse = await axios.get(`http://localhost:5000/employees/${id}`);
            setEmployee(employeeResponse.data);

            const salaryResponse = await axios.get(`http://localhost:5000/salaries/${id}`);
            setSalary(salaryResponse.data);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 404) {
                    setErrorMessage('Employee not found');
                } else {
                    setErrorMessage(`Error fetching details: ${error.response.data.message}`);
                }
            } else {
                // Something happened in setting up the request that triggered an Error
                setErrorMessage(`Error fetching details: ${error.message}`);
            }
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchEmployeeDetails();
    }, [id]); // Fetch details when the component mounts or when the id changes

    if (loading) {
        return <div>Loading...</div>; // Display loading message
    }

    if (errorMessage) {
        return <div>{errorMessage}</div>; // Display error message
    }

    return (
        <div className="salary-details">
            {employee && (
                <div>
                    <img
                        src={`http://localhost:5000/${employee.photo}`}
                        alt={`${employee.fullName}'s photo`}
                        style={{ width: '100px', height: '150px' }}
                    />
                    <h2>{employee.fullName}</h2>
                    <p><strong>Employee ID:</strong> {employee.employeeID}</p>
                    <p><strong>Department:</strong> {employee.department}</p>
                    <p><strong>Present Count:</strong> {salary?.presentCount || 'N/A'}</p>
                    <p><strong>Absent:</strong> {salary?.absent || 'N/A'}</p>
                </div>
            )}
            {salary && (
                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>Net Salary</th>
                            <th>Basic</th>
                            <th>Home Rent</th>
                            <th>Medical</th>
                            <th>Travel</th>
                            <th>PF</th>
                            <th>Hajira</th>
                            <th>Over Time</th>
                            <th>Eid Bonus</th>
                            <th>Total</th>
                            <th>Welfare</th>
                            <th>Grand Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{salary.netSalary}</td>
                            <td>{salary.basic}</td>
                            <td>{salary.homeRent}</td>
                            <td>{salary.medical}</td>
                            <td>{salary.travel}</td>
                            <td>{salary.pf}</td>
                            <td>{salary.hajira}</td>
                            <td>{salary.overTime}</td>
                            <td>{salary.eidBonus}</td>
                            <td>{salary.basic + salary.homeRent + salary.medical + salary.travel + salary.welfare + salary.hajira + salary.overTime + salary.eidBonus}</td>
                            <td>{salary.welfare}</td>
                            <td>{(salary.basic + salary.homeRent + salary.medical + salary.travel + salary.welfare + salary.hajira + salary.overTime + salary.eidBonus) - salary.advDeduct}</td> {/* Grand Total */}
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SalaryDetails;
