import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./AdminPage.css";

export default function AdminHome({ userData }) {
  const [showCurrentUserDetails, setShowCurrentUserDetails] = useState(false);
  const [showAllUserDetails, setShowAllUserDetails] = useState(false);
  const [allUsersData, setAllUsersData] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const toggleCurrentUserDetails = () => {
    setShowCurrentUserDetails(!showCurrentUserDetails);
    setShowAllUserDetails(false);
  };

  const toggleAllUserDetails = () => {
    setShowAllUserDetails(!showAllUserDetails);
    setShowCurrentUserDetails(false);
  };

  const logOut = () => {
    window.localStorage.clear();
    window.location.href = "./sign-in";
  };

  const deleteUser = (id, name) => {
    // Implement user deletion here
  };

  const fetchAllUsers = () => {
    let url = "http://localhost:5000/getAllUser";
  
    // Include user type as a query parameter
    if (filterType !== "all") {
      if (filterType !== "all") {
        url += `?userType=${filterType}`;
      } else {
        url += `?userType=all`;
      }
    
    } 
  
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setAllUsersData(data.data);
      })
      .catch((error) => console.error("Error fetching users: ", error));
  };
  
 
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <h3>Welcome Admin</h3>
        <button onClick={toggleCurrentUserDetails}>Show Current User Details</button>
        <button onClick={toggleAllUserDetails}>Show All Users Details</button>

        {showCurrentUserDetails && (
          <div className="user-details-container">
            <h4>Current User Details:</h4>
            <p>Name: {userData.fname}</p>
            <p>Email: {userData.email}</p>
            <p>Phone: {userData.phone}</p>
            <p>Address: {userData.address}</p>
          </div>
        )}

        {showAllUserDetails && (
          <div className="all-users-details-container">
            <h4>All Users Details:</h4>
            <div className="filter-container">
              <label htmlFor="filterType">Filter Users:</label>
              <select
                id="filterType"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Users</option>
                <option value="Admin">Admins</option>
                <option value="User">Only Users</option>
              </select>

              <button onClick={fetchAllUsers}>Fetch</button>
            </div>

            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>User Type</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {allUsersData.map((user) => (
                  <tr key={user._id}>
                    <td>{user.fname}</td>
                    <td>{user.email}</td>
                    <td>{user.userType}</td>
                    <td>
                      <FontAwesomeIcon icon={faTrash} onClick={() => deleteUser(user._id, user.fname)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button onClick={logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    </div>
  );
}