// export default Sidebar;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Custom CSS for hover effects

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdown = (group) => {
    setOpenDropdown(openDropdown === group ? null : group);
  };

  return (
    <div className="sidebar bg-light vh-100 p-3">
      <ul className="list-unstyled">
        {/* Employ Information */}
        <li>
          <button
            className="btn btn-link d-flex justify-content-between align-items-center w-100 text-start"
            onClick={() => handleDropdown('employ')}
          >
            Employ Information
            <span className="caret">{openDropdown === 'employ' ? '-' : '+'}</span>
          </button>
          {openDropdown === 'employ' && (
            <ul className="list-unstyled ps-3">
              <li><Link to="/add-employ" className="dropdown-item">Add Employ</Link></li>
              <li><Link to="/employ-report" className="dropdown-item">Employ Report</Link></li>
              <li><Link to="/Data-Upload" className="dropdown-item">Data Upload</Link></li>
            </ul>
          )}
        </li>

        {/* Salary Information */}
        <li>
          <button
            className="btn btn-link d-flex justify-content-between align-items-center w-100 text-start"
            onClick={() => handleDropdown('salary')}
          >
            Salary Information
            <span className="caret">{openDropdown === 'salary' ? '-' : '+'}</span>
          </button>
          {openDropdown === 'salary' && (
            <ul className="list-unstyled ps-3">
              <li><Link to="/salary-entry" className="dropdown-item">Salary Entry</Link></li>
             
              <li><Link to="/salary-report" className="dropdown-item">Salary Report</Link></li>
              <li><Link to="/salary-sheet" className="dropdown-item">Salary Sheet</Link></li>
            </ul>
          )}
        </li>

        {/* Pond Information */}
        <li>
          <button
            className="btn btn-link d-flex justify-content-between align-items-center w-100 text-start"
            onClick={() => handleDropdown('pond')}
          >
            Pond Information
            <span className="caret">{openDropdown === 'pond' ? '-' : '+'}</span>
          </button>
          {openDropdown === 'pond' && (
            <ul className="list-unstyled ps-3">
              <li><Link to="/add-pond" className="dropdown-item">Add Pond</Link></li>
              <li><Link to="/pond-entry" className="dropdown-item">Pond Entry</Link></li>
              <li><Link to="/pond-report" className="dropdown-item">Pond Report</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
