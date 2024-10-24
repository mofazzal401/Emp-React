import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../Header/Header';

const AddEmploy = () => {
  const [formData, setFormData] = useState({
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
    designation: '', // Add designation here
    pondNumber: '',
    dateOfJoining: '',
    employmentType: '',
    netSalary: '',
    Status: '',
    education: '',
    photo: null,
    nidPhoto: null,
    certificateCopy: null,
  });

  const [fileError, setFileError] = useState('');
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showEmploymentDetails, setShowEmploymentDetails] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      const file = files[0];

      if (file.size > 100 * 1024) { // 100KB limit
        setFileError('File size must be under 100KB.');
        setFormData((prevState) => ({
          ...prevState,
          [name]: null,
        }));
      } else {
        setFileError('');
        setFormData((prevState) => ({
          ...prevState,
          [name]: file,
        }));
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fileSizesValid = [
      formData.photo,
      formData.nidPhoto,
      formData.certificateCopy,
    ].every((file) => !file || file.size <= 100 * 1024); // 100KB limit

    if (!fileSizesValid) {
      alert('One or more files exceed the size limit of 100KB. Please reduce the file size and try again.');
      return; // Prevent submission
    }

    const form = new FormData();

    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://emp-backend-rffv.onrender.com/employees', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Data Save Confirm: ' + response.data);
      setFormData({
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
        pondNumber: '',
        dateOfJoining: '',
        employmentType: '',
        netSalary: '',
        Status: '',
        education: '',
        photo: null,
        nidPhoto: null,
        certificateCopy: null,
      });
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data: ' + error.response.data);
    }
  };

  const shouldShowPondNumber = formData.department === 'Farm Employ' || formData.department === 'Pond Labor';

  return (
    <div>
      <Header />
      <div className="container mt-5 col-8">
        <h4 className=' text-center text-lime-900'>Add Employee</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <button type="button" className="btn bg-success-subtle text-success col-4" onClick={() => setShowPersonalInfo(!showPersonalInfo)}>
              {showPersonalInfo ? 'Hide Personal Information' : 'Show Personal Information'}
            </button>
            {showPersonalInfo && (
              <div className="border p-3 mt-2">
                <h5>Personal Information</h5>
                <input type="text" name="fullName" placeholder="Full Name" className="form-control" value={formData.fullName} onChange={handleChange} required />
                <input type="date" name="dateOfBirth" className="form-control mt-2" value={formData.dateOfBirth} onChange={handleChange} required />
                <select name="gender" className="form-select mt-2" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <select name="maritalStatus" className="form-select mt-2" value={formData.maritalStatus} onChange={handleChange} required>
                  <option value="">Select Marital Status</option>
                  <option value="Married">Married</option>
                  <option value="Unmarried">Unmarried</option>
                </select>
                <input type="text" name="nationality" placeholder="Nationality" className="form-control mt-2" value={formData.nationality} onChange={handleChange} />
                <input type="text" name="contactNumber" placeholder="Contact Number" className="form-control mt-2" value={formData.contactNumber} onChange={handleChange} required />
                <input type="email" name="emailAddress" placeholder="Email Address" className="form-control mt-2" value={formData.emailAddress} onChange={handleChange} />
                <textarea name="address" placeholder="Address" className="form-control mt-2" value={formData.address} onChange={handleChange} required></textarea>
              </div>
            )}
          </div>

          <div className="mb-3">
            <button type="button" className="btn bg-success-subtle text-success col-4" onClick={() => setShowEmploymentDetails(!showEmploymentDetails)}>
              {showEmploymentDetails ? 'Hide Employment Details' : 'Show Employment Details'}
            </button>
            {showEmploymentDetails && (
              <div className="border p-3 mt-2">
                <h5>Employment Details</h5>
                <input type="text" name="employeeID" placeholder="Employee ID" className="form-control" value={formData.employeeID} onChange={handleChange} required />
                <select name="department" className="form-select mt-2" value={formData.department} onChange={handleChange} required>
                  <option value="">Select Department</option>
                  <option value="Office">Office Staff</option>
                  <option value="Operator & Other">Operator & Other</option>
                  <option value="Processing Employ">Processing Employ</option>
                  <option value="Farm Employ">Farm Employ</option>
                  <option value="Pond Labor">Pond Labor</option>
                </select>

                <select name="designation" className="form-select mt-2" value={formData.designation} onChange={handleChange} >
                  <option value="">Select Designation</option>
                  <option value="General Manager (GM)">General Manager (GM)</option>
                  <option value="Operations Manager">Operations Manager</option>
                  <option value="Project Manager">Project Manager</option>
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Business Analyst">Business Analyst</option>
                  <option value="Human Resources (HR) Manager">Human Resources (HR) Manager</option>
                  <option value="Marketing Manager">Marketing Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Customer Service Manager">Customer Service Manager</option>
                  <option value="Administrative Assistant">Administrative Assistant</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Finance Analyst">Finance Analyst</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Quality Assurance (QA) Engineer">Quality Assurance (QA) Engineer</option>
                  <option value="Security Gard">Security Gard</option>
                  <option value="Receptionist">Receptionist</option>
                  <option value="Driver">Driver</option>
                  <option value="Driver Helper">Driver Helper</option>
                  <option value="Warehouse Manager">Warehouse Manager</option>
                </select>

                {/* Conditionally render Pond Number based on selected department */}
                {shouldShowPondNumber && (
                  <select name="pondNumber" className="form-select mt-2" value={formData.pondNumber} onChange={handleChange} required>
                    <option value="">Select Pond</option>
                    <option value="Pond 01">Pond 01</option>
                    <option value="Pond 02">Pond 02</option>
                    <option value="Pond 03">Pond 03</option>
                    <option value="Pond 04">Pond 04</option>
                    <option value="Pond 05">Pond 05</option>
                    <option value="Pond 07">Pond 07</option>
                    <option value="Pond 08">Pond 08</option>
                    <option value="Pond 09">Pond 09</option>
                    <option value="Pond 10">Pond 10</option>
                    <option value="Pond 11">Pond 11</option>
                  </select>
                )}

                <input type="date" name="dateOfJoining" className="form-control mt-2" value={formData.dateOfJoining} onChange={handleChange} required />
                <select name="employmentType" className="form-select mt-2" value={formData.employmentType} onChange={handleChange}>
                  <option value="">Select Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                </select>
                <input type="text" name="education" placeholder="Education and Qualifications" className="form-control mt-2" value={formData.education} onChange={handleChange} required />
                <input type="text" name="netSalary" placeholder="Net Salary" className="form-control mt-2" value={formData.netSalary} onChange={handleChange} required />
                <select name="Status" className="form-select mt-2" value={formData.Status} onChange={handleChange} required>
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}
          </div>

          <div className="mb-3">
            <button type="button" className="btn bg-success-subtle text-success col-4" onClick={() => setShowFileUpload(!showFileUpload)}>
              {showFileUpload ? 'Hide Attach Files' : 'Show Attach Files'}
            </button>
            {showFileUpload && (
              <div className="border p-3 mt-2">
                <h5>Attach Files</h5>
                <input type="file" name="photo" className="form-control" onChange={handleChange} required />
                <input type="file" name="nidPhoto" className="form-control mt-2" onChange={handleChange} />
                <input type="file" name="certificateCopy" className="form-control mt-2" onChange={handleChange} />
                {fileError && <div className="text-danger mt-2">{fileError}</div>}
              </div>
            )}
          </div>

          <div className="d-flex justify-content-between">
            <button type="reset" className="btn btn-secondary col-2">Clear</button>
            <button type="submit" className="btn btn-success col-2 ">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmploy;
