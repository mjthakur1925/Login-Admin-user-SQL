import React, { useState, useEffect } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ReactPaginate from 'react-paginate';

export default function AdminHome({ userType }) {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    fetchData();
  }, [currentPage, limit]);



  

  // ...
  const fetchData = () => {
    const offset = currentPage * limit;
    fetch(`http://localhost:5000/Users?page=${currentPage + 1}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.data);
        setPageCount(Math.ceil(data.total / limit));
      })
      .catch((error) => console.error("Error fetching users: ", error));
  };
 
  
 

  // ...

  return (
    <div className="auth-wrapper" style={{ height: "auto" }}>
      <div className="auth-inner" style={{ width: "auto" }}>
        <h3>Welcome Admin</h3>
        <table style={{ width: 500 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>User Type</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i) => (
              <tr key={i.id}>
                <td>{i.fname}</td>
                <td>{i.email}</td>
                <td>{i.userType}</td>
                <td>
                  <FontAwesomeIcon
                    icon={faTrash}
                    onClick={() => deleteUser(i.id, i.fname)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ReactPaginate
          pageCount={pageCount}
          onPageChange={handlePageClick}
          previousLabel={"< previous"}
          nextLabel={"next >"}
          breakLabel={"..."}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />

        <input
          placeholder="Limit"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
        <button onClick={limitChanged}>Set Limit</button>

        <button onClick={logOut} className="btn btn-primary">
          Log Out
        </button>
      </div>
    </div>
  );
}
