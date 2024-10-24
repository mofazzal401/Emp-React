import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Employ_Edit = () => {
    const { id } = useParams(); // Get the ID from the URL
    const navigate = useNavigate();
    const [employeeData, setEmployeeData] = useState({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        maritalStatus: '',
        nationality: '',
        contactNumber: '',
        emailAddress: '',
        address: '',
        employeeID: '',
        department: '',
        designation: '',
        dateOfJoining: '',
        employmentType: '',
        netSalary: '', // Ensure this is included
        education: '',
        status: '', // Ensure this is included
        photo: null,
        nidPhoto: null,
        certificateCopy: null,
    });

    // Fetch employee data when component mounts
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/employees/${id}`);
                setEmployeeData(response.data);
            } catch (error) {
                console.error("Error fetching employee data:", error);
            }
        };

        fetchEmployeeData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData({ ...employeeData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setEmployeeData({ ...employeeData, [name]: files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append data to FormData
        for (const key in employeeData) {
            formData.append(key, employeeData[key]);
        }

        try {
            await axios.put(`http://localhost:5000/employees/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Employee updated successfully');
            navigate('/employ-report'); // Navigate back to the employee report page
        } catch (error) {
            console.error("Error updating employee data:", error);
            alert('Error updating employee data');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Edit Employee</h2>
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Personal Information</legend>
                    <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">Full Name</label>
                        <input type="text" className="form-control" id="fullName" name="fullName" value={employeeData.fullName} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                        <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" value={employeeData.dateOfBirth.split('T')[0]} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">Gender</label>
                        <select className="form-select" id="gender" name="gender" value={employeeData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="maritalStatus" className="form-label">Marital Status</label>
                        <select className="form-select" id="maritalStatus" name="maritalStatus" value={employeeData.maritalStatus} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Married">Married</option>
                            <option value="Unmarried">Unmarried</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nationality" className="form-label">Nationality</label>
                        <input type="text" className="form-control" id="nationality" name="nationality" value={employeeData.nationality} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                        <input type="tel" className="form-control" id="contactNumber" name="contactNumber" value={employeeData.contactNumber} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailAddress" className="form-label">Email Address</label>
                        <input type="email" className="form-control" id="emailAddress" name="emailAddress" value={employeeData.emailAddress} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <textarea className="form-control" id="address" name="address" value={employeeData.address} onChange={handleChange} required></textarea>
                    </div>
                </fieldset>

                <fieldset className="mt-4">
                    <legend>Employment Details</legend>
                    <div className="mb-3">
                        <label htmlFor="employeeID" className="form-label">Employee ID</label>
                        <input type="text" className="form-control" id="employeeID" name="employeeID" value={employeeData.employeeID} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="department" className="form-label">Department</label>
                        <input type="text" className="form-control" id="department" name="department" value={employeeData.department} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="designation" className="form-label">Designation/Job Title</label>
                        <input type="text" className="form-control" id="designation" name="designation" value={employeeData.designation} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="dateOfJoining" className="form-label">Date of Joining</label>
                        <input type="date" className="form-control" id="dateOfJoining" name="dateOfJoining" value={employeeData.dateOfJoining.split('T')[0]} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="employmentType" className="form-label">Type of Employment</label>
                        <select className="form-select" id="employmentType" name="employmentType" value={employeeData.employmentType} onChange={handleChange} required>
                            <option value="">Select Type</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="netSalary" className="form-label">Net Salary</label>
                        <input type="number" className="form-control" id="netSalary" name="netSalary" value={employeeData.netSalary} onChange={handleChange} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="education" className="form-label">Education and Qualifications</label>
                        <textarea className="form-control" id="education" name="education" value={employeeData.education} onChange={handleChange} required></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="status" className="form-label">Status</label>
                        <select className="form-select" id="status" name="status" value={employeeData.Status} onChange={handleChange} required>
                            <option value="">Select Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset className="mt-4">
                    <legend>Attach File</legend>
                    <div className="mb-3">
                        <label htmlFor="photo" className="form-label">Photo</label>
                        <input type="file" className="form-control" id="photo" name="photo" onChange={handleFileChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nidPhoto" className="form-label">NID Photo</label>
                        <input type="file" className="form-control" id="nidPhoto" name="nidPhoto" onChange={handleFileChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="certificateCopy" className="form-label">Certificate Copy</label>
                        <input type="file" className="form-control" id="certificateCopy" name="certificateCopy" onChange={handleFileChange} />
                    </div>
                </fieldset>

                <button type="submit" className="btn btn-primary mt-4">Update Employee</button>
            </form>
        </div>
    );
};

export default Employ_Edit;
