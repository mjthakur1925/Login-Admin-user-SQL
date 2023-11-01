import React, { useEffect, useState } from "react";
import AdminHome from "./adminHome";
import UserHome from "./userHome";

export default function UserDetails() {
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
   
   /* const token = window.localStorage.getItem("token");
    console.log(localStorage); // This will log the entire localStorage object
*/
// After successfully logging in and receiving a token
const token = "token"; // Replace with the actual token
localStorage.setItem("token", token);
console.log(localStorage);

    if (!token) {
      alert("Token not found. Please login.");
      window.location.href = "./sign-in";
      return;
    }

    fetch("http://localhost:5000/Users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        token: token,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
       /* if (data.status === "ok") 
       {*/
          if (data.userType === "Admin") {
            setIsAdmin(true);
          }
        
         /*else {
          alert("Error fetching user data.");
        } */ 
        setUserData(data);
      })
      
      .catch((error) => {
        console.error("Error fetching user data:", error);
        alert("Something went wrong.");
      });
  }, []);

  const logOut = () => {
    // Clear the authentication token from localStorage
    localStorage.removeItem("token");
    
    // Redirect to the login page
    window.location.href = "./sign-in";
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {isAdmin ? (
          <AdminHome userData={userData} logOut={logOut} />
        ) : (
          <UserHome userData={userData} logOut={logOut} />
        )}
      </div>
    </div>
  );
}