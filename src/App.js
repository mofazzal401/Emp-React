import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './Siderbar/Sidebar';
import AddEmploy from './Employ/Add_Employ';
import EmployReport from './Employ/Emp_Report';
import GetData from './Employ/Get_Data';
import SalaryEntry from './Salary/Salary_Entry';
import SalaryDetails from './Salary/Salary-Details';
import SalaryReport from './Salary/Salary_Report';
import Details from './Employ/Emp_Details';
import EmployEdit from './Employ/Employ_Edit';
import SalarySheet from './Salary/Salary_Sheet';

// Pond Mouduls 

import AddPond from './Pond/Add_Pond';
import PondEntry from './Pond/Pond_Entry';
import PondReport from './Pond/Pond_Report';
import DataUpload from './Employ/Data_Upload'

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="content p-3 flex-grow-1">
          <Routes>
            <Route path="/add-employ" element={<AddEmploy />} />
            <Route path="/employ-report" element={<EmployReport />} />
            <Route path="/Get-Data" element={<GetData />} />
            <Route path="/details/:id" element={<Details />} />
            <Route path="/edit/:id" element={<EmployEdit />} />
            <Route path="/Data-Upload" element={<DataUpload />} />
            <Route path="/salary-entry" element={<SalaryEntry />} />
            {/* <Route path="/" element={<SalaryReport />} /> */}
            <Route path="/salary-details/:id" element={<SalaryDetails />} />
            <Route path="/salary-report" element={<SalaryReport />} />
            <Route path="/salary-sheet" element={<SalarySheet />} />
            <Route path="/add-pond" element={<AddPond />} />
            <Route path="/pond-entry" element={<PondEntry />} />
            <Route path="/pond-report" element={<PondReport />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

