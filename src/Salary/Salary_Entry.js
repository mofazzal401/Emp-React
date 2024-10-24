import React, { useState, useEffect } from "react";
import axios from "axios";
import './Salary_Entry.css'

const SalaryEntry = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [formData, setFormData] = useState([]);
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [allWelfareChecked, setAllWelfareChecked] = useState(false);
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    axios
      .get("https://emp-backend-rffv.onrender.com/employees")
      .then((response) => {
        const activeEmployees = response.data.filter(emp => emp.Status === "Active");
        setEmployees(activeEmployees);
        setFilteredEmployees(activeEmployees);

        // Extract unique departments from employee data
        const uniqueDepartments = [...new Set(activeEmployees.map(emp => emp.department))];
        setDepartments(uniqueDepartments);

        const initialFormData = activeEmployees.map(emp => ({
          employeeID: emp.employeeID,
          fullName: emp.fullName,
          department: emp.department,
          salaryNet: emp.netSalary,  // Mapping emp.netSalary to formData's salaryNet
          presentCount: "",
          overTime: "",
          eidBonus: "",
          advDeduct: "",
          welfareChecked: false,
          absent: "",
        }));
        setFormData(initialFormData);
      })
      .catch((error) => {
        console.error("Error fetching employee data:", error);
      });
  }, []);

  const handleChange = (index, event) => {
    const { name, value, type, checked } = event.target;
    const updatedFormData = [...formData];
    const employee = filteredEmployees[index];
    const isPondLabor = employee.department === "Pond Labor";

    if (name === "presentCount") {
      // Validate Present Count based on department
      const maxCount = isPondLabor ? 34 : 30;
      if (value === "" || (value >= 1 && value <= maxCount)) {
        updatedFormData[index][name] = value;
        setErrorMessage(""); // Clear error if valid
      } else {
        setErrorMessage(`Present Count must be between 1 and ${maxCount} for ${employee.department}`);
        updatedFormData[index][name] = ""; // Clear invalid input
      }
    } else if (type === "checkbox") {
      updatedFormData[index][name] = checked;
    } else {
      updatedFormData[index][name] = value;
    }

    setFormData(updatedFormData);
  };

  const handleWelfareToggle = () => {
    const newCheckedState = !allWelfareChecked;
    setAllWelfareChecked(newCheckedState);

    const updatedFormData = formData.map((data) => ({
      ...data,
      welfareChecked: newCheckedState,
    }));
    setFormData(updatedFormData);
  };

  const handleDepartmentChange = (event) => {
    const selectedDepartment = event.target.value;
    setDepartment(selectedDepartment);
    setSelectedEmployee("");

    if (selectedDepartment === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(emp => emp.department === selectedDepartment);
      setFilteredEmployees(filtered);
    }
  };

  const handleEmployeeChange = (event) => {
    const selectedName = event.target.value;
    setSelectedEmployee(selectedName);

    const filteredByName = employees.filter(emp => {
      const departmentMatch = department === "" || emp.department === department;
      const employeeMatch = selectedName === "" || emp.fullName === selectedName;
      return departmentMatch && employeeMatch;
    });

    setFilteredEmployees(filteredByName);
  };

  const calculateFields = (employee, index) => {
    const presentDays = parseInt(formData[index]?.presentCount, 10);
    let salaryNet = employee.netSalary;  // Calculations still based on emp.netSalary

    if (employee.department === "Pond Labor") {
      // Special calculation for Pond Labor
      salaryNet = (employee.netSalary / 30) * presentDays;  // Use netSalary for calculation
      const basic = (salaryNet * 60) / 100;
      const homeRent = (salaryNet * 30) / 100;
      const medical = (salaryNet * 6) / 100;
      const travel = (salaryNet * 4) / 100;
      const absent = presentDays < 26 ? 26 - presentDays : 0;
      return { salaryNet, basic, homeRent, medical, travel, pf: 0, hajira: 0, absent };
    } else {
      // Other departments' salary logic
      if (presentDays >= 21 && presentDays <= 31) {
        salaryNet = employee.netSalary;
      } else if (presentDays >= 1 && presentDays <= 20) {
        salaryNet = (employee.netSalary / 30) * presentDays;
      }

      const basic = (salaryNet * 60) / 100;
      const homeRent = (salaryNet * 30) / 100;
      const medical = (salaryNet * 6) / 100;
      const travel = (salaryNet * 4) / 100;
      const pf = (employee.netSalary * 3) / 100;

      let hajira = 0;
      if (presentDays >= 26 && presentDays <= 31) {
        hajira = 1620 * 1.0;
      } else if (presentDays === 25) {
        hajira = 1620 * 0.9;
      } else if (presentDays === 24) {
        hajira = 1620 * 0.8;
      } else if (presentDays === 23) {
        hajira = 1620 * 0.7; 
      } else if (presentDays === 22) {
        hajira = 1620 * 0.6; 
      } else if (presentDays >= 1 && presentDays <= 21) {
        hajira = 1620 * 0.0;
      }

      const absent = presentDays < 26 ? 26 - presentDays : 0;
      return { salaryNet, basic, homeRent, medical, travel, pf, hajira, absent };
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    if (!date) {
      setMessage("Date is required!");
      setTimeout(() => setMessage(''), 5000);
      return;
    }
  
    const missingCount = filteredEmployees.some((_, index) => !formData[index]?.presentCount);
    if (missingCount) {
      setMessage("Present Count is required for all visible employees!");
      setTimeout(() => setMessage(''), 5000);
      return;
    }
  
    // Prepare the salary data to be saved
    const salaryData = filteredEmployees.map((data, index) => {
      const calculated = calculateFields(data, index);
  
      return {
        date: date,
        employeeID: data.employeeID,
        fullName: data.fullName,
        department: data.department,
        salaryNet: calculated.salaryNet,  // Updated to send salaryNet to backend
        presentCount: formData[index].presentCount,
        basic: calculated.basic,
        homeRent: calculated.homeRent,
        medical: calculated.medical,
        travel: calculated.travel,
        welfare: formData[index].welfareChecked ? 1320 : 0,
        hajira: calculated.hajira,
        overTime: formData[index].overTime,
        eidBonus: formData[index].eidBonus,
        pf: calculated.pf,
        advDeduct: formData[index].advDeduct,
        absent: calculated.absent,
      };
    });
  
    // Check if salary data for the same employeeID, fullName, and date exists
    axios
      .get(`https://emp-backend-rffv.onrender.com/salaries?date=${date}`)
      .then((response) => {
        const existingEntries = response.data;
  
        // Filter out entries that are already saved for the same employeeID, fullName, and date
        const duplicates = salaryData.filter((newEntry) => {
          return existingEntries.some(
            (existingEntry) =>
              existingEntry.employeeID === newEntry.employeeID &&
              existingEntry.fullName === newEntry.fullName &&
              existingEntry.date === newEntry.date // Only check for same date
          );
        });
  
        if (duplicates.length > 0) {
          // Construct a message with duplicate employee details
          const duplicateMessage = duplicates
            .map(
              (dup) => ` ${dup.employeeID}-${dup.fullName}`
            )
            .join(", ");
  
          // If there are duplicate entries, show an error message with bg-danger styling
          setMessage(
            <div className="alert alert-danger bg-danger text-white">
              <strong>Duplicate entry detected for the same employees on this date:</strong>
              <br />
              {duplicateMessage}
            </div>
          );
          setTimeout(() => setMessage(''), 5000);
        } else {
          // No duplicates, proceed with saving the salary data
          axios
            .post("https://emp-backend-rffv.onrender.com/salaries", salaryData)
            .then((response) => {
              alert("Are You Sure Data Save");
              setMessage("Salary data saved successfully");
              setTimeout(() => setMessage(''), 5000);
            })
            .catch((error) => {
              console.error("Error saving salary data:", error);
              setMessage("Error saving salary data");
              setTimeout(() => setMessage(''), 5000);
            });
        }
      })
      .catch((error) => {
        console.error("Error checking existing salary data:", error);
        setMessage("Error checking for duplicates");
        setTimeout(() => setMessage(''), 5000);
      });
  };
  
  
  
  
  
  return (
    <div className="container">
      <h2 className="text-center mb-3">Salary Entry Form</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="card p-4">
          <div className="row mb-3">
            <div className="form-group col-4">
              <label>Date</label>
              <input
                type="date"
                name="date"
                className="form-control"
                value={date}
                onChange={event => setDate(event.target.value)}
                required
              />
            </div>
            <div className="form-group col-4">
              <label>Department</label>
              <select
                className="form-control"
                value={department}
                onChange={handleDepartmentChange}
              >
                <option value="">All Departments</option>
                {departments.map((dep, index) => (
                  <option key={index} value={dep}>
                    {dep}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group col-4">
              <label>Employee Name</label>
              <select
                className="form-control"
                value={selectedEmployee}
                onChange={handleEmployeeChange}
              >
                <option value="">All Employees</option>
                {filteredEmployees.map((emp, index) => (
                  <option key={index} value={emp.fullName}>
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <table className="table table-striped table-bordered">
          <thead>
            <tr>
            <th> SL</th>
            <th className="col-1">Emp ID</th>
              <th className="col-2"> Name</th>
              {/* <th>Net Salary</th> */}
              <th>Present Count</th>
              <th>Over Time</th>
              <th>Bonus</th>
              <th>Adv Deduct</th>
              <th onClick={handleWelfareToggle} id="welfareChecked" className="col-1Present Count is required for all visible employees!">Welfare</th>
          
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee, index) => (
              <tr key={employee.employeeID}>
                <td>{index + 1}</td>
                <td>{employee.employeeID}</td>
                <td><p className="bg-success-subtle text-slate-600 font-semibold rounded p-1">{employee.fullName}</p></td>  
                {/* <td>{formData[index]?.salaryNet || employee.netSalary}</td>  */}
            
                <td>
                  <input
                    type="number"
                    name="presentCount"
                    value={formData[index]?.presentCount || ""}
                    onChange={(event) => handleChange(index, event)}
                    className="form-control"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="overTime"
                    value={formData[index]?.overTime || ""}
                    onChange={(event) => handleChange(index, event)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="eidBonus"
                    value={formData[index]?.eidBonus || ""}
                    onChange={(event) => handleChange(index, event)}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="advDeduct"
                    value={formData[index]?.advDeduct || ""}
                    onChange={(event) => handleChange(index, event)}
                    className="form-control"
                  />
                </td>
                <td>
                <label class="switch">
                  <input
                    type="checkbox"
                    name="welfareChecked"
                    checked={formData[index]?.welfareChecked || false}
                    onChange={(event) => handleChange(index, event)}
                  />
                  <span class="slider round"></span>
                  </label>
                </td>
              
              </tr>
            ))}
          </tbody>
        </table>

     

        <button type="submit" className="btn btn-success col-2">
          <p className=" font-bold">
          Submit
          </p>
        </button>
      </form>
    </div>
  );
};

export default SalaryEntry;
