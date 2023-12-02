// App.js
import React, { useState, useEffect } from "react";
import "./App.css";
import UserTable from "./components/UserTable";
import {
  FaTrash,
  FaChevronLeft,
  FaAngleDoubleLeft,
  FaChevronRight,
  FaAngleDoubleRight,
} from "react-icons/fa";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch data from the provided API endpoint
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // Pagination
  const usersPerPage = 10;
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / usersPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter((user) =>
      Object.values(user).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset to the first page when the search term changes
  }, [searchTerm, users]);

  // Handle page change
  const handlePageChange = (page) => setCurrentPage(page);

  // Handle row selection
  const handleRowSelect = (id) => {
    const isSelected = selectedRows.includes(id);
    if (isSelected) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    const updatedUsers = users.filter(
      (user) => !selectedRows.includes(user.id)
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  // Handle editing a row
  const handleEditRow = (id, updatedData) => {
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, ...updatedData } : user
    );
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };

  // Handle deleting a row
  const handleDeleteRow = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
  };
  //select all users
  const handleSelectAll = () => {
    const allSelected =
      selectedRows.length === currentUsers.length && currentUsers.length > 0;

    if (allSelected) {
      setSelectedRows([]);
    } else {
      const allUserIds = currentUsers.map((user) => user.id);
      setSelectedRows(allUserIds);
    }
  };

  return (
    <div className="App">
      <header>
        <input
          type="text"
          placeholder="Enter Value..."
          value={searchTerm}
          className="input-text"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleBulkDelete} className="delrow">
          <FaTrash />
        </button>
      </header>
      <main>
        <UserTable
          users={currentUsers}
          selectedRows={selectedRows}
          onRowSelect={handleRowSelect}
          onEdit={handleEditRow}
          onDelete={handleDeleteRow}
          handleSelectAll={handleSelectAll}
        />
        <div className="footer">
          <div className="selection-summary">
            {selectedRows.length} out of {currentUsers.length} rows selected
          </div>
          <div className="right-footer">
            <div className="page-summary">
              Page {currentPage} of {totalPages}
            </div>
            <div className="pagination">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <FaAngleDoubleLeft />
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              {pageNumbers.map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? "active" : ""}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * usersPerPage >= totalUsers}
              >
                <FaChevronRight />
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage * usersPerPage >= totalUsers}
              >
                <FaAngleDoubleRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
