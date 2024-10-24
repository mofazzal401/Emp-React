import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from '../Header/Header';

const Emp_Report = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [designations, setdesignations] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [designationFilter, setdesignationFilter] = useState('');
  const [nameSearch, setNameSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('https://emp-backend-rffv.onrender.com/employees'); // Replace with actual URL
        const employeeData = response.data;
        setEmployees(employeeData);
        setFilteredEmployees(employeeData);

        // Extract unique departments from employee data
        const uniqueDepartments = [...new Set(employeeData.map(emp => emp.department))];
        setDepartments(uniqueDepartments);
         // Extract unique departments from employee data
         const uniquedesignation= [...new Set(employeeData.map(emp => emp.designation))];
         setdesignations(uniquedesignation);
        
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle filtering by department
  const handleDepartmentChange = (e) => {
    setDepartmentFilter(e.target.value);
  };
    // Handle filtering by designation
    const handledesignationChange = (e) => {
      setdesignationFilter(e.target.value);
    };
  

  // Handle searching by name
  const handleNameSearch = (e) => {
    setNameSearch(e.target.value);
  };

  // Apply filters whenever department or name changes
  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const matchesDepartment = departmentFilter ? employee.department === departmentFilter : true;
      const matchesdesignation = designationFilter ? employee.designation === designationFilter : true;
      const matchesName = nameSearch ? employee.fullName.toLowerCase().includes(nameSearch.toLowerCase()) : true;
      return matchesDepartment && matchesdesignation && matchesName;
    });
    setFilteredEmployees(filtered);
  }, [departmentFilter,designationFilter, nameSearch, employees]);

  const handleDetails = (id) => {
    navigate(`/details/${id}`);
  };

  // Function to get Bootstrap class based on status
  const getStatusClass = (status) => {
    return status === 'Active' ? 'bg-success-subtle text-success p-2' : 'bg-danger-subtle text-danger p-2';
  };

  return (
    <div className="container">
      <Header />
      <div className='text-center mb-11'>
      <h5 className='justify-center'>FNS Employee Report</h5>
      </div>
      {/* Filter Section */}
      <div className="row mb-3 columns-6">
        <div className="col-md-4">
          <label htmlFor="departmentFilter"></label>
          <select
            id="departmentFilter"
            className="form-control"
            value={departmentFilter}
            onChange={handleDepartmentChange}
          >
            <option value="">All Departments</option>
            {departments.map(department => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div><div className="col-md-4">
          <label htmlFor="designationFilter"></label>
          <select
            id="designationFilter"
            className="form-control"
            value={designationFilter}
            onChange={handledesignationChange}
          >
            <option value="">All Designation</option>
            {designations.map(designation => (
              <option key={designation} value={designation}>
                {designation}
              </option>
            ))}
          </select>
        </div>
        
        <div className="col-md-4">
          <label htmlFor="nameSearch"></label>
          <input
            type="text"
            id="nameSearch"
            className="form-control"
            placeholder="Search by Name...."
            value={nameSearch}
            onChange={handleNameSearch}
          />
        </div>
      </div>
      {/* Employee Table */}
      <table className="table table-striped p-0">
        <thead>
          <tr>
            <th>SL</th>
            <th>Photo</th>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Department</th>
            <th>Gender</th>
            <th>Net Salary</th>
            <th>Date of Joining</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map((employee, index) => (
            <tr key={employee._id}>
              <td>{index + 1}</td>
              <td>
  {employee.photo ? (
    <img
      src={`http://localhost:5000/${employee.photo}`}
      alt={`${employee.fullName}'s photo`}
      style={{ width: '50px', height: '50px', borderRadius: '50%' }}
      onClick={() => window.open(`/details/${employee._id}`, '_blank')}  // Open in a new tab
      id="img"
    />
  ) : (
    <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#ccc' }} />
  )}
</td>

              <td >{employee.employeeID}</td>
              <td onClick={() => window.open(`/details/${employee._id}`, '_blank')}>{employee.fullName}</td>
              <td>{employee.department}</td>
              <td>{employee.gender}</td>
              <td>{employee.netSalary}</td>
              <td>{new Date(employee.dateOfJoining).toLocaleDateString()}</td>
              <td>
                <span className={`badge ${getStatusClass(employee.Status)}`}>
                  {employee.Status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Emp_Report;
