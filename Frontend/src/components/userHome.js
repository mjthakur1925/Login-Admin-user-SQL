import React from "react";
import "./UserHome.css"; // Import the CSS file for styling

export default function UserHome({ userData, logOut }) {
  const handleLogout = () => {
    if (typeof logOut === "function") {
      logOut(); // Call the logOut function if it's a function
    } else {
      console.error("logOut is not a function");
      // You can also display a message or perform other actions here
    }
  };

  return (
    <div className="user-home-container">
      <div className="user-info">
        <h1 className="user-info-heading">User Information</h1>
        {userData ? (
          <div>
            <div className="user-info-item">
              <strong>Name:</strong> {userData.fname}
            </div>
            <div className="user-info-item">
              <strong>Email:</strong> {userData.email}
            </div>
            <div className="user-info-item">
              <strong>Address:</strong> {userData.address}
            </div>
            <div className="user-info-item">
              <strong>Phone no.:</strong> {userData.phone}
            </div>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
      <button onClick={handleLogout} className="btn btn-primary logout-button">
        Log Out
      </button>
    </div>
  );
}


