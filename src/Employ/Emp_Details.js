import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Header from '../Header/Header';
import './Emp_Details.css'


const Details = () => {
  const { id } = useParams(); // Get employee ID from route params
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({});
  const [deleteModal, setDeleteModal] = useState(false); // Show/Hide delete modal
  const [inputName, setInputName] = useState(''); // Input for delete confirmation
  const [previewImage, setPreviewImage] = useState(null); // Image preview

  useEffect(() => {
    // Fetch employee data by ID
    axios.get(`https://emp-backend-rffv.onrender.com/employees/${id}`)
      .then(response => {
        setEmployee(response.data);
      })
      .catch(error => {
        console.error('Error fetching employee:', error);
      });
  }, [id]);

  // const Details = () => {
  //   const navigate = useNavigate();
  //   const id = ...; // retrieve your ID from props or state

    const handleEdit = () => {
        navigate(`/edit/${id}`);
    };

  // Handle delete confirmation
  const handleDelete = () => {
    if (inputName === employee.fullName) {
      axios.delete(`https://emp-backend-rffv.onrender.com/employees/${id}`)
        .then(() => {
          alert('Employee deleted successfully');
          navigate('/employ-report'); // Navigate back to the employee report
        })
        .catch(error => {
          console.error('Error deleting employee:', error);
        });
    } else {
      alert('Name does not match. Please enter the correct name to delete.');
    }
  };

  return (
    <div className="container mt-5">
      <Header/>
      <h2>Employee Details</h2>

      {/* Employee Details Table */}
      <table className="Emp_Details table table-bordered">
        <tbody>
          <tr>
            <th>Full Name</th>
            <td>{employee.fullName}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>{employee.dateOfBirth}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{employee.gender}</td>
          </tr>
          <tr>
            <th>Marital Status</th>
            <td>{employee.maritalStatus}</td>
          </tr>
          <tr>
            <th>Nationality</th>
            <td>{employee.nationality}</td>
          </tr>
          <tr>
            <th>Contact Number</th>
            <td>{employee.contactNumber}</td>
          </tr>
          <tr>
            <th>Email Address</th>
            <td>{employee.emailAddress}</td>
          </tr>
          <tr>
            <th>Address</th>
            <td>{employee.address}</td>
          </tr>
          <tr>
            <th>Employee ID</th>
            <td>{employee.employeeID}</td>
          </tr>
          <tr>
            <th>Department</th>
            <td>{employee.department}</td>
          </tr>
          <tr>
            <th>Designation</th>
            <td>{employee.designation}</td>
          </tr>
          <tr>
            <th>Date of Joining</th>
            <td>{employee.dateOfJoining}</td>
          </tr>
          <tr>
            <th>Employment Type</th>
            <td>{employee.employmentType}</td>
          </tr>
          <tr>
            <th>Net Salary</th>
            <td>{employee.netSalary}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{employee.Status}</td>
          </tr>
          <tr>
            <th>Education</th>
            <td>{employee.education}</td>
          </tr>
          <tr>
            <th>Photo</th>
            <td>
              {employee.photo ? (
                <img
                  src={`http://localhost:5000/${employee.photo}`}
                  alt="Employee"
                  className="img-thumbnail"
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => setPreviewImage(`http://localhost:5000/${employee.photo}`)} // Image preview
                />
              ) : 'No Photo'}
            </td>
          </tr>
          <tr>
            <th>NID Photo</th>
            <td>
              {employee.nidPhoto ? (
                <img
                  src={`http://localhost:5000/${employee.nidPhoto}`}
                  alt="NID Photo"
                  className="img-thumbnail"
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => setPreviewImage(`http://localhost:5000/${employee.nidPhoto}`)} // Image preview
                />
              ) : 'No NID Photo'}
            </td>
          </tr>
          <tr>
            <th>Certificate Copy</th>
            <td>
              {employee.certificateCopy ? (
                <img
                  src={`http://localhost:5000/${employee.certificateCopy}`}
                  alt="Certificate Copy"
                  className="img-thumbnail"
                  style={{ width: '100px', cursor: 'pointer' }}
                  onClick={() => setPreviewImage(`http://localhost:5000/${employee.certificateCopy}`)} // Image preview
                />
              ) : 'No Certificate Copy'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      <div className="mt-3">
        <button className="btn btn-secondary" onClick={() => navigate('/employ-report')}>Back</button>
        <button className="btn btn-warning mx-2" onClick={handleEdit}>Edit</button>
        <button className="btn btn-danger"  onClick={() => setDeleteModal(true)}>Delete</button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModal} onHide={() => setDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To delete this employee, please enter their name ({employee.fullName}):</p>
          <input
            type="text"
            className="form-control"
            placeholder="Enter full name"
            value={inputName}
            onChange={e => setInputName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete}>Delete</Button>
        </Modal.Footer>
      </Modal>

      {/* Image Preview Modal */}
      {previewImage && (
        <Modal show={true} onHide={() => setPreviewImage(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Image Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={previewImage} alt="Preview" className="img-fluid" />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default Details;
